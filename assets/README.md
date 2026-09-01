# Assets

Static assets for the GitHub Pages site.

## Brand (`brand/`)

Orchard identity and interim mockup artwork:

| File | Use |
|---|---|
| `hero-dashboard.png` | Reference mockup only — do not use in CSS |
| `tree.svg` | Hero decorative tree illustration |
| `seal.svg` | Header logo |
| `hero-full.png` | Footer landscape reference |
| `brand-kit.png` | Color and style reference |

Replace with extracted SVGs and optimized crops when final artwork is ready.

## Batch photos

Store batch photos at:

```
assets/brews/<batch_id>/
```

Reference files in the batch's `media.md`.

## Site styles

Custom SCSS lives in `_sass/custom.scss` and is imported via `assets/main.scss`.
