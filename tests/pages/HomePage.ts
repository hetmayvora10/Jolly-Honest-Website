import { expect, type Page, type Locator } from "@playwright/test";

export const SERVICES = [
  "Sherwani Tailoring",
  "Shirt Tailoring",
  "Coats & Suits",
  "Trouser Tailoring",
  "Custom Tailoring",
  "At-Home Measurement",
] as const;

export class HomePage {
  readonly page: Page;
  readonly heroHeading: Locator;
  readonly heroLogo: Locator;
  readonly mobileMenuToggle: Locator;
  readonly servicesSection: Locator;
  readonly phoneNumberText: Locator;
  readonly phonePlaceholderText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroHeading = page.getByRole("heading", { name: "Jolly & Honest", level: 1 });
    this.heroLogo = page.getByRole("img", { name: "Jolly & Honest monogram" });
    this.mobileMenuToggle = page.getByRole("button", { name: "Toggle menu" });
    this.servicesSection = page.locator("#services");
    this.phoneNumberText = page.getByText("+91 84010 45351");
    this.phonePlaceholderText = page.getByText(/Add phone number/i);
  }

  async goto(hash?: string) {
    await this.page.goto(hash ? `/#${hash}` : "/");
  }

  async clickNavLink(name: string) {
    await this.page.getByRole("link", { name }).first().click();
  }

  async openMobileMenu() {
    await this.mobileMenuToggle.click();
  }

  /** Resolves once the element and all its ancestors have faded fully in. */
  async waitForEntranceToFinish(locator: Locator) {
    await expect
      .poll(() =>
        locator.evaluate((el) => {
          let opacity = 1;
          for (let n: Element | null = el; n; n = n.parentElement) {
            opacity *= Number(getComputedStyle(n).opacity);
          }
          return opacity;
        })
      )
      .toBe(1);
  }

  serviceHeading(name: string): Locator {
    return this.page.getByRole("heading", { name });
  }

  bookingFittingLink(): Locator {
    return this.page.getByRole("link", { name: "Book a Fitting" }).first();
  }
}
