(function () {
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function parseLocalDate(value) {
    if (!value) return null;
    var parts = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!parts) return null;
    return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }

  function isoDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function inRange(dayDate, started, ended) {
    if (!started) return false;
    if (dayDate < started) return false;
    if (!ended) return true;
    return dayDate <= ended;
  }

  function uniqueById(items) {
    var seen = {};
    var out = [];
    items.forEach(function (item) {
      if (!item || !item.batch_id || seen[item.batch_id]) return;
      seen[item.batch_id] = true;
      out.push(item);
    });
    return out;
  }

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function withBase(base, url) {
    if (!url) return "#";
    if (/^https?:\/\//.test(url)) return url;
    if (!base) return url;
    if (url.charAt(0) === "/") return base + url;
    return base + "/" + url;
  }

  function markersForDay(dayDate, batches, tasksByDate) {
    var key = isoDate(dayDate);
    var taskIds = {};
    (tasksByDate[key] || []).forEach(function (task) {
      if (task.batch_id) taskIds[task.batch_id] = true;
    });

    var concurrent = [];
    batches.forEach(function (batch) {
      var started = parseLocalDate(batch.started);
      var ended = parseLocalDate(batch.end_date);
      if (inRange(dayDate, started, ended)) concurrent.push(batch);
    });

    return {
      markers: uniqueById(concurrent),
      hasTask: Object.keys(taskIds).length > 0
    };
  }

  function renderDay(day, date, info) {
    var markers = info.markers.slice(0, 4);
    var classes = ["mini-calendar-day"];
    if (markers.length) classes.push("has-batches");
    if (info.hasTask) classes.push("has-task");

    var title = markers
      .map(function (b) {
        return b.name || b.batch_id;
      })
      .join(", ");

    var dots = markers
      .map(function (b) {
        return (
          '<span class="mini-calendar-dot" style="--brew-accent:' +
          escapeAttr(b.accent || "#6C7C44") +
          '"></span>'
        );
      })
      .join("");

    return (
      '<span class="' +
      classes.join(" ") +
      '"' +
      (title ? ' title="' + escapeAttr(title) + '"' : "") +
      ' data-date="' +
      isoDate(date) +
      '">' +
      '<span class="mini-calendar-day-num">' +
      day +
      "</span>" +
      (dots ? '<span class="mini-calendar-dots">' + dots + "</span>" : "") +
      "</span>"
    );
  }

  function renderLegend(batches, base) {
    return batches
      .map(function (batch) {
        return (
          '<li class="mini-calendar-legend-item">' +
          '<span class="mini-calendar-dot" style="--brew-accent:' +
          escapeAttr(batch.accent || "#6C7C44") +
          '"></span>' +
          '<a href="' +
          escapeAttr(withBase(base, batch.url)) +
          '">' +
          escapeAttr(batch.name || batch.batch_id) +
          "</a>" +
          "</li>"
        );
      })
      .join("");
  }

  function initCalendar(root) {
    var dataEl = root.querySelector(".mini-calendar-data");
    var titleEl = root.querySelector("[data-mini-cal-title]");
    var gridEl = root.querySelector("[data-mini-cal-grid]");
    var legendEl = root.querySelector("[data-mini-cal-legend]");
    if (!dataEl || !gridEl) return;

    var payload = {};
    try {
      payload = JSON.parse(dataEl.textContent || "{}");
    } catch (err) {
      return;
    }

    var base = root.getAttribute("data-baseurl") || "";
    var batches = payload.batches || [];
    var tasksByDate = {};
    (payload.tasks || []).forEach(function (task) {
      if (!task.date) return;
      if (!tasksByDate[task.date]) tasksByDate[task.date] = [];
      tasksByDate[task.date].push(task);
    });

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    if (titleEl) titleEl.textContent = MONTHS[month] + " " + year;

    var html = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
      .map(function (label) {
        return '<span class="mini-calendar-dow">' + label + "</span>";
      })
      .join("");

    var firstDow = new Date(year, month, 1).getDay();
    for (var i = 0; i < firstDow; i += 1) {
      html += '<span class="mini-calendar-day empty">·</span>';
    }

    var total = daysInMonth(year, month);
    for (var day = 1; day <= total; day += 1) {
      var date = new Date(year, month, day);
      html += renderDay(day, date, markersForDay(date, batches, tasksByDate));
    }

    gridEl.innerHTML = html;

    if (legendEl) {
      if (batches.length) {
        legendEl.innerHTML = renderLegend(batches, base);
        legendEl.hidden = false;
      } else {
        legendEl.hidden = true;
      }
    }
  }

  function init() {
    document.querySelectorAll("[data-mini-calendar]").forEach(initCalendar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
