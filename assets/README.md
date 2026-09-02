# Assets

Static assets for the GitHub Pages site.

## Brand (`brand/`)

Orchard identity and interim mockup artwork:

| File | Use |
|---|---|
| `hero.png` | Home masthead background illustration |
| `hero-dashboard.png` | Reference mockup only — do not use in CSS |
| `tree.svg` | Decorative tree icon (fallback/reference) |
| `seal.svg` | Legacy header logo (replaced by icon pack) |
| `branch-divider.svg` | Legacy divider (replaced by icon pack) |
| `hero-full.png` | Footer landscape reference |
| `brand-kit.png` | Color and style reference |

## Icon pack (`icons/`)

Two 8×8 engraved grids sliced into transparent PNGs (black keyed out on export).

| File / folder | Purpose |
|---|---|
| `manifest.json` | Main pack — 64 icons (row-major order) |
| `icon-pack-source.png` | Main grid source |
| `manifest-extras.json` | Supplementary pack — seals, ingredients, tools, UI |
| `icon-pack-extras-source.png` | Extras grid source |
| `extras/` | Supplementary transparent PNGs |
| `*.png` | Main transparent icons |

Regenerate after updating a source grid:

```bash
python scripts/slice_icon_pack.py main
python scripts/slice_icon_pack.py extras
```

Use in Liquid templates:

```liquid
{% include icon.html id="lone-tree-seal" icon_size="md" decorative=true %}
{% include icon.html status_id="primary-fermentation" icon_size="sm" decorative=true %}
{% include icon.html brew_type="cider" icon_size="lg" decorative=true %}
{% include icon.html id="extras/wine-barrel" icon_size="md" decorative=true %}
```

Status, brew-type, and dashboard section mappings live in `_data/icon_lookup.json`.
Paths prefixed with `extras/` resolve to `assets/icons/extras/`.

## Batch photos

Store batch photos at:

```
assets/brews/<batch_id>/
```

Reference files in the batch's `media.md`.

## Site styles

Custom SCSS lives in `_sass/custom.scss` and is imported via `assets/main.scss`.
