# Architecture

The project is a Markdown-first GitHub Pages site. The public UI is an Expo Router (React Native Web) app exported as static HTML.

## Source of truth

`brews/` contains the canonical brewing records. Each batch is a folder with Markdown files — no database.

## Build pipeline

```text
brews/*/*/README.md  →  scripts/generate_site_data.rb|.mjs  →  _data/*.json and src/data/*.json
src/ + app/          →  expo export --platform web          →  dist/
dist/                →  Playwright e2e, then GitHub Actions →  GitHub Pages
```

1. **`scripts/generate_site_data.rb`** (Ruby, when available) or **`scripts/generate_site_data.mjs`** scans batch folders, parses YAML front matter, and writes derived schedule/log/recipe fields into `_data/` and `src/data/`.
2. **Expo Router** statically renders journal routes from that JSON.
3. **`scripts/prepare_dist.mjs`** copies brew photos, turns `.html` files into trailing-slash folders, and writes `.nojekyll`.
4. **Playwright** serves `dist/` under `/brew-log/` and must pass before the Pages artifact is uploaded.
5. **GitHub Actions** (`.github/workflows/pages.yml`) deploys `dist/`.

## Data

- Batch metadata lives in YAML front matter (`README.md`).
- Detailed information lives in sibling Markdown files.
- Aggregated index data lives in `_data/batches.json` (generated, not hand-edited). The Expo app imports the copy in `src/data/`.

## URLs

| Page | URL pattern |
|---|---|
| Home | `/brew-log/` |
| Batch page | `/brew-log/brews/<batch_id>/` |
| Active brews | `/brew-log/pages/active/` |
| Schedule | `/brew-log/pages/schedule/` |

Batch permalinks are based on immutable `batch_id` (e.g. `/brews/2026-001/`), suitable for QR code labels.

## Local preview

Requires **Node.js 22**. Ruby 3.3 is optional (see `.ruby-version`).

```bash
npm install
npm run web
```

Production-shaped preview:

```bash
npm run export:web
npm run serve:export
```

Open `http://127.0.0.1:4173/brew-log/`.

## Stack

- **Expo 57** with Expo Router static web output
- **React Native Web** for the journal UI
- **Node** (and optionally **Ruby 3.3**) to generate JSON from Markdown
- **Playwright** (Chromium) for a minimal e2e gate
- **GitHub Actions** for build, test, and deploy

## Rendering

- Routes live in `app/`
- Shared UI lives in `src/components/`
- Theme tokens live in `src/theme.ts`
- Batch pages are generated with `generateStaticParams` from `src/data/batches.json`
