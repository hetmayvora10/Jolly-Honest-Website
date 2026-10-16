import { test, expect } from "@playwright/test";
import { HomePage, SERVICES } from "./pages/HomePage";

test.describe("Homepage", () => {
  test(
    "loads with correct title and hero content",
    { tag: "@smoke" },
    async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      await expect(page).toHaveTitle(/Jolly & Honest/);
      await expect(home.heroHeading).toBeVisible();
    }
  );

  test("nav links scroll to the right sections", { tag: "@regression" }, async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickNavLink("Services");
    await expect(home.servicesSection).toBeInViewport();
  });

  test(
    "shows real contact info, not placeholders",
    { tag: "@regression" },
    async ({ page }) => {
      const home = new HomePage(page);
      await home.goto("visit");
      await expect(home.phoneNumberText).toBeVisible();
      await expect(home.phonePlaceholderText).toHaveCount(0);
    }
  );

  test(
    "services section lists all tailoring services",
    { tag: "@regression" },
    async ({ page }) => {
      const home = new HomePage(page);
      await home.goto();
      for (const service of SERVICES) {
        await expect(home.serviceHeading(service)).toBeVisible();
      }
    }
  );

  test(
    "mobile menu opens and closes",
    { tag: "@regression" },
    async ({ page, isMobile }) => {
      test.skip(!isMobile, "mobile-only menu interaction");
      const home = new HomePage(page);
      await home.goto();
      await home.openMobileMenu();
      await expect(home.bookingFittingLink()).toBeVisible();
    }
  );
});
