# Data Model

## Batch

Required metadata (YAML front matter in `README.md`):

| Field | Description |
|---|---|
| `batch_id` | Unique ID, format `YYYY-NNN` (e.g. `2026-001`) |
| `name` | Display name |
| `type` | One of: `cider`, `wine`, `beer`, `vinegar`, `mead`, `experimental` |
| `status` | Lifecycle status (see below) |
| `started` | Start date (`YYYY-MM-DD`) |
| `permalink` | Site URL path, must match `/brews/<batch_id>/` |

Optional metadata:

| Field | Description |
|---|---|
| `volume_l` | Batch volume in litres |
| `target_abv` | Target ABV (%) |
| `actual_abv` | Measured ABV (%) |
| `tags` | List of tags for filtering |

### Status values

`planned`, `preparing`, `primary-fermentation`, `secondary`, `clearing`, `conditioning`, `bottled`, `aging`, `finished`, `failed`, `archived`

A batch is considered **active** when status is not `finished`, `failed`, or `archived`.

### Derived fields (build script)

These are written to `_data/batches.json` at build time:

| Field | Source |
|---|---|
| `next_action` | Earliest `Pending` row in `schedule.md` |
| `next_action_date` | Date column of that row |
| `last_log_date` | Most recent `## YYYY-MM-DD` heading in `log.md` |
| `is_active` | Computed from `status` |
| `url` | `/brews/<batch_id>/` |

## Supporting files

Each batch folder contains:

| File | Purpose |
|---|---|
| `README.md` | Overview, metadata, and batch page entry point |
| `recipe.md` | Ingredients, targets, process, bottling |
| `log.md` | Chronological journal (append-only) |
| `schedule.md` | Upcoming actions and target dates |
| `tasting.md` | Tasting notes |
| `media.md` | Photo references |

## Folder naming

```
brews/<year>/<YYYY-NNN-short-kebab-case-name>/
```

Example: `brews/2026/2026-001-apple-golden-syrup-wine/`

The folder name must not change after the batch starts. The display name in front matter may change.

## Photos

Store images at `assets/brews/<batch_id>/` and reference paths in `media.md`.
