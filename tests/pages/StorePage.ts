import type { Page, Locator } from "@playwright/test";

export class StorePage {
  readonly page: Page;
  readonly demoBanner: Locator;
  readonly bagLink: Locator;
  readonly productCards: Locator;
  readonly pieceCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.demoBanner = page.getByText(/Portfolio demo store/).filter({ visible: true });
    this.bagLink = page.getByRole("link", { name: /^Bag, \d+ items?$/ });
    this.productCards = page.locator('main a[href^="/product/"]');
    this.pieceCount = page.getByText(/^\d+ pieces?$/);
  }

  async gotoCategory(category: string) {
    await this.page.goto(`/shop/${category}`);
  }

  async filterBy(type: string) {
    await this.page.getByRole("group", { name: "Filter by type" }).getByRole("button", { name: type }).click();
  }

  bagLinkWithCount(count: number): Locator {
    return this.page.getByRole("link", { name: `Bag, ${count} ${count === 1 ? "item" : "items"}` });
  }
}

export class ProductPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addToBagButton: Locator;
  readonly sizeError: Locator;
  readonly addedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { level: 1 });
    this.addToBagButton = page.getByRole("button", { name: "Add to Bag" });
    this.sizeError = page.getByRole("alert").filter({ hasText: "Please choose a size." });
    this.addedMessage = page.getByRole("status").filter({ hasText: "Added to your bag." });
  }

  async goto(slug: string) {
    await this.page.goto(`/product/${slug}`);
  }

  async chooseSize(size: string) {
    await this.page.getByRole("group", { name: "Size" }).getByRole("button", { name: size, exact: true }).click();
  }
}

export class BagPage {
  readonly page: Page;
  readonly items: Locator;
  readonly emptyMessage: Locator;
  readonly total: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator("main li").filter({ has: page.getByRole("button", { name: "Remove" }) });
    this.emptyMessage = page.getByText("Your bag is empty.");
    this.total = page.locator("dt", { hasText: /^Total$/ }).locator("xpath=following-sibling::dd");
    this.checkoutLink = page.getByRole("link", { name: "Checkout" });
  }

  async goto() {
    await this.page.goto("/bag");
  }

  async increase(productName: string) {
    await this.page.getByRole("button", { name: `Increase quantity of ${productName}` }).click();
  }

  async remove(index = 0) {
    await this.items.nth(index).getByRole("button", { name: "Remove" }).click();
  }
}
