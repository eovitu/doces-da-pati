import assert from "node:assert/strict";
import test from "node:test";
import * as analytics from "./analytics";

const produto = {
  slug: "pao-de-mel",
  nome: "Pão de mel",
  preco: 1000,
};

function capturarGtag() {
  const chamadas: unknown[][] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      gtag: (...args: unknown[]) => chamadas.push(args),
    },
  });
  return chamadas;
}

test.afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

test("registra impressão como item de uma vitrine", () => {
  const chamadas = capturarGtag();
  const visualizarItemDaLista = (
    analytics as unknown as Record<string, (...args: unknown[]) => void>
  ).visualizarItemDaLista;

  visualizarItemDaLista(produto, "vitrine");

  assert.deepEqual(chamadas, [
    [
      "event",
      "view_item_list",
      {
        item_list_id: "vitrine",
        item_list_name: "Vitrine principal",
        items: [{ item_id: "pao-de-mel", item_name: "Pão de mel", price: 10 }],
      },
    ],
  ]);
});

test("registra seleção de produto na mesma vitrine", () => {
  const chamadas = capturarGtag();
  const selecionarItem = (
    analytics as unknown as Record<string, (...args: unknown[]) => void>
  ).selecionarItem;

  selecionarItem(produto, "vitrine");

  assert.equal(chamadas[0]?.[1], "select_item");
  assert.deepEqual((chamadas[0]?.[2] as { items: unknown[] }).items, [
    { item_id: "pao-de-mel", item_name: "Pão de mel", price: 10 },
  ]);
});

test("registra origem do WhatsApp sem URL ou mensagem", () => {
  const chamadas = capturarGtag();
  const clicarWhatsapp = (
    analytics as unknown as Record<string, (...args: unknown[]) => void>
  ).clicarWhatsapp;

  clicarWhatsapp("consulta_produto", produto);

  assert.deepEqual(chamadas, [
    [
      "event",
      "click_whatsapp",
      {
        link_origem: "consulta_produto",
        item_id: "pao-de-mel",
        item_name: "Pão de mel",
      },
    ],
  ]);
});
