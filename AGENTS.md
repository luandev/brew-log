# AI Agent Instructions

This repository is a brewing journal and static website.

## Specialized agents

- [docs/log-entry-agent.md](docs/log-entry-agent.md) — **adding batch records**: new batches, log entries, schedule updates, tasting notes (for ChatGPT Custom GPT, Cursor, etc.)

## Rules

- Markdown is the source of truth.
- Never invent measurements, ingredients, dates, ABV, gravity, or tasting observations.
- Preserve historical log entries.
- Add corrections as new log entries when possible.
- Keep batch IDs stable.
- Do not rename existing batch folders without explicit instruction.
- Prefer small changes.
- Update relevant README files when structure changes.
- Keep GitHub Pages compatibility.
- Avoid adding a database or backend unless explicitly requested.

## Creating a new batch

1. Copy `templates/batch/` to `brews/<year>/<YYYY-NNN-short-kebab-case-name>/`.
2. Set front matter in `README.md`:
   - `batch_id` must match the folder number (e.g. `2026-001`).
   - `permalink` must be `/brews/<batch_id>/` (used for QR code labels).
   - `type` is one of: `cider`, `wine`, `beer`, `vinegar`, `mead`, `experimental`.
3. Fill `recipe.md` with ingredients and planned process.
4. Add log entries to `log.md` in chronological order (append only).
5. Maintain `schedule.md` with upcoming actions (`Pending`, `Done`, `Skipped`).
6. Add tasting notes to `tasting.md` when sampling.
7. Reference photos in `media.md`; store files in `assets/brews/<batch_id>/`.

## Updating an active batch

1. Append a new dated section to `log.md` — do not rewrite past entries.
2. Update `status` in `README.md` front matter when the stage changes.
3. Mark completed schedule rows as `Done` and add new `Pending` rows as needed.
4. Update `recipe.md` if the actual process diverged from the plan.

## Public batch URL (for QR labels)

```
https://luandev.github.io/brew-log/brews/<batch_id>/
```

Example: `https://luandev.github.io/brew-log/brews/2026-001/`

Site title: **The Lone Tree Orchard**

## Build

Requires Ruby 3.3 (see `.ruby-version`). Before previewing or deploying, run:

```bash
bundle install
ruby scripts/generate_site_data.rb
bundle exec jekyll serve
```

The build script regenerates `_data/batches.json` from batch folders.
