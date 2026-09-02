(function () {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function parseYmd(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatYmd(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getWeeks(year, month, todayYmd) {
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const cursor = new Date(firstOfMonth);
    cursor.setDate(cursor.getDate() - cursor.getDay());

    const weeks = [];
    while (weeks.length === 0 || cursor <= lastOfMonth || cursor.getDay() !== 0) {
      const week = [];
      for (let i = 0; i < 7; i += 1) {
        week.push({
          date: new Date(cursor),
          ymd: formatYmd(cursor),
          inMonth: cursor.getMonth() === month,
          isToday: formatYmd(cursor) === todayYmd
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
      if (cursor > lastOfMonth && cursor.getDay() === 0) break;
    }
    return weeks;
  }

  function assignLanes(bars) {
    const sorted = [...bars].sort((a, b) => a.startCol - b.startCol || b.span - a.span);
    const laneEnds = [];

    sorted.forEach((bar) => {
      let lane = 0;
      while (laneEnds[lane] !== undefined && laneEnds[lane] >= bar.startCol) {
        lane += 1;
      }
      bar.lane = lane;
      laneEnds[lane] = bar.startCol + bar.span - 1;
    });

    return sorted;
  }

  function stageEndDate(stage, todayYmd) {
    if (stage.ended) return stage.ended;
    if (stage.status && stage.status.toLowerCase() === "active") return todayYmd;
    return null;
  }

  function initCalendar(root) {
    const dataEl = root.querySelector(".schedule-calendar-data");
    if (!dataEl) return;

    const data = JSON.parse(dataEl.textContent);
    const baseurl = root.dataset.baseurl || "";
    const compact = root.dataset.compact === "true";
    const batches = data.batches || [];
    const stages = data.stages || [];
    const tasks = data.tasks || [];
    const todayYmd = data.today;

    function batchUrl(path) {
      return path ? `${baseurl}${path}` : "";
    }

    const tasksByDate = tasks.reduce((map, task) => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
      return map;
    }, {});

    let viewYear;
    let viewMonth;

    function getWeekBars(week) {
      const weekStart = week[0].date;
      const weekEnd = week[6].date;
      const bars = [];

      stages.forEach((stage) => {
        if (!stage.started) return;

        const endYmd = stageEndDate(stage, todayYmd);
        if (!endYmd) return;

        const start = parseYmd(stage.started);
        const end = parseYmd(endYmd);
        if (end < weekStart || start > weekEnd) return;

        const overlapStart = start > weekStart ? start : weekStart;
        const overlapEnd = end < weekEnd ? end : weekEnd;
        const startCol = overlapStart.getDay();
        const endCol = overlapEnd.getDay();

        bars.push({
          stage,
          startCol,
          span: endCol - startCol + 1,
          ongoing: !stage.ended && stage.status && stage.status.toLowerCase() === "active"
        });
      });

      return assignLanes(bars);
    }

    function renderTasksList() {
      const list = root.closest(".schedule-calendar-page, .batch-schedule-section")
        ?.querySelector(".schedule-upcoming-list");
      if (!list) return;

      const pendingTasks = tasks.filter((task) => !task.status || task.status.toLowerCase() === "pending");

      if (pendingTasks.length === 0) {
        list.innerHTML = '<p class="lto-empty-state">No pending scheduled actions.</p>';
        return;
      }

      list.innerHTML = pendingTasks.map((task) => `
        <li class="schedule-upcoming-item">
          <span class="schedule-upcoming-date">${escapeHtml(task.date)}</span>
          <div>
            <p class="schedule-upcoming-action">${escapeHtml(task.action)}</p>
            ${task.name ? `
              <p class="schedule-upcoming-batch">
                ${task.url ? `<a href="${escapeHtml(batchUrl(task.url))}">${escapeHtml(task.name)}</a>` : escapeHtml(task.name)}
                ${task.batch_id ? `<span class="schedule-upcoming-id">${escapeHtml(task.batch_id)}</span>` : ""}
              </p>
            ` : ""}
          </div>
        </li>
      `).join("");
    }

    function renderLegend() {
      const legend = root.querySelector(".schedule-legend");
      if (!legend) return;

      if (stages.length === 0) {
        legend.hidden = true;
        return;
      }

      legend.hidden = false;

      if (compact) {
        legend.innerHTML = stages.map((stage) => `
          <span class="schedule-legend-item">
            <span class="schedule-legend-swatch status-${escapeHtml(stage.stage)}"></span>
            ${escapeHtml(stage.label)}
            <span class="schedule-legend-dates">${escapeHtml(stage.started)}${stage.ended ? ` → ${escapeHtml(stage.ended)}` : " → ongoing"}</span>
          </span>
        `).join("");
        return;
      }

      legend.innerHTML = batches.map((batch) => {
        const batchStages = stages.filter((stage) => stage.batch_id === batch.batch_id);
        const activeStage = batchStages.find((stage) => stage.status && stage.status.toLowerCase() === "active");
        const stageText = activeStage
          ? activeStage.label
          : (batch.current_stage_label || batch.status || "").replace(/-/g, " ");

        return `
          <span class="schedule-legend-item">
            <span class="schedule-legend-swatch schedule-process-bar--${escapeHtml(batch.type || "experimental")}"></span>
            <span class="schedule-legend-batch">${escapeHtml(batch.name)}</span>
            <span class="schedule-legend-stage">${escapeHtml(stageText)}</span>
          </span>
        `;
      }).join("");
    }

    function taskStatusClass(status) {
      if (!status) return "";
      return `schedule-day-task--${status.toLowerCase()}`;
    }

    function renderMonth() {
      const title = root.querySelector(".schedule-calendar-title");
      const body = root.querySelector(".schedule-calendar-body");
      if (!title || !body) return;

      title.textContent = `${monthNames[viewMonth]} ${viewYear}`;
      const weeks = getWeeks(viewYear, viewMonth, todayYmd);

      body.innerHTML = weeks.map((week) => {
        const bars = getWeekBars(week);
        const laneCount = bars.reduce((max, bar) => Math.max(max, bar.lane + 1), 0);

        const processHtml = laneCount > 0
          ? `<div class="schedule-week-processes" style="--lane-count:${laneCount}">
              ${bars.map((bar) => {
                const stage = bar.stage;
                const barClass = [
                  "schedule-stage-bar",
                  `status-${escapeHtml(stage.stage)}`,
                  bar.ongoing ? "schedule-stage-bar--ongoing" : ""
                ].filter(Boolean).join(" ");
                const shortLabel = compact ? stage.label : `${stage.name}: ${stage.label}`;
                const label = `<span class="schedule-process-label">${escapeHtml(shortLabel)}</span>`;
                const style = `grid-column:${bar.startCol + 1} / span ${bar.span}; grid-row:${bar.lane + 1}`;
                const endYmd = stageEndDate(stage, todayYmd);
                const titleAttr = `${stage.name} — ${stage.label} (${stage.started}${endYmd ? ` → ${endYmd}` : ""})`;

                if (compact || !stage.url) {
                  return `<span class="${barClass}" style="${style}" title="${escapeHtml(titleAttr)}">${label}</span>`;
                }

                return `<a class="${barClass}" href="${escapeHtml(batchUrl(stage.url))}" style="${style}" title="${escapeHtml(titleAttr)}">${label}</a>`;
              }).join("")}
            </div>`
          : "";

        const daysHtml = week.map((day) => {
          const dayTasks = tasksByDate[day.ymd] || [];
          const classes = [
            "schedule-day",
            day.inMonth ? "" : "schedule-day--outside",
            day.isToday ? "schedule-day--today" : "",
            dayTasks.length > 0 ? "schedule-day--has-tasks" : ""
          ].filter(Boolean).join(" ");

          const tasksHtml = dayTasks.map((task) => {
            const statusClass = taskStatusClass(task.status);
            const content = `
              <span class="schedule-day-task-dot" aria-hidden="true"></span>
              <span class="schedule-day-task-text">${escapeHtml(task.action)}</span>
            `;

            if (compact || !task.url) {
              return `<div class="schedule-day-task ${statusClass}" title="${escapeHtml(task.action)}">${content}</div>`;
            }

            return `
              <a class="schedule-day-task ${statusClass}" href="${escapeHtml(batchUrl(task.url))}" title="${escapeHtml(task.action)}">
                ${content}
              </a>
            `;
          }).join("");

          return `
            <div class="${classes}" data-date="${escapeHtml(day.ymd)}">
              <span class="schedule-day-number">${day.date.getDate()}</span>
              ${tasksHtml ? `<div class="schedule-day-tasks">${tasksHtml}</div>` : ""}
            </div>
          `;
        }).join("");

        return `
          <section class="schedule-week">
            ${processHtml}
            <div class="schedule-week-days">${daysHtml}</div>
          </section>
        `;
      }).join("");
    }

    function setView(year, month) {
      viewYear = year;
      viewMonth = month;
      renderMonth();
    }

    function initView() {
      const today = parseYmd(todayYmd);
      setView(today.getFullYear(), today.getMonth());
    }

    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-dir], [data-today]");
      if (!button) return;

      if (button.hasAttribute("data-today")) {
        initView();
        return;
      }

      const direction = Number(button.getAttribute("data-dir"));
      const next = new Date(viewYear, viewMonth + direction, 1);
      setView(next.getFullYear(), next.getMonth());
    });

    renderLegend();
    renderTasksList();
    initView();
  }

  document.querySelectorAll("[data-schedule-calendar]").forEach(initCalendar);
})();
