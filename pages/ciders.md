---
layout: page
title: Ciders
permalink: /pages/ciders/
---

# Ciders

{% assign ciders = site.data.batches | where: "type", "cider" %}

{% if ciders.size > 0 %}
  {% for batch in ciders %}
    {% include batch-card.html batch=batch %}
  {% endfor %}
{% else %}
  <p>No cider batches yet.</p>
{% endif %}
