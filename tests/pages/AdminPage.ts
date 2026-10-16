import type { Page, Locator } from "@playwright/test";

export class AdminPage {
  readonly page: Page;
  readonly signInHeading: Locator;
  readonly bookingsHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInHeading = page.getByRole("heading", { name: "Admin Sign In" });
    this.bookingsHeading = page.getByRole("heading", { name: "Bookings" });
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.loginErrorMessage = page.getByText("Invalid email or password.");
  }

  async goto() {
    await this.page.goto("/admin");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
