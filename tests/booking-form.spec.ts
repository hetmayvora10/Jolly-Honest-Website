import { test, expect } from "@playwright/test";
import { BookingFormPage } from "./pages/BookingFormPage";

// These tests stub /api/bookings instead of hitting real Firebase/Stripe, so
// they verify the form's client-side behavior (validation, submission,
// redirect handling) independently of backend credentials. The real
// end-to-end flow (Firestore write, Stripe Checkout, webhook) is verified
// manually against production — see README.

const VALID_DATA = {
  name: "Playwright Test",
  phone: "+919876500000",
  service: "Shirt Tailoring",
  preferredDate: "2026-12-01",
};

test.describe("Booking form", () => {
  test(
    "requires all mandatory fields before submitting",
    { tag: "@regression" },
    async ({ page }) => {
      const booking = new BookingFormPage(page);
      await booking.goto();
      await booking.submit();

      await expect(booking.nameInput).toHaveJSProperty("validity.valueMissing", true);
    }
  );

  test(
    "submits valid data and redirects to the returned Stripe URL",
    { tag: "@smoke" },
    async ({ page }) => {
      const fakeCheckoutUrl = "https://checkout.stripe.com/c/pay/cs_test_fake";
      const booking = new BookingFormPage(page);

      await page.route("**/api/bookings", async (route) => {
        const body = route.request().postDataJSON();
        expect(body.name).toBe(VALID_DATA.name);
        expect(body.service).toBe(VALID_DATA.service);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ url: fakeCheckoutUrl }),
        });
      });
      await booking.mockStripeRedirect(fakeCheckoutUrl);

      await booking.goto();
      await Promise.all([
        page.waitForURL(fakeCheckoutUrl),
        booking.fillAndSubmit(VALID_DATA),
      ]);

      expect(page.url()).toBe(fakeCheckoutUrl);
    }
  );

  test(
    "shows a server-provided error message without redirecting",
    { tag: "@regression" },
    async ({ page }) => {
      const booking = new BookingFormPage(page);
      await booking.mockBookingsApi({
        status: 429,
        body: {
          error: "A booking request from this number was just submitted. Please wait a few minutes.",
        },
      });

      await booking.goto();
      await booking.fillAndSubmit(VALID_DATA);

      await expect(booking.errorMessage).toContainText(/just submitted/i);
    }
  );
});
