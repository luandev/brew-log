# Data Model

## Batch

Required metadata (YAML front matter in `README.md`):

| Field | Description |
|---|---|
| `batch_id` | Unique ID, format `YYYY-NNN` (e.g. `2026-001`) |
| `name` | Display name |
| `title` | Page title (should match `name`; used by Jekyll for browser tab) |
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
| `target_days` | Optional expected batch duration in days (for progress ring) |
| `thumbnail` | Optional card image path (e.g. `assets/brews/2026-001/thumb.jpg`) |

### Status values

Defined in `_data/statuses.json`. See the [Status Guide](/pages/status-guide/) for descriptions, linked recipe/log/schedule sections, and typical next stages.

`planned`, `preparing`, `primary-fermentation`, `secondary`, `clearing`, `conditioning`, `bottled`, `aging`, `finished`, `failed`, `archived`

A batch is considered **active** when status is not `finished`, `failed`, or `archived`.

### Stage and schedule alignment

Three files must stay in sync for active batches:

| File | Role |
|---|---|
| `README.md` | `status` must equal the `active` row in `stages.md`; `started` should match that row's Started date |
| `stages.md` | Dated stage timeline; exactly one `active` row; at least one `planned` next stage from the Status Guide |
| `schedule.md` | `Pending` actions for the current active stage; mark rows `Done` when complete |

`recipe.md` **Fermentation Stages** is the narrative plan; dated timelines live in `stages.md`.

### Build validation

`ruby scripts/generate_site_data.rb` prints **warnings** (non-blocking) when:

- `README.md` `status` does not match the active stage in `stages.md`
- More than one (or zero) `active` stage rows on an active batch
- Active stage missing a Started date
- Completed stage missing Started or Ended
- No `planned` row matching a valid next stage from `_data/statuses.json`
- No `Pending` schedule rows while a stage is active
- Unknown stage ID in `stages.md`

### Derived fields (build script)

These are written to `_data/batches.json` at build time:

| Field | Source |
|---|---|
| `next_action` | Earliest `Pending` row in `schedule.md` |
| `next_action_date` | Date column of that row |
| `last_log_date` | Most recent `## YYYY-MM-DD` heading in `log.md` |
| `latest_log_excerpt` | First `### Observation` from the latest log entry |
| `days_elapsed` | Days since `started` |
| `target_days` | From front matter, or inferred from schedule, or 28 |
| `end_date` | `started` + `target_days` (process bar end on schedule calendar) |
| `progress_percent` | `days_elapsed / target_days` capped at 100 |
| `pending_schedule` | All `Pending` rows from `schedule.md` |
| `schedule` | All rows from `schedule.md` (for batch calendar) |
| `stages` | Stage spans from `stages.md` with start/end dates |
| `current_stage` | Stage ID of the row marked `active` |
| `current_stage_label` | Human label for the active stage |
| `thumbnail` | From front matter or type-based placeholder |
| `is_active` | Computed from `status` |
| `url` | `/brews/<batch_id>/` |

### Schedule index (`_data/schedule.json`)

Flat list of all pending tasks across active batches, sorted by date:

| Field | Description |
|---|---|
| `date` | Task date (`YYYY-MM-DD`) |
| `action` | Task description |
| `batch_id` | Batch ID |
| `name` | Batch display name |
| `url` | Batch page path |

### Calendar index (`_data/calendar.json`)

Combined payload for the schedule calendar page:

| Field | Description |
|---|---|
| `today` | Build date (`YYYY-MM-DD`) |
| `batches` | Active batches with current stage labels |
| `stages` | Stage spans with `started`, `ended`, `label`, and `status` for calendar bars |
| `tasks` | Same entries as `_data/schedule.json` |

## Supporting files

Each batch folder contains:

| File | Purpose |
|---|---|
| `README.md` | Overview, metadata, and batch page entry point |
| `recipe.md` | Ingredients, targets, process, bottling |
| `log.md` | Chronological journal (append-only) |
| `schedule.md` | Upcoming actions and target dates |
| `stages.md` | Fermentation stage timeline (start, end, status per stage) |
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
