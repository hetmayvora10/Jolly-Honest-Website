import { test, expect } from "@playwright/test";

// We don't sign in with real credentials here — that would need a live
// Firebase Auth user and leak into CI. Instead we verify the gate itself:
// unauthenticated visitors see the login form, never the bookings table,
// and a wrong password is rejected without granting access.

test.describe("Admin dashboard auth gate", () => {
  test("shows the sign-in form, not the bookings table, when logged out", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bookings" })).toHaveCount(0);
  });

  test("rejects an invalid login without exposing bookings", async ({ page }) => {
    await page.goto("/admin");
    await page.locator('input[name="email"]').fill("not-a-real-admin@example.com");
    await page.locator('input[name="password"]').fill("definitely-wrong-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Bookings" })).toHaveCount(0);
  });

  test("the bookings API rejects unauthenticated requests", async ({ request }) => {
    const res = await request.get("/api/admin/bookings");
    expect(res.status()).toBe(401);
  });
});
