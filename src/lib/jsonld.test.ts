import assert from "node:assert/strict";
import test from "node:test";
import { lojaInfoSeed, produtosSeed } from "@/data/produtos-seed";
import { jsonLdLoja } from "./jsonld";
import { absoluteUrl } from "./site";

test("publica a confeitaria com identidade e URLs canônicas", () => {
  const json = JSON.parse(jsonLdLoja(lojaInfoSeed, produtosSeed));

  assert.equal(json["@type"], "Bakery");
  assert.equal(json["@id"], absoluteUrl("/#business"));
  assert.equal(json.url, absoluteUrl());
  assert.equal(json.logo, absoluteUrl("/produtos/logo-doces-da-pati.png"));
  assert.equal(json.image, absoluteUrl("/og.jpg"));
});

test("não inventa localização ou horário estruturado", () => {
  const json = JSON.parse(jsonLdLoja(lojaInfoSeed, produtosSeed));

  assert.equal(json.address.streetAddress, undefined);
  assert.equal(json.geo, undefined);
  assert.equal(json.openingHoursSpecification, undefined);
});
