---
layout: page
title: Active Brews
permalink: /pages/active/
---

# Active Brews

{% assign active = site.data.batches | where_exp: "b", "b.is_active" %}

{% if active.size > 0 %}
  {% for batch in active %}
    {% include batch-card.html batch=batch %}
  {% endfor %}
{% else %}
  <p>No active batches.</p>
{% endif %}
