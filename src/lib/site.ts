export const SITE_NAME = "Os Doces da Pati";
export const SITE_URL = new URL("https://doces-da-pati.vercel.app");

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function normalizeGoogleVerificationToken(
  value: string | undefined
): string | undefined {
  const normalized = value
    ?.trim()
    .replace(/^google-site-verification=/, "")
    .trim();

  return normalized || undefined;
}
