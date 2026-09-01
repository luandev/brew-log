# Assets

Static assets for the GitHub Pages site.

## Batch photos

Store batch photos at:

```
assets/brews/<batch_id>/
```

Example: `assets/brews/2026-001/day-1-setup.jpg`

Reference files in the batch's `media.md`:

```markdown
- File: `assets/brews/2026-001/day-1-setup.jpg`
- Description: Fermentation vessel after pitching yeast.
```

## Site styles

Custom SCSS lives in `_sass/custom.scss` and is imported via `assets/main.scss`.
