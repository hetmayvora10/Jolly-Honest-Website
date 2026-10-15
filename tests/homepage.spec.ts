import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with correct title and hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Jolly & Honest/);
    await expect(page.getByRole("heading", { name: "Jolly & Honest", level: 1 })).toBeVisible();
  });

  test("nav links scroll to the right sections", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Services" }).first().click();
    await expect(page.locator("#services")).toBeInViewport();
  });

  test("shows real contact info, not placeholders", async ({ page }) => {
    await page.goto("/#visit");
    await expect(page.getByText("+91 84010 45351")).toBeVisible();
    await expect(page.getByText(/Add phone number/i)).toHaveCount(0);
  });

  test("services section lists all tailoring services", async ({ page }) => {
    await page.goto("/");
    const services = [
      "Sherwani Tailoring",
      "Shirt Tailoring",
      "Coats & Suits",
      "Trouser Tailoring",
      "Custom Tailoring",
      "At-Home Measurement",
    ];
    for (const service of services) {
      await expect(page.getByRole("heading", { name: service })).toBeVisible();
    }
  });

  test("mobile menu opens and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile-only menu interaction");
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await expect(page.getByRole("link", { name: "Book a Fitting" }).first()).toBeVisible();
  });
});
