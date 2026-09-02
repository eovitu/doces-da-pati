import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl(), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/privacidade"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/termos"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
