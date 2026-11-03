import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-inline' scripts are needed because Next.js inlines its hydration
// data; the nonce-based alternative forces every page to render dynamically.
// The policy still blocks scripts from any other domain, plugins, framing,
// <base> hijacking and data being sent anywhere but the hosts listed here.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Firebase Auth (admin sign-in) talks to these two Google APIs.
  "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
  // The embedded map in the Visit section.
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // firebase-admin pulls in jose (ESM-only) via jwks-rsa; bundling it with
  // Turbopack breaks at runtime with ERR_REQUIRE_ESM, so load it natively instead.
  serverExternalPackages: ["firebase-admin"],
  // Explicit, so nobody flips it on later: source maps would publish the
  // original source code to every visitor.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
