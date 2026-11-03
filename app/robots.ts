import type { MetadataRoute } from "next";

const BASE_URL = "https://jollyhonest.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/booking/success", "/account", "/bag", "/checkout", "/signin", "/signup", "/forgot-password"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
