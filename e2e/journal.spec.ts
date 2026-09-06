import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const batches = JSON.parse(
  readFileSync(join(process.cwd(), "src/data/batches.json"), "utf8"),
) as { batch_id: string; name: string }[];

const sample = batches.find((batch) => batch.batch_id === "2026-001");
if (!sample) {
  throw new Error("Expected batch 2026-001 in src/data/batches.json");
}

test("home shows an active brew, hero, and icons", async ({ page }) => {
  await page.goto("/brew-log/");
  const active = page.getByTestId("active-brews");
  await expect(active).toBeVisible();
  await expect(active.getByText(/Wine|Cider|Cats|Cyser|Berry/i).first()).toBeVisible();
  await expect(page.locator("img.lto-hero-img")).toBeVisible();
  await expect(page.locator("img[src*='lone-tree-seal']").first()).toBeVisible();
});

test("Batches nav from home shows the brew table", async ({ page }) => {
  await page.goto("/brew-log/");
  await page.getByRole("link", { name: "Batches", exact: true }).click();
  await expect(page).toHaveURL(/\/pages\/batches\/?/);
  await expect(page.getByTestId("batches-page")).toBeVisible();
  await expect(page.getByRole("tab", { name: /all/i })).toBeVisible();
  await expect(page.getByText(sample.name)).toBeVisible();
  await expect(page.locator("img.lto-hero-img")).toBeVisible();
});

test("batches list shows documented brews", async ({ page }) => {
  await page.goto("/brew-log/pages/batches/");
  await expect(page.getByTestId("batches-page")).toBeVisible();
  await expect(page.getByText(sample.name)).toBeVisible();
  await expect(page.getByText("2026-001")).toBeVisible();
});

test("batch permalink loads recipe and title", async ({ page }) => {
  await page.goto("/brew-log/brews/2026-001/");
  await expect(page.getByTestId("batch-title")).toHaveText(sample.name);
  await expect(page.getByRole("tab", { name: "Log" })).toBeVisible();
  await page.getByRole("tab", { name: "Recipe" }).click();
  await expect(page.getByTestId("batch-recipe")).toContainText("Recipe");
});

test("The Three Cats permalink renders", async ({ page }) => {
  await page.goto("/brew-log/brews/2026-003/");
  await expect(page.getByTestId("batch-title")).toHaveText("The Three Cats");
  await expect(page.getByRole("tab", { name: "Log" })).toBeVisible();
});

test("schedule page loads", async ({ page }) => {
  await page.goto("/brew-log/pages/schedule/");
  await expect(page.getByTestId("schedule-page")).toBeVisible();
  await expect(page.getByText("Upcoming Actions", { exact: true })).toBeVisible();
});

test("Wiki nav from home shows the wiki index", async ({ page }) => {
  await page.goto("/brew-log/");
  await page.getByRole("navigation").getByRole("link", { name: "Wiki", exact: true }).click();
  await expect(page).toHaveURL(/\/wiki\/?$/);
  await expect(page.getByTestId("wiki-page")).toBeVisible();
  await expect(page.getByRole("link", { name: "Glossary" }).first()).toBeVisible();
});

test("glossary wiki article permalink loads", async ({ page }) => {
  await page.goto("/brew-log/wiki/glossary/");
  await expect(page.getByTestId("wiki-article")).toBeVisible();
  await expect(page.getByText("Glossary", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Racking")).toBeVisible();
});
