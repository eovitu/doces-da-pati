import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, normalizeGoogleVerificationToken, SITE_URL } from "./site";

test("mantém a origem pública canônica", () => {
  assert.equal(SITE_URL.origin, "https://doces-da-pati.vercel.app");
});

test("resolve caminhos a partir do endereço público", () => {
  assert.equal(
    absoluteUrl("/sitemap.xml"),
    "https://doces-da-pati.vercel.app/sitemap.xml"
  );
});

test("normaliza o valor copiado do Search Console", () => {
  assert.equal(
    normalizeGoogleVerificationToken("google-site-verification=abc_123"),
    "abc_123"
  );
  assert.equal(normalizeGoogleVerificationToken("  abc_123  "), "abc_123");
  assert.equal(normalizeGoogleVerificationToken(undefined), undefined);
});
