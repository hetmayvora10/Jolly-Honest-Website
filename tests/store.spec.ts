import { test, expect } from "@playwright/test";
import { StorePage, ProductPage, BagPage } from "./pages/StorePage";

const CATEGORIES = [
  { id: "men", heading: "Menswear" },
  { id: "women", heading: "Womenswear" },
  { id: "kids", heading: "Kidswear" },
  { id: "traditional", heading: "Indian Traditional" },
];

test.describe("Store", () => {
  for (const { id, heading } of CATEGORIES) {
    test(`${heading} page lists products`, { tag: "@smoke" }, async ({ page }) => {
      const store = new StorePage(page);
      await store.gotoCategory(id);
      await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
      expect(await store.productCards.count()).toBeGreaterThan(3);
    });
  }

  test("every store page carries the demo disclosure", { tag: "@regression" }, async ({ page }) => {
    const store = new StorePage(page);
    for (const path of ["/shop", "/shop/men", "/product/ivory-silk-sherwani", "/bag", "/signin"]) {
      await page.goto(path);
      await expect(store.demoBanner, path).toBeVisible();
    }
  });

  test("filtering narrows the grid to one type", { tag: "@regression" }, async ({ page }) => {
    const store = new StorePage(page);
    await store.gotoCategory("men");
    const all = await store.productCards.count();
    await store.filterBy("Suits");
    await expect(store.pieceCount).toHaveText("1 piece");
    expect(await store.productCards.count()).toBeLessThan(all);
  });

  test("unknown products return 404", { tag: "@regression" }, async ({ page }) => {
    const res = await page.goto("/product/not-a-real-thing");
    expect(res?.status()).toBe(404);
  });

  test("add to bag, change quantity and remove", { tag: "@smoke" }, async ({ page }) => {
    const store = new StorePage(page);
    const product = new ProductPage(page);
    const bag = new BagPage(page);

    await product.goto("navy-pinstripe-suit");
    await product.addToBagButton.click();
    await expect(product.sizeError).toBeVisible();

    await product.chooseSize("40");
    await product.addToBagButton.click();
    await expect(product.addedMessage).toBeVisible();
    await expect(store.bagLinkWithCount(1)).toBeVisible();

    await bag.goto();
    await expect(bag.items).toHaveCount(1);
    await expect(bag.total).toHaveText("₹24,900");
    await bag.increase("Navy Pinstripe Two-Piece Suit");
    await expect(bag.total).toHaveText("₹49,800");

    // The bag survives a reload (it lives in localStorage).
    await page.reload();
    await expect(bag.total).toHaveText("₹49,800");

    await bag.remove();
    await expect(bag.emptyMessage).toBeVisible();
  });

  test("checkout offers guest, sign-in and sign-up", { tag: "@smoke" }, async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByRole("button", { name: "Continue as Guest" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Sign In", exact: true })).toHaveAttribute("href", "/signin?next=%2Fcheckout");
    await expect(page.getByRole("main").getByRole("link", { name: "Create Account" })).toHaveAttribute("href", "/signup?next=%2Fcheckout");
  });

  test("guest checkout sends references, not prices, then redirects to Stripe", { tag: "@regression" }, async ({ page }) => {
    const fakeStripeUrl = "https://checkout.stripe.com/c/pay/cs_test_guest";
    let sent: Record<string, unknown> | null = null;
    await page.route("**/api/checkout", async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: fakeStripeUrl }) });
    });
    await page.route(fakeStripeUrl, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "stripe" }));

    const product = new ProductPage(page);
    await product.goto("white-oxford-shirt");
    await product.chooseSize("M");
    await product.addToBagButton.click();

    await page.goto("/checkout");
    await page.getByRole("button", { name: "Continue as Guest" }).click();
    await page.locator('input[name="guestEmail"]').fill("guest@example.com");
    await page.locator('input[name="fullName"]').fill("Guest Shopper");
    await page.locator('input[name="phone"]').fill("+91 98765 43210");
    await page.locator('input[name="pincode"]').fill("380009");
    await page.locator('input[name="line1"]').fill("Navrangpura Cross Roads");
    await page.locator('input[name="city"]').fill("Ahmedabad");
    await Promise.all([page.waitForURL(fakeStripeUrl), page.getByRole("button", { name: "Pay Securely with Stripe" }).click()]);

    expect(sent).toMatchObject({
      guestEmail: "guest@example.com",
      lines: [{ productId: "m-white-oxford-shirt", size: "M", color: "White", qty: 1 }],
      address: { city: "Ahmedabad", state: "Gujarat" },
    });
    expect(JSON.stringify(sent)).not.toMatch(/price/i);
  });

  test("guest order pages are private to the browser that placed them", { tag: "@regression" }, async ({ page }) => {
    const res = await page.goto("/orders/someGuestOrderId");
    expect(res?.status()).toBe(404);
  });

  test("account pages require sign-in", { tag: "@regression" }, async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/signin\?next=(%2F|\/)account$/);
    await page.goto("/account/orders/someoneElsesOrder");
    await expect(page).toHaveURL(/\/signin\?next=/);
  });
});
