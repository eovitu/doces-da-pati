import type { MetadataRoute } from "next";

const BASE_URL = "https://doces-da-pati.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/termos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
