import { test, expect } from "@playwright/test";
import { AdminPage } from "./pages/AdminPage";

// We don't sign in with real credentials here — that would need a live
// Firebase Auth user and leak into CI. Instead we verify the gate itself:
// unauthenticated visitors see the login form, never the bookings table,
// and a wrong password is rejected without granting access.

test.describe("Admin dashboard auth gate", () => {
  test(
    "shows the sign-in form, not the bookings table, when logged out",
    { tag: "@smoke" },
    async ({ page }) => {
      const admin = new AdminPage(page);
      await admin.goto();
      await expect(admin.signInHeading).toBeVisible();
      await expect(admin.bookingsHeading).toHaveCount(0);
    }
  );

  test(
    "rejects an invalid login without exposing bookings",
    { tag: "@regression" },
    async ({ page }) => {
      const admin = new AdminPage(page);
      await admin.goto();
      await admin.login("not-a-real-admin@example.com", "definitely-wrong-password");

      await expect(admin.loginErrorMessage).toBeVisible({ timeout: 10000 });
      await expect(admin.bookingsHeading).toHaveCount(0);
    }
  );

  test(
    "the bookings API rejects unauthenticated requests",
    { tag: "@smoke" },
    async ({ request }) => {
      const res = await request.get("/api/admin/bookings");
      expect(res.status()).toBe(401);
    }
  );
});
