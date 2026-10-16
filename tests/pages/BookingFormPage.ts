import type { Page, Locator, Route } from "@playwright/test";

export type BookingFormData = {
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  email?: string;
  notes?: string;
};

export class BookingFormPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly serviceSelect: Locator;
  readonly preferredDateInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.serviceSelect = page.locator('select[name="service"]');
    this.preferredDateInput = page.locator('input[name="preferredDate"]');
    this.submitButton = page.getByRole("button", { name: /Pay .*Deposit & Book/ });
    this.errorMessage = page.locator('[class*="text-red"]');
  }

  async goto() {
    await this.page.goto("/#book");
  }

  async fill(data: BookingFormData) {
    await this.nameInput.fill(data.name);
    await this.phoneInput.fill(data.phone);
    await this.serviceSelect.selectOption(data.service);
    await this.preferredDateInput.fill(data.preferredDate);
    if (data.email) await this.page.locator('input[name="email"]').fill(data.email);
    if (data.notes) await this.page.locator('textarea[name="notes"]').fill(data.notes);
  }

  async submit() {
    await this.submitButton.click();
  }

  async fillAndSubmit(data: BookingFormData) {
    await this.fill(data);
    await this.submit();
  }

  /** Stubs POST /api/bookings so tests don't depend on real Firebase/Stripe. */
  async mockBookingsApi(response: { status: number; body: Record<string, unknown> }) {
    await this.page.route("**/api/bookings", async (route: Route) => {
      await route.fulfill({
        status: response.status,
        contentType: "application/json",
        body: JSON.stringify(response.body),
      });
    });
  }

  /** Stubs the Stripe redirect target so real checkout.stripe.com is never reached. */
  async mockStripeRedirect(url: string) {
    await this.page.route(url, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>stubbed checkout page</body></html>",
      });
    });
  }
}
