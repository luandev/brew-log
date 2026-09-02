#!/usr/bin/env python3
"""Slice 8x8 LTO icon pack grids into transparent PNG tiles."""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Pillow is required: pip install pillow") from exc

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "icons"
GRID = 8
BLACK_THRESHOLD = 22
BRIGHT_THRESHOLD = 38
CANVAS_SIZE = 128
CELL_INSET_RATIO = 0.12
CONTENT_FILL = 0.96


def key_black_to_alpha(image: Image.Image, threshold: int = BLACK_THRESHOLD) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def bright_mask(image: Image.Image, lum_threshold: int = BRIGHT_THRESHOLD, alpha_threshold: int = 20):
    pixels = image.load()
    width, height = image.size
    mask = [[False] * width for _ in range(height)]
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a < alpha_threshold:
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if lum >= lum_threshold:
                mask[y][x] = True
    return mask


def bright_content_bbox(
    image: Image.Image,
    lum_threshold: int = BRIGHT_THRESHOLD,
    alpha_threshold: int = 20,
) -> tuple[int, int, int, int] | None:
    mask = bright_mask(image, lum_threshold, alpha_threshold)
    min_x, min_y = image.width, image.height
    max_x, max_y = -1, -1
    for y, row in enumerate(mask):
        for x, on in enumerate(row):
            if not on:
                continue
            if x < min_x:
                min_x = x
            if y < min_y:
                min_y = y
            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y
    if max_x < 0:
        return image.getbbox()
    return (min_x, min_y, max_x + 1, max_y + 1)


def bright_centroid(image: Image.Image) -> tuple[float, float] | None:
    mask = bright_mask(image)
    total = 0
    sum_x = 0.0
    sum_y = 0.0
    for y, row in enumerate(mask):
        for x, on in enumerate(row):
            if not on:
                continue
            total += 1
            sum_x += x
            sum_y += y
    if total == 0:
        return None
    return (sum_x / total, sum_y / total)


def trim_to_content(image: Image.Image, padding: int = 2) -> Image.Image:
    bbox = bright_content_bbox(image) or image.getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def fit_to_square(image: Image.Image, size: int = CANVAS_SIZE, fill: float = CONTENT_FILL) -> Image.Image:
    if image.width == 0 or image.height == 0:
        return Image.new("RGBA", (size, size), (0, 0, 0, 0))

    target = max(1, int(size * fill))
    scale = min(target / image.width, target / image.height)
    new_w = max(1, int(round(image.width * scale)))
    new_h = max(1, int(round(image.height * scale)))
    resized = image.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    # Optical center: keep the bright-pixel centroid near canvas center
    centroid = bright_centroid(resized)
    if centroid:
        offset_x = int(round(size / 2 - centroid[0]))
        offset_y = int(round(size / 2 - centroid[1]))
    else:
        offset_x = (size - new_w) // 2
        offset_y = (size - new_h) // 2

    # Clamp so artwork stays mostly on-canvas
    offset_x = min(max(offset_x, -new_w // 4), size - (new_w * 3) // 4)
    offset_y = min(max(offset_y, -new_h // 4), size - (new_h * 3) // 4)
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas


def cell_box(index: int, cell_w: int, cell_h: int) -> tuple[int, int, int, int]:
    row, col = divmod(index, GRID)
    inset_x = max(1, int(round(cell_w * CELL_INSET_RATIO)))
    inset_y = max(1, int(round(cell_h * CELL_INSET_RATIO)))
    left = col * cell_w + inset_x
    top = row * cell_h + inset_y
    right = (col + 1) * cell_w - inset_x
    bottom = (row + 1) * cell_h - inset_y
    return (left, top, right, bottom)


def slice_grid(source: Path, manifest: list[dict], out_dir: Path) -> None:
    if not source.exists():
        raise SystemExit(f"Missing source image: {source}")
    if len(manifest) != GRID * GRID:
        raise SystemExit(f"Expected {GRID * GRID} manifest entries, got {len(manifest)}")

    image = Image.open(source)
    cell_w = image.width // GRID
    cell_h = image.height // GRID
    out_dir.mkdir(parents=True, exist_ok=True)

    for index, entry in enumerate(manifest):
        tile = fit_to_square(
            trim_to_content(key_black_to_alpha(image.crop(cell_box(index, cell_w, cell_h))))
        )
        target = out_dir / entry["file"]
        tile.save(target, "PNG")
        print(f"wrote {target.relative_to(ROOT)}")


def main() -> None:
    pack = (sys.argv[1] if len(sys.argv) > 1 else "main").lower()

    if pack == "main":
        source = OUT_DIR / "icon-pack-source.png"
        manifest = json.loads((OUT_DIR / "manifest.json").read_text(encoding="utf-8"))
        slice_grid(source, manifest, OUT_DIR)
        print(f"Done — {len(manifest)} main icons")
        return

    if pack == "extras":
        source = OUT_DIR / "icon-pack-extras-source.png"
        manifest = json.loads((OUT_DIR / "manifest-extras.json").read_text(encoding="utf-8"))
        out_dir = OUT_DIR / "extras"
        slice_grid(source, manifest, out_dir)
        print(f"Done — {len(manifest)} extra icons")
        return

    raise SystemExit("Usage: python scripts/slice_icon_pack.py [main|extras]")


if __name__ == "__main__":
    main()
