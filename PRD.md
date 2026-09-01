# Brew Log — Product Requirements Document

## 1. Product Summary

Brew Log is a small, Markdown-first website and repository for documenting homebrew cider, wine, and other fermentation batches.

Each batch is treated as its own recipe and ongoing log. The repository is the source of truth, Git is the history, and GitHub Pages publishes the public-facing site.

The project should remain simple enough that batches can be created or edited manually or by AI without requiring a database, CMS, or custom backend.

---

## 2. Goals

- Keep a permanent record of every brew batch.
- Store recipes, measurements, dates, observations, photos, and tasting notes.
- Track what needs to happen next for active batches.
- Publish selected brew information as a simple GitHub Pages website.
- Make the repository easy for AI coding agents to understand and edit.
- Keep all brew data in readable Markdown files.
- Preserve history through Git commits and pull requests.
- Allow old batches to become a searchable archive.

---

## 3. Non-Goals

Initial versions do not need:

- User accounts.
- A database.
- Cloud backend services.
- Complex JavaScript frameworks.
- Live fermentation sensor integration.
- Inventory management.
- Social features.
- Commercial brewing compliance tooling.

These may be considered later.

---

## 4. Core Concepts

### Brew

A broad category such as:

- Cider
- Wine
- Mead / honey-free mead-style brew
- Fruit wine
- Experimental fermentation

### Batch

A single brewing attempt.

Each batch has:

- Unique batch ID
- Name
- Type
- Status
- Start date
- Recipe
- Initial measurements
- Process log
- Schedule / next actions
- Final measurements
- Bottling details
- Tasting notes
- Lessons learned

Each batch is stored in its own folder.

---

## 5. Batch Lifecycle

Recommended statuses:

1. `planned`
2. `preparing`
3. `primary-fermentation`
4. `secondary`
5. `clearing`
6. `conditioning`
7. `bottled`
8. `aging`
9. `finished`
10. `failed`
11. `archived`

A batch can skip stages when appropriate.

---

## 6. Batch Folder Format

Example:

```text
brews/
  2026/
    2026-001-apple-golden-syrup-wine/
      README.md
      recipe.md
      log.md
      schedule.md
      tasting.md
      media.md
```

The batch folder is the canonical record for that brew.

### README.md

Short overview and metadata.

### recipe.md

Ingredients, quantities, equipment, yeast, target ABV, process, and planned method.

### log.md

Chronological journal.

### schedule.md

Upcoming actions and target dates.

### tasting.md

Tasting notes during fermentation, conditioning, and after aging.

### media.md

Photo references and notes about images.

---

## 7. Batch Metadata

Every batch README should begin with YAML front matter.

Example:

```yaml
---
batch_id: 2026-001
name: Apple & Golden Syrup Wine
type: wine
status: primary-fermentation
started: 2026-08-31
volume_l: 1.2
target_abv: 12
actual_abv:
tags:
  - apple
  - golden-syrup
---
```

The site generator should use this metadata to build lists and batch pages.

---

## 8. Brew Log Requirements

The project must support chronological entries.

Recommended format:

```md
## 2026-08-31 — Day 1

**Time:** 19:30  
**Stage:** Primary fermentation

### Measurements

- Volume: 1.2 L
- Potential ABV: 10%
- Temperature: 20 °C

### Actions

- Added apple juice.
- Added golden syrup.
- Added yeast.

### Observation

Fermentation vessel prepared and placed away from direct sunlight.

### Next

- Check fermentation activity tomorrow.
```

Logs must be append-only in spirit. Corrections should normally be added as new entries rather than silently rewriting historical observations.

---

## 9. Scheduling Requirements

Every active batch has a `schedule.md`.

Example:

```md
# Schedule

| Date | Action | Status |
|---|---|---|
| 2026-09-01 | Check fermentation activity | Pending |
| 2026-09-07 | Take hydrometer reading | Pending |
| 2026-09-14 | Check whether ready to rack | Pending |
| 2026-10-01 | First tasting | Pending |
```

The website should provide one combined view showing the next scheduled action for all active batches.

No external calendar integration is required for v1.

---

## 10. Recipe Requirements

A recipe should record:

- Ingredients
- Quantity and units
- Water / juice volume
- Sugar sources
- Yeast
- Yeast nutrient
- Tea / tannin additions
- Fruit
- Herbs
- Spices
- Acids
- Starting gravity
- Target final gravity
- Target ABV
- Fermentation temperature
- Planned fermentation stages
- Bottling method
- Priming sugar if applicable

Recipes must describe what actually happened, not just the original plan.

If the recipe changes during fermentation, log the change and update the final recipe.

---

## 11. Measurements

The data model should allow:

- Original gravity / SG
- Potential alcohol reading
- Final gravity
- Calculated ABV
- pH
- Temperature
- Volume
- Sugar additions
- Dates

