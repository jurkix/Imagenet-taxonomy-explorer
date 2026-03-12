import { test, expect } from "@playwright/test";

test.describe("ImageNet Explorer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows heading and search bar", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "ImageNet Explorer" })).toBeVisible();
    await expect(page.getByLabel("Search categories")).toBeVisible();
  });

  test("tree loads root nodes", async ({ page }) => {
    const tree = page.getByRole("tree");
    await expect(tree).toBeVisible();
    await expect(tree.getByRole("treeitem").first()).toBeVisible();
  });

  test("tree node expands and collapses on click", async ({ page }) => {
    const tree = page.getByRole("tree");
    const firstNode = tree.getByRole("treeitem").first();
    await expect(firstNode).toHaveAttribute("aria-expanded", "false");

    await firstNode.click();
    await expect(firstNode).toHaveAttribute("aria-expanded", "true");
    await expect(tree.getByRole("treeitem").nth(1)).toBeVisible({ timeout: 5000 });

    await firstNode.click();
    await expect(firstNode).toHaveAttribute("aria-expanded", "false");
  });

  test("search shows results and clears", async ({ page }) => {
    const input = page.getByLabel("Search categories");
    await input.fill("plant");

    const results = page.getByRole("button", { name: /plant/i }).first();
    await expect(results).toBeVisible({ timeout: 5000 });

    await page.getByLabel("Clear search").click();
    await expect(input).toHaveValue("");
  });

  test("search shows empty state for gibberish query", async ({ page }) => {
    await page.getByLabel("Search categories").fill("zzzxxxxnotexist");
    await expect(page.getByText("No results found")).toBeVisible({ timeout: 5000 });
  });

  test("clicking search result opens detail modal", async ({ page }) => {
    const input = page.getByLabel("Search categories");
    await input.fill("plant");

    const result = page.getByRole("button", { name: /plant/i }).first();
    await expect(result).toBeVisible({ timeout: 5000 });
    await result.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading")).toBeVisible();
  });

  test("search shows error state when API fails", async ({ page }) => {
    await page.route("**/api/search*", (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ error: "Internal server error" }) }),
    );

    await page.getByLabel("Search categories").fill("plant");

    await expect(page.getByRole("alert")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Search failed")).toBeVisible();
    await expect(page.getByRole("button", { name: /retry/i })).toBeVisible();
  });

  test("modal closes on close button", async ({ page }) => {
    await page.getByLabel("Search categories").fill("animal");

    const result = page.getByRole("button", { name: /animal/i }).first();
    await expect(result).toBeVisible({ timeout: 5000 });
    await result.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.locator(".modal-box").getByRole("button").click();
    await expect(dialog).not.toBeVisible();
  });
});
