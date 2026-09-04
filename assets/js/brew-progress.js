(function () {
  var CIRCUMFERENCE = 113.1;

  function parseLocalDate(value) {
    if (!value) return null;
    var parts = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!parts) return null;
    return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }

  function startOfLocalDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function daysBetween(started, today) {
    var ms = startOfLocalDay(today).getTime() - startOfLocalDay(started).getTime();
    return Math.max(0, Math.round(ms / 86400000));
  }

  function computeProgress(daysElapsed, targetDays) {
    if (!targetDays || targetDays <= 0) return 0;
    return Math.min(100, Math.round((daysElapsed / targetDays) * 100));
  }

  function updateRing(root, percent) {
    var fill = root.querySelector(".progress-ring-fill");
    var text = root.querySelector(".progress-ring-text");
    var svg = root.querySelector(".progress-ring");
    var dash = Math.round(percent * 1.131 * 10) / 10;

    if (fill) {
      fill.setAttribute("stroke-dasharray", dash + " " + CIRCUMFERENCE);
    }
    if (text) {
      text.textContent = percent + "%";
    }
    if (svg) {
      svg.setAttribute("aria-label", percent + " percent complete");
    }
  }

  function updateProgress(el) {
    var started = parseLocalDate(el.getAttribute("data-started"));
    var targetDays = parseInt(el.getAttribute("data-target-days"), 10);
    if (!started || !targetDays || targetDays <= 0) return;

    var daysElapsed = daysBetween(started, new Date());
    var percent = computeProgress(daysElapsed, targetDays);
    var daysLabel = el.querySelector("[data-progress-days]");

    updateRing(el, percent);
    if (daysLabel) {
      daysLabel.textContent = "Day " + daysElapsed + " / " + targetDays;
    }

    el.setAttribute("data-days-elapsed", String(daysElapsed));
    el.setAttribute("data-progress-percent", String(percent));
  }

  function init() {
    document.querySelectorAll("[data-brew-progress]").forEach(updateProgress);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
