import assert from "node:assert/strict";
import test from "node:test";
import { selecionarProdutosDestaque } from "./destaques";
import { Produto } from "@/types/produto";

function produto(
  slug: string,
  overrides: Partial<Produto> = {}
): Produto {
  return {
    slug,
    nome: slug,
    preco: 1000,
    imagens: [],
    ativo: true,
    ordem: 0,
    controlaEstoque: false,
    ...overrides,
  };
}

test("seleciona somente produtos destacados, ativos e disponíveis na ordem recebida", () => {
  const produtos = [
    produto("primeiro", { destaque: true }),
    produto("comum"),
    produto("inativo", { destaque: true, ativo: false }),
    produto("esgotado", {
      destaque: true,
      controlaEstoque: true,
      estoque: 0,
    }),
    produto("segundo", { destaque: true }),
  ];

  assert.deepEqual(
    selecionarProdutosDestaque(produtos).map(({ slug }) => slug),
    ["primeiro", "segundo"]
  );
});
