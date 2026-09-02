# Brews

Canonical brewing records live here. Each batch is a folder with Markdown files.

## Adding a new batch

1. Choose the next batch ID for the year (e.g. `2026-002`).
2. Copy `templates/batch/` to `brews/<year>/<YYYY-NNN-short-kebab-case-name>/`.
3. Update front matter in `README.md`:
   - `batch_id` — must match the folder number
   - `permalink` — must be `/brews/<batch_id>/`
   - `name`, `type`, `status`, `started`, and optional fields
   - `status` must match the `active` row in `stages.md`
4. Fill all seven template files: `recipe.md`, `log.md`, `schedule.md`, `stages.md`, `tasting.md`, `media.md`, plus `README.md`.
5. Run `ruby scripts/generate_site_data.rb` to regenerate the site index and check validation warnings.
6. Commit and push.

## Folder naming

```
brews/<year>/<YYYY-NNN-short-kebab-case-name>/
```

Example: `brews/2026/2026-001-apple-golden-syrup-wine/`

Rules:

- Year resets the sequence each calendar year.
- Three-digit batch number (`001`, `002`, …).
- Lowercase kebab-case name.
- Folder name never changes after the batch starts.

## Batch types

`cider`, `wine`, `beer`, `vinegar`, `mead`, `experimental`

## Public URL

Each batch is published at:

```
https://luandev.github.io/brew-log/brews/<batch_id>/
```

Use this URL for QR code labels.

## Photos

Store images in `assets/brews/<batch_id>/` and reference them in `media.md`.
