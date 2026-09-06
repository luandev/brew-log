import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BREWS_DIR = path.join(ROOT, "brews");
const DATA_DIR = path.join(ROOT, "_data");
const APP_DATA_DIR = path.join(ROOT, "src", "data");
const BATCHES_OUTPUT = path.join(DATA_DIR, "batches.json");
const SCHEDULE_OUTPUT = path.join(DATA_DIR, "schedule.json");
const CALENDAR_OUTPUT = path.join(DATA_DIR, "calendar.json");
const STATUSES_SOURCE = path.join(DATA_DIR, "statuses.json");

const INACTIVE_STATUSES = new Set(["finished", "failed", "archived"]);
const DEFAULT_TARGET_DAYS = 28;
const BREW_ACCENTS = [
  "#6C7C44",
  "#AD9753",
  "#8B5E4B",
  "#5B7C8D",
  "#9A6B3F",
  "#7A6B8A",
  "#6B8F71",
  "#A67C52",
];

function accentFor(batchId) {
  const bytes = Buffer.from(String(batchId), "utf8");
  let digest = 0;
  for (const byte of bytes) {
    digest = (digest * 33 + byte) % 2147483647;
  }
  return BREW_ACCENTS[digest % BREW_ACCENTS.length];
}

function coerce(value) {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "null" || trimmed === "~") return null;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => coerce(item.replace(/^['"]|['"]$/g, "")));
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (/^-?\d+\.\d+$/.test(trimmed)) return Number(trimmed);
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    const parsed = coerce(value.startsWith("[") ? value : `[${value}]`);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  }
  return [];
}

function splitFrontMatter(content) {
  const normalized = content.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, body: normalized.trim() };
  }
  const end = normalized.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: normalized.trim() };
  }
  const yaml = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n/, "").trim();
  return { data: parseYaml(yaml), body };
}

function parseYaml(yaml) {
  const data = {};
  let listKey = null;
  for (const raw of yaml.split("\n")) {
    const line = raw.replace(/\t/g, "  ");
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      data[listKey].push(coerce(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value.trim() === "") {
      listKey = key;
      data[key] = [];
    } else {
      listKey = null;
      data[key] = coerce(value);
    }
  }
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length === 0 && key !== "tags") {
      data[key] = null;
    }
  }
  return data;
}

function parseFrontMatter(content) {
  return splitFrontMatter(content).data;
}

function readFile(filePath) {
  return existsSync(filePath)
    ? readFileSync(filePath, "utf8").replaceAll("\r\n", "\n").replaceAll("\r", "\n")
    : "";
}

function bodyAfterFrontMatter(content) {
  return splitFrontMatter(content || "").body;
}

