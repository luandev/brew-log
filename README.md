# Brew Log

Markdown-first homebrew journal for cider, wine, and experimental fermentation.

The Git repository is the source of truth. Each brew batch has its own recipe, chronological log, schedule, tasting notes, and media notes.

## Quick start

- [PRD.md](PRD.md) — product definition
- [AGENTS.md](AGENTS.md) — AI editing rules
- [templates/batch/](templates/batch/) — template for new batches
- [brews/](brews/) — actual brew records

## Local preview

```bash
bundle install
ruby scripts/generate_site_data.rb
bundle exec jekyll serve
```

Open `http://localhost:4000/brew-log/`.

## Public site

Deployed to GitHub Pages at `https://luandev.github.io/brew-log/`.

Batch pages: `https://luandev.github.io/brew-log/brews/<batch_id>/`
