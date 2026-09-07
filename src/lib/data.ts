import rawBatches from "../data/batches.json";
import rawCalendar from "../data/calendar.json";
import rawSchedule from "../data/schedule.json";
import rawStatuses from "../data/statuses.json";
import rawWiki from "../data/wiki.json";
import type { Batch, CalendarData, ScheduleTask, StatusInfo, WikiArticle, WikiData } from "../types";

export const WIKI_CATEGORY_ORDER = [
  "process",
  "ingredients",
  "equipment",
  "measurements",
  "troubleshooting",
  "styles",
  "cellar",
  "glossary",
] as const;

const WIKI_CATEGORY_LABELS: Record<string, string> = {
  process: "Process",
  ingredients: "Ingredients",
  equipment: "Equipment",
  measurements: "Measurements",
  troubleshooting: "Troubleshooting",
  styles: "Styles",
  cellar: "Cellar",
  glossary: "Glossary",
};

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

export const wiki = rawWiki as WikiData;

export function publishedWikiArticles(): WikiArticle[] {
  return wiki.articles.filter((article) => article.status === "published");
}

export function getWikiArticle(slug: string | undefined): WikiArticle | undefined {
  if (!slug) return undefined;
  return publishedWikiArticles().find((article) => article.slug === slug);
}

export function wikiCategoryLabel(category: string): string {
  return WIKI_CATEGORY_LABELS[category] || category;
}

export function wikiArticlesByCategory(): { id: string; label: string; articles: WikiArticle[] }[] {
  const published = publishedWikiArticles();
  const grouped = new Map<string, WikiArticle[]>();
  for (const article of published) {
    const list = grouped.get(article.category) ?? [];
    list.push(article);
    grouped.set(article.category, list);
  }
  const ordered = WIKI_CATEGORY_ORDER.filter((id) => grouped.has(id)).map((id) => ({
    id,
    label: wikiCategoryLabel(id),
    articles: grouped.get(id) ?? [],
  }));
  const extras = [...grouped.keys()]
    .filter((id) => !(WIKI_CATEGORY_ORDER as readonly string[]).includes(id))
    .sort()
    .map((id) => ({
      id,
      label: wikiCategoryLabel(id),
      articles: grouped.get(id) ?? [],
    }));
  return [...ordered, ...extras];
}
