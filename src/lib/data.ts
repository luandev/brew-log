import rawBatches from "../data/batches.json";
import rawCalendar from "../data/calendar.json";
import rawSchedule from "../data/schedule.json";
import rawStatuses from "../data/statuses.json";
import type { Batch, CalendarData, ScheduleTask, StatusInfo } from "../types";

function asTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

export const batches = (rawBatches as Batch[]).map((batch) => ({
  ...batch,
  tags: asTags(batch.tags),
}));
export const schedule = rawSchedule as ScheduleTask[];
export const calendar = rawCalendar as CalendarData;
export const statuses = rawStatuses as StatusInfo[];

export function getBatch(batchId: string | undefined): Batch | undefined {
  if (!batchId) return undefined;
  return batches.find((batch) => batch.batch_id === batchId);
}

export function activeBatches(): Batch[] {
  return batches.filter((batch) => batch.is_active);
}

export function pastBatches(): Batch[] {
  return batches.filter((batch) => batch.status === "finished");
}

export function latestNotes(limit = 6): Batch[] {
  return batches
    .filter((batch) => batch.latest_log_excerpt)
    .slice()
    .sort((a, b) => (b.last_log_date || "").localeCompare(a.last_log_date || ""))
    .slice(0, limit);
}

export function batchesByType(type: string): Batch[] {
  return batches.filter((batch) => batch.type === type);
}

export function statusById(id: string): StatusInfo | undefined {
  return statuses.find((entry) => entry.id === id);
}
