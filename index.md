---
layout: default
title: Brew Log
---

# Brew Log

A journal of cider, wine, and experimental fermentation batches.

<p class="home-intro">Track recipes, fermentation logs, schedules, and tasting notes — one batch at a time.</p>

{% assign active = site.data.batches | where_exp: "b", "b.is_active" %}

<div class="dashboard-section">
  <h2>Active Batches</h2>
  {% if active.size > 0 %}
    {% for batch in active %}
      {% include batch-card.html batch=batch %}
    {% endfor %}
  {% else %}
    <p>No active batches.</p>
  {% endif %}
</div>

<div class="dashboard-section">
  <h2>Next Scheduled Actions</h2>
  {% assign scheduled = active | where_exp: "b", "b.next_action" | sort: "next_action_date" %}
  {% if scheduled.size > 0 %}
    <table class="schedule-table">
      <thead>
        <tr><th>Date</th><th>Batch</th><th>Action</th></tr>
      </thead>
      <tbody>
        {% for batch in scheduled %}
        <tr>
          <td>{{ batch.next_action_date }}</td>
          <td><a href="{{ batch.url | relative_url }}">{{ batch.name }}</a></td>
          <td>{{ batch.next_action }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  {% else %}
    <p>No scheduled actions.</p>
  {% endif %}
</div>

<div class="dashboard-section">
  <h2>Latest Log Updates</h2>
  {% assign recent = site.data.batches | where_exp: "b", "b.last_log_date" | sort: "last_log_date" | reverse %}
  {% if recent.size > 0 %}
    <ul>
      {% for batch in recent limit:5 %}
      <li><strong>{{ batch.last_log_date }}</strong> — <a href="{{ batch.url | relative_url }}">{{ batch.name }}</a></li>
      {% endfor %}
    </ul>
  {% else %}
    <p>No log entries yet.</p>
  {% endif %}
</div>

<div class="dashboard-section">
  <h2>Recently Completed</h2>
  {% assign finished = site.data.batches | where: "status", "finished" %}
  {% if finished.size > 0 %}
    <ul>
      {% for batch in finished limit:5 %}
      <li><a href="{{ batch.url | relative_url }}">{{ batch.name }}</a> ({{ batch.batch_id }})</li>
      {% endfor %}
    </ul>
  {% else %}
    <p>No completed batches yet.</p>
  {% endif %}
</div>
