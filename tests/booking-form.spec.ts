import { test, expect } from "@playwright/test";

// These tests stub /api/bookings instead of hitting real Firebase/Stripe, so
// they verify the form's client-side behavior (validation, submission,
// redirect handling) independently of backend credentials. The real
// end-to-end flow (Firestore write, Stripe Checkout, webhook) is verified
// manually against production — see README.

test.describe("Booking form", () => {
  test("requires all mandatory fields before submitting", async ({ page }) => {
    await page.goto("/#book");
    await page.getByRole("button", { name: /Pay .*Deposit & Book/ }).click();

    // Native HTML5 validation blocks submission; the name field is first and required.
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveJSProperty("validity.valueMissing", true);
  });

  test("submits valid data and redirects to the returned Stripe URL", async ({ page }) => {
    const fakeCheckoutUrl = "https://checkout.stripe.com/c/pay/cs_test_fake";

    await page.route("**/api/bookings", async (route) => {
      const body = route.request().postDataJSON();
      expect(body.name).toBe("Playwright Test");
      expect(body.service).toBe("Shirt Tailoring");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: fakeCheckoutUrl }),
      });
    });

    // Stub the Stripe redirect target itself so the real checkout.stripe.com
    // is never actually reached — we're testing our own redirect logic,
    // not Stripe's page.
    await page.route(fakeCheckoutUrl, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>stubbed checkout page</body></html>",
      });
    });

    await page.goto("/#book");
    await page.locator('input[name="name"]').fill("Playwright Test");
    await page.locator('input[name="phone"]').fill("+919876500000");
    await page.locator('select[name="service"]').selectOption("Shirt Tailoring");
    await page.locator('input[name="preferredDate"]').fill("2026-12-01");

    await Promise.all([
      page.waitForURL(fakeCheckoutUrl),
      page.getByRole("button", { name: /Pay .*Deposit & Book/ }).click(),
    ]);

    expect(page.url()).toBe(fakeCheckoutUrl);
  });

  test("shows a server-provided error message without redirecting", async ({ page }) => {
    await page.route("**/api/bookings", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          error: "A booking request from this number was just submitted. Please wait a few minutes.",
        }),
      });
    });

    await page.goto("/#book");
    await page.locator('input[name="name"]').fill("Playwright Test");
    await page.locator('input[name="phone"]').fill("+919876500000");
    await page.locator('select[name="service"]').selectOption("Shirt Tailoring");
    await page.locator('input[name="preferredDate"]').fill("2026-12-01");
    await page.getByRole("button", { name: /Pay .*Deposit & Book/ }).click();

    await expect(page.getByText(/just submitted/i)).toBeVisible();
  });
});
