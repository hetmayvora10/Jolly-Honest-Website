import { test, expect } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";

// No real accounts are created or signed into here — that would need live
// credentials in CI. These cover the gates and the checks that run before
// Firebase is ever called.

test.describe("Accounts and admin access", () => {
  test("admin dashboard redirects signed-out visitors to sign in", { tag: "@smoke" }, async ({ page }) => {
    const auth = new AuthPage(page);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/signin\?next=(%2F|\/)admin$/);
    await expect(auth.signInHeading).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toHaveCount(0);
  });

  test("rejects an invalid login", { tag: "@regression" }, async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoSignIn();
    await auth.signIn("not-a-real-admin@example.com", "definitely-wrong-password");
    await expect(auth.errorMessage).toHaveText("Invalid email or password.", { timeout: 10000 });
  });

  test("sign-up checks the password before creating anything", { tag: "@regression" }, async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoSignUp();

    await auth.signUp({ name: "Test Shopper", email: "shopper@example.com", password: "short", confirm: "short" });
    await expect(auth.passwordInput).toHaveJSProperty("validity.tooShort", true);

    await auth.signUp({
      name: "Test Shopper",
      email: "shopper@example.com",
      password: "a-long-enough-passphrase",
      confirm: "a-different-passphrase",
    });
    await expect(auth.errorMessage).toHaveText("The passwords don't match.");
  });

  test("password reset never reveals whether an account exists", { tag: "@regression" }, async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoForgotPassword();
    await auth.requestReset("nobody-has-this-address@example.com");
    await expect(auth.statusMessage).toContainText("If an account exists for that email", { timeout: 10000 });
  });

  test("sign-in ignores off-site redirect targets", { tag: "@regression" }, async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.gotoSignIn("//evil.example/steal");
    await expect(page.getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "/signup?next=%2Faccount"
    );
  });
});