Measurements may initially remain Markdown tables.

A later version may parse them automatically.

---

## 12. Website

The site will be hosted on GitHub Pages.

### Pages

Minimum pages:

- Home
- Active Brews
- All Batches
- Ciders
- Wines
- Brew Schedule
- About / Brewing Notes

### Home

Should show:

- Active batches
- Latest log updates
- Next scheduled brew actions
- Recently completed batches

### Batch Page

A batch page should display:

- Name
- Batch number
- Type
- Status
- Start date
- Recipe
- Current stage
- Measurements
- Timeline / log
- Schedule
- Tasting notes
- Photos when available

---

## 13. GitHub Pages

Use GitHub Pages as the hosting platform.

Prefer a minimal static-site approach that works directly with Markdown.

The implementation should favor:

- GitHub Pages compatibility
- Low maintenance
- No server
- No database
- Human-readable repository structure
- Fast builds
- Simple local preview

Jekyll is acceptable because GitHub Pages supports it natively, but the implementation team may propose another static approach if it preserves the Markdown-first design.

---

## 14. AI-Friendly Repository

The repository will frequently be modified by AI coding agents.

Requirements:

- Every important directory contains a `README.md`.
- Root contains `AGENTS.md`.
- Root contains `ARCHITECTURE.md`.
- Root contains `CONTRIBUTING.md`.
- Root contains `DATA_MODEL.md`.
- Root contains this `PRD.md`.
- Naming conventions are explicitly documented.
- AI agents must not invent brew measurements.
- AI agents must preserve historical brew logs.
- AI agents should prefer small, reviewable pull requests.
- AI agents should update documentation when structure changes.

---

## 15. Repository Structure

```text
/
├── README.md
├── PRD.md
├── AGENTS.md
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── CONTRIBUTING.md
├── _config.yml
├── index.md
│
├── brews/
│   ├── README.md
│   ├── 2026/
│   │   ├── README.md
│   │   └── <batch-folder>/
│
├── templates/
│   ├── README.md
│   ├── batch/
│   │   ├── README.md
│   │   ├── recipe.md
│   │   ├── log.md
│   │   ├── schedule.md
│   │   ├── tasting.md
│   │   └── media.md
│
├── pages/
│   ├── README.md
│   ├── active.md
│   ├── batches.md
│   ├── ciders.md
│   ├── wines.md
│   └── schedule.md
│
├── docs/
│   ├── README.md
│   ├── brewing-notes.md
│   └── glossary.md
│
└── assets/
    └── README.md
```

---

## 16. Naming Convention

Batch folder:

```text
YYYY-NNN-short-kebab-case-name
```

Example:

```text
2026-001-apple-golden-syrup-wine
```

Rules:

- Year resets the sequence.
- Three-digit batch number.
- Lowercase kebab-case.
- Folder name never changes after the batch starts.
- Display name may change.

---

## 17. Batch IDs

Format:

```text
YYYY-NNN
```

Examples:

- `2026-001`
- `2026-002`
- `2027-001`

The ID must never be reused.

---

## 18. MVP

The MVP is complete when:

- A new batch can be created from a template.
- Each batch has recipe, log, schedule, tasting, and media Markdown files.
- At least one real batch is documented.
- GitHub Pages publishes the repository.
- Active brews are visible.
- All brews can be browsed.
- Individual batches have readable pages.
- Schedule information can be viewed.
- The repository is understandable by an AI agent from the root documentation.

---

## 19. V1

Possible V1 improvements:

- Automatic active-brew index generation.
- Automatic schedule aggregation.
- Batch filtering by type/status/year.
- Simple ABV calculator.
- Gravity history charts.
- Tag pages.
- Photo galleries.
- RSS feed for brew updates.
- Printable recipe view.
- JSON export generated from Markdown front matter.
- GitHub Actions validation for batch metadata.

---

## 20. Future Ideas

Possible later features:

- Calendar export (`.ics`).
- Automatic reminders.
- Brew comparison.
- Ingredient index.
- Yeast performance history.
- Recipe cloning.
- Cost tracking.
- Bottle inventory.
- QR code on bottle labels linking to the batch page.
- Sensor data.
- Public/private batch separation.

---

## 21. Acceptance Criteria

A developer unfamiliar with the project should be able to:

1. Read `README.md` and understand the purpose.
2. Read `PRD.md` and understand the product.
3. Read `AGENTS.md` and safely use an AI coding assistant.
4. Copy `templates/batch/` to create a brew.
5. Record the recipe without touching application code.
6. Add log entries using Markdown.
7. Add scheduled actions.
8. Publish changes through GitHub Pages.
9. Browse the resulting batch on the website.

The repository must remain useful even if the website layer is removed. The Markdown files are always the primary data source.