function stripLiquid(content) {
  return content
    .replace(/\{%\s*include_relative\s+.*?%\}/g, "")
    .replace(/\{%\s*include\s+.*?%\}/g, "")
    .replace(/\{%.*?%\}/g, "")
    .replace(/\{\{.*?\}\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function markdownDocument(filePath) {
  return stripLiquid(bodyAfterFrontMatter(readFile(filePath)));
}

function parseDate(value) {
  if (value == null || String(value).trim() === "") return null;
  const raw = String(value).slice(0, 10);
  const date = new Date(`${raw}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isoDate(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function parseScheduleRows(content) {
  const rows = [];
  for (const line of content.split("\n")) {
    if (!line.trim().startsWith("|")) continue;
    if (line.includes("---") || line.includes("Date")) continue;
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);
    if (cells.length < 3) continue;
    const [date, action, status] = cells;
    if (!date || !action) continue;
    rows.push({ date, action, status });
  }
  return rows;
}

function parseStageRows(content) {
  const rows = [];
  for (const line of content.split("\n")) {
    if (!line.trim().startsWith("|")) continue;
    if (/^\|\s*-+\s*\|/.test(line) || line.includes("Stage")) continue;
    let cells = line.split("|").map((cell) => cell.trim());
    if (cells[0] === "") cells = cells.slice(1, -1);
    if (!cells || cells.length < 4) continue;
    const [stage, started, ended, status] = cells;
    if (!stage) continue;
    rows.push({ stage, started, ended, status });
  }
  return rows;
}

function loadStatusCatalog() {
  if (!existsSync(STATUSES_SOURCE)) return { ids: {}, entries: [] };
  const entries = JSON.parse(readFileSync(STATUSES_SOURCE, "utf8"));
  const ids = Object.fromEntries(entries.map((entry) => [entry.id, entry.label]));
  return { ids, entries };
}

function stageLabel(stageId, lookup) {
  if (lookup[stageId]) return lookup[stageId];
  return stageId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function validateBatch(batchId, metadata, stageRows, scheduleRows, catalog) {
  const statusIds = Object.keys(catalog.ids);
  const statusEntries = Object.fromEntries(catalog.entries.map((entry) => [entry.id, entry]));
  const batchStatus = String(metadata.status || "");
  const isActive = !INACTIVE_STATUSES.has(batchStatus);

  for (const row of stageRows) {
    if (!statusIds.includes(row.stage)) {
      console.warn(`${batchId}: unknown stage ID '${row.stage}' in stages.md`);
    }
  }

  const activeRows = stageRows.filter((row) => row.status?.toLowerCase() === "active");
  if (activeRows.length > 1) {
    console.warn(`${batchId}: stages.md has ${activeRows.length} active rows; expected at most one`);
  }

  if (isActive) {
    if (activeRows.length === 0) {
      console.warn(`${batchId}: active batch has no active stage row in stages.md`);
    } else if (activeRows.length === 1) {
      const active = activeRows[0];
      if (batchStatus !== active.stage) {
        console.warn(
          `${batchId}: README status '${batchStatus}' does not match active stage '${active.stage}'`,
        );
      }
      if (!String(active.started || "").trim()) {
        console.warn(`${batchId}: active stage '${active.stage}' is missing Started date in stages.md`);
      }
      const nextIds = statusEntries[active.stage]?.next || [];
      const planned = stageRows
        .filter((row) => row.status?.toLowerCase() === "planned")
        .map((row) => row.stage);
      if (!planned.some((stage) => nextIds.includes(stage))) {
        console.warn(
          `${batchId}: no planned next stage from Status Guide (expected one of: ${nextIds.join(", ")})`,
        );
      }
      const pendingCount = scheduleRows.filter((row) => row.status?.toLowerCase() === "pending").length;
      if (pendingCount === 0) {
        console.warn(`${batchId}: no Pending schedule rows for active stage '${active.stage}'`);
      }
    }
  }

  for (const row of stageRows) {
    if (row.status?.toLowerCase() !== "completed") continue;
    if (!String(row.started || "").trim() || !String(row.ended || "").trim()) {
      console.warn(`${batchId}: completed stage '${row.stage}' must have both Started and Ended dates`);
    }
  }
}

function lastLogDate(logContent) {
  const dates = [...logContent.matchAll(/^##\s+(\d{4}-\d{2}-\d{2})/gm)].map((match) => match[1]);
  return dates.sort().at(-1) || null;
}

function extractLogSection(body, heading) {
  const pattern = new RegExp(
    `###\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n+([\\s\\S]*?)(?=\\n###\\s+|$)`,
    "i",
  );
  const match = body.match(pattern);
  if (!match) return null;
  const text = match[1].trim();
  return text || null;
}

function latestLogExcerpt(logContent) {
  const sections = logContent.split(/^##\s+\d{4}-\d{2}-\d{2}/m);
  if (sections.length < 2) return null;
  const latest = sections.at(-1);
  const match = latest.match(/### Observation\s*\n+([\s\S]*?)(\n###|$)/);
  if (!match) return null;
  const excerpt = match[1].trim().replace(/\n+/g, " ");
  return excerpt ? excerpt.slice(0, 200) : null;
}

function parseLogEntries(logContent) {
  if (!logContent || !logContent.trim()) return [];
  const entries = [];
  for (const part of logContent.split(/^##\s+/m)) {
    if (!part.trim() || part.startsWith("#")) continue;
    const lines = part.split("\n");
    const heading = (lines.shift() || "").trim();
    if (!heading) continue;
    let date = null;
    let dayLabel = null;
    const full = heading.match(/^(\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.+)$/);
    const only = heading.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (full) {
      date = full[1];
      dayLabel = full[2].trim();
    } else if (only) {
      date = only[1];
    } else {
      continue;
    }
    const body = lines.join("\n");
    let stage = null;
    const stageMatch = body.match(/\*\*Stage:\*\*\s*(.+?)(?:\n|$)/);
    if (stageMatch && stageMatch[1].trim()) stage = stageMatch[1].trim();
    const observation = extractLogSection(body, "Observation");
    entries.push({
      date,
      day_label: dayLabel,
      heading,
      stage,
      measurements: extractLogSection(body, "Measurements"),
      actions: extractLogSection(body, "Actions"),
      observation,
      next: extractLogSection(body, "Next"),
      excerpt: observation ? observation.replace(/\n+/g, " ").slice(0, 220) : null,
    });
  }
  return entries;
}

function inferTargetDays(startedDate, pendingRows, explicitTarget) {
  if (explicitTarget && Number(explicitTarget) > 0) return Number(explicitTarget);
  if (startedDate && pendingRows.length) {
    const latest = pendingRows.map((row) => parseDate(row.date)).filter(Boolean).sort((a, b) => b - a)[0];
    if (latest) {
      const days = daysBetween(startedDate, latest) + 7;
      if (days > 0) return days;
    }
  }
  return DEFAULT_TARGET_DAYS;
}

function findBatchReadmes() {
  if (!existsSync(BREWS_DIR)) return [];
  const results = [];
  for (const year of readdirSync(BREWS_DIR, { withFileTypes: true })) {
    if (!year.isDirectory()) continue;
    const yearPath = path.join(BREWS_DIR, year.name);
    for (const batch of readdirSync(yearPath, { withFileTypes: true })) {
      if (!batch.isDirectory()) continue;
      const readme = path.join(yearPath, batch.name, "README.md");
      if (existsSync(readme)) results.push(readme);
    }
  }
  return results.sort();
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const catalog = loadStatusCatalog();
const batches = [];
const scheduleEntries = [];
const calendarStages = [];

for (const readmePath of findBatchReadmes()) {
  const folder = path.dirname(readmePath);
  const folderName = path.basename(folder);
  const year = path.basename(path.dirname(folder));
  const metadata = parseFrontMatter(readFile(readmePath));
  const batchId = metadata.batch_id;
  const status = String(metadata.status || "");
  if (!batchId) continue;

  const scheduleRows = parseScheduleRows(readFile(path.join(folder, "schedule.md")));
  const stageRows = parseStageRows(readFile(path.join(folder, "stages.md")));
  const logContent = readFile(path.join(folder, "log.md"));
  validateBatch(batchId, metadata, stageRows, scheduleRows, catalog);
  const pendingRows = scheduleRows.filter((row) => row.status?.toLowerCase() === "pending");
  const pending = pendingRows[0];
  const startedDate = parseDate(metadata.started);
  const daysElapsed = startedDate ? daysBetween(startedDate, today) : 0;
  const targetDays = inferTargetDays(startedDate, pendingRows, metadata.target_days);
  const progressPercent = targetDays > 0 ? Math.min(100, Math.round((daysElapsed / targetDays) * 100)) : 0;

  const entry = {
    ...metadata,
    tags: normalizeTags(metadata.tags),
    folder: path.relative(ROOT, folder).replaceAll("\\", "/"),
    year,
    slug: folderName,
    url: `/brews/${batchId}/`,
    is_active: !INACTIVE_STATUSES.has(status),
    last_log_date: lastLogDate(logContent),
    latest_log_excerpt: latestLogExcerpt(logContent),
    log_entries: parseLogEntries(logContent),
    recipe_markdown: markdownDocument(path.join(folder, "recipe.md")),
    tasting_markdown: markdownDocument(path.join(folder, "tasting.md")),
    media_markdown: markdownDocument(path.join(folder, "media.md")),
    summary_markdown: stripLiquid(bodyAfterFrontMatter(readFile(readmePath))),
    pending_schedule: pendingRows,
    schedule: scheduleRows,
    stages: stageRows.map((row) => ({ ...row, label: stageLabel(row.stage, catalog.ids) })),
    days_elapsed: daysElapsed,
    target_days: targetDays,
    progress_percent: progressPercent,
    thumbnail: metadata.thumbnail ? String(metadata.thumbnail) : "",
    accent: accentFor(batchId),
  };

  const activeStage = stageRows.find((row) => row.status?.toLowerCase() === "active");
  if (activeStage) {
    entry.current_stage = activeStage.stage;
    entry.current_stage_label = stageLabel(activeStage.stage, catalog.ids);
  }
  if (pending) {
    entry.next_action_date = pending.date;
    entry.next_action = pending.action;
  }
  if (startedDate && targetDays > 0) {
    const end = new Date(startedDate);
    end.setDate(end.getDate() + targetDays);
    entry.end_date = isoDate(end);
  }

  if (entry.is_active) {
    for (const row of pendingRows) {
      scheduleEntries.push({
        date: row.date,
        action: row.action,
        batch_id: batchId,
        name: entry.name,
        url: entry.url,
        accent: entry.accent,
      });
    }
    for (const row of stageRows) {
      const startDate = parseDate(row.started);
      if (!startDate) continue;
      calendarStages.push({
        batch_id: batchId,
        name: entry.name,
        url: entry.url,
        type: entry.type,
        stage: row.stage,
        label: stageLabel(row.stage, catalog.ids),
        started: isoDate(startDate),
        ended: parseDate(row.ended) ? isoDate(parseDate(row.ended)) : null,
        status: row.status,
        accent: entry.accent,
      });
    }
  }

  batches.push(entry);
}

batches.sort((a, b) => `${b.started || ""}${b.batch_id}`.localeCompare(`${a.started || ""}${a.batch_id}`));
scheduleEntries.sort((a, b) => `${a.date}${a.batch_id}`.localeCompare(`${b.date}${b.batch_id}`));
calendarStages.sort((a, b) => `${a.started}${a.batch_id}${a.stage}`.localeCompare(`${b.started}${b.batch_id}${b.stage}`));

const calendarData = {
  today: isoDate(today),
  batches: batches
    .filter((batch) => batch.is_active)
    .map((batch) => ({
      batch_id: batch.batch_id,
      name: batch.name,
      url: batch.url,
      type: batch.type,
      status: batch.status,
      current_stage: batch.current_stage,
      current_stage_label: batch.current_stage_label,
      started: batch.started,
      end_date: batch.end_date,
      target_days: batch.target_days,
      accent: batch.accent,
    })),
  stages: calendarStages,
  tasks: scheduleEntries,
};

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(APP_DATA_DIR, { recursive: true });
writeFileSync(BATCHES_OUTPUT, `${JSON.stringify(batches, null, 2)}\n`);
writeFileSync(SCHEDULE_OUTPUT, `${JSON.stringify(scheduleEntries, null, 2)}\n`);
writeFileSync(CALENDAR_OUTPUT, `${JSON.stringify(calendarData, null, 2)}\n`);
cpSync(BATCHES_OUTPUT, path.join(APP_DATA_DIR, "batches.json"));
cpSync(SCHEDULE_OUTPUT, path.join(APP_DATA_DIR, "schedule.json"));
cpSync(CALENDAR_OUTPUT, path.join(APP_DATA_DIR, "calendar.json"));
if (existsSync(STATUSES_SOURCE)) {
  cpSync(STATUSES_SOURCE, path.join(APP_DATA_DIR, "statuses.json"));
}
const iconLookup = path.join(DATA_DIR, "icon_lookup.json");
if (existsSync(iconLookup)) {
  cpSync(iconLookup, path.join(APP_DATA_DIR, "icon_lookup.json"));
}

const publicAssets = path.join(ROOT, "public", "assets");
mkdirSync(publicAssets, { recursive: true });
for (const folder of ["brand", "brews", "icons"]) {
  const src = path.join(ROOT, "assets", folder);
  if (!existsSync(src)) continue;
  const dest = path.join(publicAssets, folder);
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
}

console.log(`Generated ${BATCHES_OUTPUT} with ${batches.length} batch(es).`);
console.log(`Generated ${SCHEDULE_OUTPUT} with ${scheduleEntries.length} pending task(s).`);
console.log(`Generated ${CALENDAR_OUTPUT} with ${calendarStages.length} stage span(s).`);
console.log(`Copied JSON into ${APP_DATA_DIR}.`);
