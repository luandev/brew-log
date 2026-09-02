---
batch_id: YYYY-NNN
name: Batch Name
title: Batch Name
type: cider
# status must match the `active` row in stages.md (see Status Guide for valid IDs)
status: planned
# started should match the active stage Started date in stages.md
started: YYYY-MM-DD
volume_l:
target_abv:
actual_abv:
tags: []
permalink: /brews/YYYY-NNN/
---

# Batch Name

## Summary

Short description of the batch.

## Current Status

{% include batch-current-status.html %}

## Key Measurements

| Measurement | Value |
|---|---|
| Starting gravity | |
| Final gravity | |
| Potential ABV | |
| Actual ABV | |
| Volume | |

{% include_relative recipe.md %}

{% include batch-log-reader.html %}

{% include batch-schedule-calendar.html %}

{% include_relative tasting.md %}

{% include_relative media.md %}
