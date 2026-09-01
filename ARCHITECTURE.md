# Architecture

The project is a static, Markdown-first GitHub Pages site.

## Source of truth

`brews/` contains the canonical brewing records.

## Rendering

Markdown files are rendered into a GitHub Pages website.

The first implementation should remain compatible with GitHub Pages and should not require a server or database.

## Data

Batch metadata lives in YAML front matter.

Detailed information lives in Markdown.
