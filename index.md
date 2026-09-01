---
layout: home
title: Brew Log
---

<div class="dashboard-grid">
  <div class="dashboard-main">
    {% include active-brews-section.html %}
    {% include past-batches-table.html %}
  </div>
  <aside class="dashboard-sidebar">
    {% include mini-calendar.html %}
    {% include schedule-tasks.html %}
    {% include latest-notes.html %}
  </aside>
</div>
