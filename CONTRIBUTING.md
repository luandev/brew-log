# Contributing

Use feature branches and pull requests.

## Brew data edits

1. Do not rewrite historical observations without explanation.
2. Keep measurements exactly as recorded.
3. Put new events in chronological order.
4. Update the batch status when appropriate.
5. Keep documentation changes in the same PR when structure changes.

## Creating a new batch

1. Copy `templates/batch/` to `brews/<year>/<YYYY-NNN-short-kebab-case-name>/`.
2. Set `batch_id`, `permalink`, and other front matter in `README.md`.
3. Fill recipe, log, schedule, tasting, and media files.
4. Run the build script and preview locally before pushing.

See [brews/README.md](brews/README.md) and [DATA_MODEL.md](DATA_MODEL.md) for details.

## Local preview

Requires **Ruby 3.3** (see `.ruby-version`). Install via [RubyInstaller](https://rubyinstaller.org/) on Windows, or `rbenv`/`mise` on macOS/Linux.

```bash
bundle install
ruby scripts/generate_site_data.rb
bundle exec jekyll serve
```

Then open `http://localhost:4000/brew-log/`.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow that builds with Jekyll 4 and deploys to GitHub Pages. Ensure GitHub Pages is configured to use **GitHub Actions** as the source (Settings → Pages → Build and deployment → Source: GitHub Actions).

The `github-pages` gem is intentionally not used — the workflow builds from the `Gemfile` directly, which allows Jekyll 4 and current dependencies.

## QR code labels

Each batch has a stable public URL:

```
https://luandev.github.io/brew-log/brews/<batch_id>/
```

Generate QR codes externally pointing to this URL for bottle labels.
