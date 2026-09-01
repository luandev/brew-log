---
layout: page
title: Wines
permalink: /pages/wines/
---

# Wines

{% assign wines = site.data.batches | where: "type", "wine" %}

{% if wines.size > 0 %}
  {% for batch in wines %}
    {% include batch-card.html batch=batch %}
  {% endfor %}
{% else %}
  <p>No wine batches yet.</p>
{% endif %}
