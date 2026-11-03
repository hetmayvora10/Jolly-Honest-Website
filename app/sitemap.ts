import type { MetadataRoute } from "next";
import { CATEGORY_IDS, PRODUCTS } from "@/lib/catalog";

const BASE_URL = "https://jollyhonest.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...CATEGORY_IDS.map((id) => ({
      url: `${BASE_URL}/shop/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
