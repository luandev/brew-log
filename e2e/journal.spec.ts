import { expect, test } from "@playwright/test";

test("home shows an active brew, hero, and icons", async ({ page }) => {
  await page.goto("/brew-log/");
  const active = page.getByTestId("active-brews");
  await expect(active).toBeVisible();
  await expect(active.getByText(/Wine|Cider|Cats/i).first()).toBeVisible();
  await expect(page.locator("img.lto-hero-img")).toBeVisible();
  await expect(page.locator("img[src*='lone-tree-seal']").first()).toBeVisible();
});

test("Batches nav from home shows the brew table", async ({ page }) => {
  await page.goto("/brew-log/");
  await page.getByRole("link", { name: "Batches", exact: true }).click();
  await expect(page).toHaveURL(/\/pages\/batches\/?/);
  await expect(page.getByTestId("batches-page")).toBeVisible();
  await expect(page.getByRole("tab", { name: /all/i })).toBeVisible();
  await expect(page.getByText("Apple & Golden Syrup Wine")).toBeVisible();
  await expect(page.locator("img.lto-hero-img")).toBeVisible();
});

test("batches list shows documented brews", async ({ page }) => {
  await page.goto("/brew-log/pages/batches/");
  await expect(page.getByTestId("batches-page")).toBeVisible();
  await expect(page.getByText("Apple & Golden Syrup Wine")).toBeVisible();
  await expect(page.getByText("2026-001")).toBeVisible();
});

test("batch permalink loads recipe and title", async ({ page }) => {
  await page.goto("/brew-log/brews/2026-001/");
  await expect(page.getByTestId("batch-title")).toHaveText("Apple & Golden Syrup Wine");
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
