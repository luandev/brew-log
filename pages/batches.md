---
layout: page
title: All Batches
permalink: /pages/batches/
---

# All Batches

{% if site.data.batches.size > 0 %}
<table class="batch-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Type</th>
      <th>Status</th>
      <th>Started</th>
    </tr>
  </thead>
  <tbody>
    {% for batch in site.data.batches %}
    <tr>
      <td><a href="{{ batch.url | relative_url }}">{{ batch.batch_id }}</a></td>
      <td><a href="{{ batch.url | relative_url }}">{{ batch.name }}</a></td>
      <td>{{ batch.type }}</td>
      <td><span class="status-badge status-{{ batch.status }}">{{ batch.status }}</span></td>
      <td>{{ batch.started }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
{% else %}
<p>No batches documented yet.</p>
{% endif %}
