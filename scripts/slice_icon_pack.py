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
BLACK_THRESHOLD = 18
CANVAS_SIZE = 128


def key_black_to_alpha(image: Image.Image, threshold: int = BLACK_THRESHOLD) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (r, g, b, 0)
            elif a == 0:
                pixels[x, y] = (r, g, b, 255)
    return rgba


def trim_transparent_padding(image: Image.Image, padding: int = 2) -> Image.Image:
    bbox = image.getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def pad_to_square(image: Image.Image, size: int = CANVAS_SIZE) -> Image.Image:
    if image.width > size or image.height > size:
        image.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset_x = (size - image.width) // 2
    offset_y = (size - image.height) // 2
    canvas.paste(image, (offset_x, offset_y), image)
    return canvas


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
        row, col = divmod(index, GRID)
        box = (col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h)
        tile = pad_to_square(trim_transparent_padding(key_black_to_alpha(image.crop(box))))
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
