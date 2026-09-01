# Architecture

The project is a static, Markdown-first GitHub Pages site built with Jekyll and the Minima theme.

## Source of truth

`brews/` contains the canonical brewing records. Each batch is a folder with Markdown files — no database.

## Build pipeline

```text
brews/*/*/README.md  →  scripts/generate_site_data.rb  →  _data/batches.json
brews/ + _data/      →  bundle exec jekyll build         →  _site/
_site/               →  GitHub Actions deploy           →  GitHub Pages
```

1. **`scripts/generate_site_data.rb`** scans batch folders, parses YAML front matter from each `README.md`, and derives schedule/log metadata into `_data/batches.json`.
2. **Jekyll** renders the site. Batch `README.md` files use `{% include_relative %}` to assemble recipe, log, schedule, tasting, and media into a single page.
3. **GitHub Actions** (`.github/workflows/pages.yml`) runs the script and Jekyll build on every push to `main`.

## Data

- Batch metadata lives in YAML front matter (`README.md`).
- Detailed information lives in sibling Markdown files.
- Aggregated index data lives in `_data/batches.json` (generated, not hand-edited).

## URLs

| Page | URL pattern |
|---|---|
| Home | `/brew-log/` |
| Batch page | `/brew-log/brews/<batch_id>/` |
| Active brews | `/brew-log/pages/active/` |
| Schedule | `/brew-log/pages/schedule/` |

Batch permalinks are based on immutable `batch_id` (e.g. `/brews/2026-001/`), suitable for QR code labels.

## Local preview

```bash
bundle install
ruby scripts/generate_site_data.rb
bundle exec jekyll serve
```

Open `http://localhost:4000/brew-log/`.

## Rendering

- Theme: Minima (GitHub Pages default)
- Custom styles: `_sass/custom.scss` via `assets/main.scss`
- Batch layout: `_layouts/batch.html`
- List cards: `_includes/batch-card.html`
