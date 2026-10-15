import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin pulls in jose (ESM-only) via jwks-rsa; bundling it with
  // Turbopack breaks at runtime with ERR_REQUIRE_ESM, so load it natively instead.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
