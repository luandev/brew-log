(function () {
  function initReader(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-log-card]"));
    if (!cards.length) return;

    var index = 0;
    var countEl = root.querySelector("[data-log-count]");
    var prevBtn = root.querySelector("[data-log-prev]");
    var nextBtn = root.querySelector("[data-log-next]");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-log-goto]"));

    function show(i) {
      index = Math.max(0, Math.min(cards.length - 1, i));
      cards.forEach(function (card, n) {
        var active = n === index;
        card.classList.toggle("is-active", active);
        if (active) {
          card.removeAttribute("hidden");
        } else {
          card.setAttribute("hidden", "hidden");
        }
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle("is-active", n === index);
      });
      if (countEl) {
        countEl.textContent = index + 1 + " / " + cards.length;
      }
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === cards.length - 1;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(parseInt(dot.getAttribute("data-log-goto"), 10) || 0);
      });
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      }
    });

    root.setAttribute("tabindex", "0");
    show(cards.length - 1);
  }

  function collectFollowingContent(startEl, stopSelector, options) {
    var stopAtSubheadings = !(options && options.includeSubheadings);
    var nodes = [];
    var node = startEl.nextSibling;
    while (node) {
      if (node.nodeType === 1) {
        if (stopAtSubheadings && /^H[1-3]$/.test(node.tagName)) break;
        if (!stopAtSubheadings && /^H[12]$/.test(node.tagName)) break;
        if (stopSelector && node.matches && node.matches(stopSelector)) break;
      }
      nodes.push(node);
      node = node.nextSibling;
    }
    return nodes;
  }

  function findNotesHeading(contentRoot) {
    var byId = contentRoot.querySelector("h2#notes");
    if (byId && !byId.closest("[data-batch-notes-panel]")) return byId;

    return Array.prototype.find.call(contentRoot.querySelectorAll("h2"), function (heading) {
      return (
        heading.textContent.trim().toLowerCase() === "notes" &&
        !heading.closest("[data-batch-notes-panel]")
      );
    });
  }

  function findHeadingByText(contentRoot, tagName, text) {
    var needle = text.trim().toLowerCase();
    return Array.prototype.find.call(contentRoot.querySelectorAll(tagName), function (heading) {
      return heading.textContent.trim().toLowerCase() === needle;
    });
  }

  function layoutRecipeAdditions(contentRoot) {
    if (!contentRoot || contentRoot.querySelector(".recipe-additions-grid")) return;

    var heading = findHeadingByText(contentRoot, "h2", "Additions");
    if (!heading) return;

    var nodes = collectFollowingContent(
      heading,
      ".recipe-details-grid, [data-batch-notes-panel], .batch-schedule-section",
      { includeSubheadings: true }
    );
    if (!nodes.length) return;

    var groups = [];
    var current = null;

    nodes.forEach(function (node) {
      if (node.nodeType === 1 && node.tagName === "H3") {
        current = { heading: node, body: [] };
        groups.push(current);
        return;
      }
      if (!current) return;
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      current.body.push(node);
    });

    if (!groups.length) return;

    var grid = document.createElement("div");
    grid.className = "recipe-additions-grid";

    groups.forEach(function (group) {
      var panel = document.createElement("div");
      panel.className = "recipe-addition-panel";
      panel.appendChild(group.heading);
      group.body.forEach(function (node) {
        panel.appendChild(node);
      });
      grid.appendChild(panel);
    });

    heading.insertAdjacentElement("afterend", grid);
  }

  function activateTab(panel, tabId) {
    var tabs = panel.querySelectorAll("[data-notes-tab]");
    var bodies = panel.querySelectorAll("[data-notes-panel]");
    tabs.forEach(function (tab) {
      var active = tab.getAttribute("data-notes-tab") === tabId;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      if (!tab.hasAttribute("hidden")) {
        tab.tabIndex = active ? 0 : -1;
      }
    });
    bodies.forEach(function (body) {
      var active = body.getAttribute("data-notes-panel") === tabId;
      body.classList.toggle("is-active", active);
      if (active) {
        body.removeAttribute("hidden");
      } else {
        body.setAttribute("hidden", "hidden");
      }
    });
  }

  function initNotesPanel(panel) {
    var detailsSlot = panel.querySelector("[data-notes-details-slot]");
    var notesSlot = panel.querySelector("[data-notes-text-slot]");
    var detailsTab = panel.querySelector('[data-notes-tab="details"]');
    var notesTab = panel.querySelector('[data-notes-tab="notes"]');
    var contentRoot = panel.closest(".batch-content") || document.querySelector(".batch-content");
    var stopSelector = "[data-batch-notes-panel], .batch-schedule-section, .batch-log-reader";

    if (contentRoot && detailsSlot && detailsTab) {
      var grid = contentRoot.querySelector(".recipe-details-grid");
      if (grid && !detailsSlot.contains(grid) && !grid.closest("[data-batch-notes-panel]")) {
        detailsSlot.appendChild(grid);
        detailsTab.removeAttribute("hidden");
        detailsTab.tabIndex = -1;
      }
    }

    if (contentRoot && notesSlot && notesTab) {
      var heading = findNotesHeading(contentRoot);
      if (heading) {
        var nodes = collectFollowingContent(heading, stopSelector).filter(function (node) {
          return !(node.nodeType === 1 && node.matches && node.matches(stopSelector));
        });
        if (nodes.length) {
          nodes.forEach(function (node) {
            notesSlot.appendChild(node);
          });
          notesTab.removeAttribute("hidden");
          notesTab.tabIndex = -1;
        }
        heading.remove();
      }
    }

    var visibleTabs = Array.prototype.filter.call(
      panel.querySelectorAll("[data-notes-tab]"),
      function (tab) {
        return !tab.hasAttribute("hidden");
      }
    );

    visibleTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(panel, tab.getAttribute("data-notes-tab"));
      });
      tab.addEventListener("keydown", function (event) {
        var idx = visibleTabs.indexOf(tab);
        if (event.key === "ArrowRight") {
          event.preventDefault();
          var next = visibleTabs[(idx + 1) % visibleTabs.length];
          next.focus();
          activateTab(panel, next.getAttribute("data-notes-tab"));
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          var prev = visibleTabs[(idx - 1 + visibleTabs.length) % visibleTabs.length];
          prev.focus();
          activateTab(panel, prev.getAttribute("data-notes-tab"));
        }
      });
    });

    var defaultTab = "log";
    if (!panel.querySelector("[data-log-card]") && detailsTab && !detailsTab.hasAttribute("hidden")) {
      defaultTab = "details";
    }
    activateTab(panel, defaultTab);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".batch-content").forEach(layoutRecipeAdditions);
    document.querySelectorAll("[data-batch-notes-panel]").forEach(initNotesPanel);
    document.querySelectorAll("[data-batch-log-reader]").forEach(initReader);
  });
})();
