import { test, expect } from "@playwright/test";
import { isAdminEmail } from "../lib/firebase/verify-token";

// These hit the real server routes, but every check here rejects the request
// before it reaches Firestore or Stripe, so CI needs no backend secrets.

const VALID_BOOKING = {
  name: "Playwright Test",
  phone: "+919876500000",
  service: "Shirt Tailoring",
  preferredDate: "2026-12-01",
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

  test("admin API rejects a forged token", { tag: "@regression" }, async ({ request }) => {
    const res = await request.get("/api/admin/bookings", {
      headers: { Authorization: "Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0." },
    });
    expect(res.status()).toBe(401);
    expect(res.headers()["cache-control"]).toBe("no-store");
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
