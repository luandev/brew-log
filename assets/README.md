# Assets

Static files copied into the Expo web export.

## Brand (`brand/`)

| File | Use |
|---|---|
| `tree.svg` | Decorative tree |
| `seal.svg` | Header seal |
| `branch-divider.svg` | Divider ornament |

## Icon pack (`icons/`)

Optional PNG icon grids and manifests. The Expo journal currently uses SVG brand marks and text; PNGs are copied into `dist/assets/icons/` when present.

## Batch photos

Store batch photos at:

```
assets/brews/<batch_id>/
```

Reference files in the batch's `media.md`. The export copies this folder into `dist/assets/brews/`.
