export const BASE_URL = "/brew-log";

export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${BASE_URL}/${clean}`;
}

/** Public journal path with the GitHub Pages base and a trailing slash. */
export function routeUrl(path: string): string {
  if (!path || path === "/") return `${BASE_URL}/`;
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  return `${BASE_URL}/${clean}/`;
}

export function asDateString(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function formatDate(value: string | Date | null | undefined): string {
  const raw = asDateString(value);
  if (!raw) return "—";
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function statusLabel(status: string): string {
  return status.replace(/-/g, " ");
}
