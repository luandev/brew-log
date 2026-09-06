# The Lone Tree Orchard — Brew Log

Markdown-first homebrew journal for cider, wine, and experimental fermentation.

The Git repository is the source of truth. Each brew batch has its own recipe, chronological log, schedule, tasting notes, and media notes.

**Live site:** [luandev.github.io/brew-log](https://luandev.github.io/brew-log/)

## Quick start

- [PRD.md](PRD.md) — product definition
- [AGENTS.md](AGENTS.md) — AI editing rules
- [templates/batch/](templates/batch/) — template for new batches
- [brews/](brews/) — actual brew records

## Local preview

Requires **Node.js 22** and optionally **Ruby 3.3** (see `.ruby-version`). The site generator prefers Ruby when it is on `PATH`, and otherwise uses the Node generator.

```bash
npm install
npm run web
```

Open the Expo web URL (the app is served under `/brew-log/`).

To export the GitHub Pages artifact locally:

```bash
npm run export:web
npm run serve:export
```

Then open `http://127.0.0.1:4173/brew-log/`.

The public site is an **Expo Router** static export. Markdown brew records stay the source of truth.

## Tests

After `npm run export:web`:

```bash
npx playwright install chromium
npm run test:e2e
```

## Public site

Deployed to GitHub Pages at `https://luandev.github.io/brew-log/`.

Batch pages: `https://luandev.github.io/brew-log/brews/<batch_id>/`
