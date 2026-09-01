---
layout: page
title: Brew Schedule
permalink: /pages/schedule/
---

# Brew Schedule

Combined next actions for active batches.

{% assign active = site.data.batches | where_exp: "b", "b.is_active" %}
{% assign scheduled = active | where_exp: "b", "b.next_action" | sort: "next_action_date" %}

{% if scheduled.size > 0 %}
<table class="schedule-table">
  <thead>
    <tr>
      <th>Date</th>
      <th>Batch</th>
      <th>Action</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {% for batch in scheduled %}
    <tr>
      <td>{{ batch.next_action_date }}</td>
      <td><a href="{{ batch.url | relative_url }}">{{ batch.name }}</a> ({{ batch.batch_id }})</td>
      <td>{{ batch.next_action }}</td>
      <td><span class="status-badge status-{{ batch.status }}">{{ batch.status }}</span></td>
    </tr>
    {% endfor %}
  </tbody>
</table>
{% else %}
<p>No pending scheduled actions.</p>
{% endif %}
