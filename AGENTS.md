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

## Mandatory change workflow: review before main

All coding agents and LLMs working in this repository must use a pull-request workflow for repository changes.

- **Never commit or write changes directly to `main`.** This includes small edits, brew-log updates, documentation changes, generated-file updates, and one-off fixes.
- Before making any repository change, inspect the relevant current files and present the user with a concise summary of the proposed changes.
- **Wait for explicit user confirmation before creating commits.** The summary/review step must happen before writing repository changes.
- After confirmation, create a dedicated branch from the current `main` and open a pull request targeting `main`.
- Put the confirmed changes on that branch. If the user requests follow-up changes for the same piece of work, add them as additional commits to the **same open pull request** rather than creating a new PR or writing to `main`.
- Keep the pull request open for user review unless the user explicitly instructs the agent to merge it.
- Merge a pull request only after an explicit user command to merge. If the user says they will merge manually, leave the PR open and do not merge it.
- If an existing open PR already represents the requested work, reuse that PR and its branch for subsequent related changes.
- If a tool or environment cannot create a branch or PR, do not fall back to direct-to-`main` writes. Present the proposed change or patch and explain the limitation instead.

### Required sequence for repository changes

1. Inspect the current repository state and relevant files.
2. Present a concise proposed-change summary to the user.
3. Wait for explicit confirmation.
4. Create or reuse a task branch and pull request targeting `main`.
5. Commit the confirmed changes to the PR branch.
6. Add subsequent related changes as commits to that same PR.
7. Leave the PR open for review until the user explicitly requests a merge, or the user merges it manually.

## Creating a new batch

1. Copy `templates/batch/` to `brews/<year>/<YYYY-NNN-short-kebab-case-name>/`.
2. Set front matter in `README.md`:
   - `batch_id` must match the folder number (e.g. `2026-001`).
   - `permalink` must be `/brews/<batch_id>/` (used for QR code labels).
   - `type` is one of: `cider`, `wine`, `beer`, `vinegar`, `mead`, `experimental`.
3. Fill `recipe.md` with ingredients and planned process.
4. Add log entries to `log.md` in chronological order (append only).
5. Maintain `schedule.md` with upcoming actions (`Pending`, `Done`, `Skipped`).
6. Maintain `stages.md` with start/end dates for each fermentation stage (`active`, `completed`, `planned`, `skipped`).
7. Add tasting notes to `tasting.md` when sampling.
8. Reference photos in `media.md`; store files in `assets/brews/<batch_id>/`.

## Updating an active batch

1. Append a new dated section to `log.md` — do not rewrite past entries.
2. Update `status` in `README.md` front matter when the stage changes.
3. Update `stages.md`: end the previous stage, set dates, and mark the new stage `active`.
4. Mark completed schedule rows as `Done` and add new `Pending` rows as needed.
5. Update `recipe.md` if the actual process diverged from the plan.

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

The build script regenerates `_data/batches.json` from batch folders and prints validation warnings when `README.md`, `stages.md`, and `schedule.md` are out of sync.
