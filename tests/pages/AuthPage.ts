import type { Page, Locator } from "@playwright/test";

export class AuthPage {
  readonly page: Page;
  readonly signInHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;
  readonly errorMessage: Locator;
  readonly statusMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInHeading = page.getByRole("heading", { name: "Sign In", level: 1 });
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmInput = page.locator('input[name="confirm"]');
    this.errorMessage = page.getByRole("main").getByRole("alert");
    this.statusMessage = page.getByRole("main").getByRole("status");
  }

  async gotoSignIn(next?: string) {
    await this.page.goto(next ? `/signin?next=${encodeURIComponent(next)}` : "/signin");
  }

  async gotoSignUp() {
    await this.page.goto("/signup");
  }

  async gotoForgotPassword() {
    await this.page.goto("/forgot-password");
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Sign In", exact: true }).click();
  }

  async signUp(data: { name: string; email: string; password: string; confirm: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmInput.fill(data.confirm);
    await this.page.getByRole("button", { name: "Create Account" }).click();
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.page.getByRole("button", { name: "Send Reset Link" }).click();
  }
}
