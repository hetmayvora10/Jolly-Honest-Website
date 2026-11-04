import { test, expect } from "@playwright/test";
import { isAdminEmail } from "../lib/firebase/verify-token";
import { priceCart, cartLineSchema } from "../lib/pricing";
import { safeNextPath } from "../lib/http";

// These hit the real server routes, but every check here rejects the request
// before it reaches Firestore or Stripe, so CI needs no backend secrets.

const VALID_BOOKING = {
  name: "Playwright Test",
  phone: "+919876500000",
  service: "Shirt Tailoring",
  preferredDate: "2026-12-01",
};

const VALID_CHECKOUT = {
  lines: [{ productId: "m-white-oxford-shirt", size: "M", color: "White", qty: 1 }],
  address: {
    fullName: "Test Shopper",
    phone: "+919876500000",
    line1: "Navrangpura Cross Roads",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380009",
  },
};

test.describe("Security", () => {
  test("pages send security headers", { tag: "@smoke" }, async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("does not publish JavaScript source maps", { tag: "@regression" }, async ({ request }) => {
    const html = await (await request.get("/")).text();
    const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
    expect(scripts.length).toBeGreaterThan(0);

    for (const src of scripts) {
      const js = await (await request.get(src)).text();
      expect(js, src).not.toContain("sourceMappingURL");
      expect((await request.get(`${src}.map`)).status(), `${src}.map`).toBe(404);
    }
  });

  test("bookings API rejects requests from other sites", { tag: "@regression" }, async ({ request }) => {
    const res = await request.post("/api/bookings", {
      headers: { Origin: "https://evil.example" },
      data: VALID_BOOKING,
    });
    expect(res.status()).toBe(403);
  });

  test("bookings API rejects non-JSON form posts", { tag: "@regression" }, async ({ request }) => {
    const res = await request.post("/api/bookings", {
      headers: { "Content-Type": "text/plain" },
      data: JSON.stringify(VALID_BOOKING),
    });
    expect(res.status()).toBe(415);
  });

  test("bookings API rejects malformed input", { tag: "@regression" }, async ({ request }) => {
    const res = await request.post("/api/bookings", {
      data: { ...VALID_BOOKING, name: { $gt: "" }, preferredDate: "<script>" },
    });
    expect(res.status()).toBe(400);
  });

  test("admin API rejects requests without a session", { tag: "@smoke" }, async ({ request }) => {
    const res = await request.get("/api/admin/bookings");
    expect(res.status()).toBe(401);
    expect(res.headers()["cache-control"]).toBe("no-store");
  });

  test("admin API rejects a forged session cookie", { tag: "@regression" }, async ({ request }) => {
    // alg "none" token claiming to be someone: must never be accepted.
    const forged = "eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4IiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.";
    const res = await request.get("/api/admin/bookings", { headers: { Cookie: `jh_session=${forged}` } });
    expect(res.status()).toBe(401);
  });

  test("checkout API requires a session or a guest email", { tag: "@regression" }, async ({ request }) => {
    const res = await request.post("/api/checkout", { data: VALID_CHECKOUT });
    expect(res.status()).toBe(401);
  });

  test("guest checkout validates the email and honeypot", { tag: "@regression" }, async ({ request }) => {
    const badEmail = await request.post("/api/checkout", { data: { ...VALID_CHECKOUT, guestEmail: "not-an-email" } });
    expect(badEmail.status()).toBe(400);
    const bot = await request.post("/api/checkout", {
      data: { ...VALID_CHECKOUT, guestEmail: "a@example.com", website: "http://spam.example" },
    });
    expect(bot.status()).toBe(400);
  });

  test("checkout API rejects requests from other sites", { tag: "@regression" }, async ({ request }) => {
    const res = await request.post("/api/checkout", {
      headers: { Origin: "https://evil.example" },
      data: { lines: [], address: {} },
    });
    expect(res.status()).toBe(403);
  });

  test("session API rejects malformed sign-in requests", { tag: "@regression" }, async ({ request }) => {
    expect((await request.post("/api/auth/session", { data: { idToken: "" } })).status()).toBe(400);
    const crossSite = await request.post("/api/auth/session", {
      headers: { Origin: "https://evil.example" },
      data: { idToken: "x" },
    });
    expect(crossSite.status()).toBe(403);
  });

  test("checkout prices come from the catalogue, not the browser", { tag: "@regression" }, () => {
    const tampered = { productId: "m-white-oxford-shirt", size: "M", color: "White", qty: 2, price: 1, unitPrice: 1 };
    const result = priceCart([tampered]);
    expect(result.ok && result.subtotal).toBe(3490 * 2);

    expect(priceCart([{ ...tampered, productId: "made-up" }]).ok).toBe(false);
    expect(priceCart([{ ...tampered, size: "XXXXL" }]).ok).toBe(false);
    expect(priceCart([{ ...tampered, color: "Gold Leaf" }]).ok).toBe(false);
    expect(priceCart([]).ok).toBe(false);
    expect(cartLineSchema.safeParse({ ...tampered, qty: 0 }).success).toBe(false);
    expect(cartLineSchema.safeParse({ ...tampered, qty: 11 }).success).toBe(false);
    expect(cartLineSchema.safeParse({ ...tampered, qty: 1.5 }).success).toBe(false);
  });

  test("post-sign-in redirects stay on this site", { tag: "@regression" }, () => {
    expect(safeNextPath("/checkout")).toBe("/checkout");
    for (const evil of ["//evil.example", "https://evil.example", "/\\evil.example", "javascript:alert(1)", "", null]) {
      expect(safeNextPath(evil), String(evil)).toBe("/account");
    }
  });

  test("admin allowlist fails closed and matches exactly", { tag: "@regression" }, () => {
    const original = process.env.ADMIN_EMAILS;
    try {
      delete process.env.ADMIN_EMAILS;
      expect(isAdminEmail("owner@example.com")).toBe(false);

      process.env.ADMIN_EMAILS = " Owner@Example.com , staff@example.com ";
      expect(isAdminEmail("owner@example.com")).toBe(true);
      expect(isAdminEmail("staff@example.com")).toBe(true);
      expect(isAdminEmail("stranger@example.com")).toBe(false);
      expect(isAdminEmail("owner@example.com.evil.io")).toBe(false);
      expect(isAdminEmail(null)).toBe(false);
    } finally {
      if (original === undefined) delete process.env.ADMIN_EMAILS;
      else process.env.ADMIN_EMAILS = original;
    }
  });
});
