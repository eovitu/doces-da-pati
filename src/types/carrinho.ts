import { precoComSabor, Produto } from "./produto";

/**
 * Uma linha do carrinho. Sabores diferentes do mesmo produto são linhas
 * diferentes — "Pão de mel — Ninho" e "Pão de mel — Prestígio" não se somam.
 */
export interface ItemCarrinho {
  /** slug + sabor: identidade da linha dentro do carrinho */
  id: string;
  produtoSlug: string;
  nome: string;
  /** centavos, congelado no momento em que o item entrou no carrinho */
  precoUnitario: number;
  sabor?: string;
  quantidade: number;
}

export function idItem(produtoSlug: string, sabor?: string): string {
  return sabor ? `${produtoSlug}__${sabor}` : produtoSlug;
}

/** "Pão de mel — Ninho" ou só "Pão de mel" quando o produto não tem sabor. */
export function rotuloItem(item: Pick<ItemCarrinho, "nome" | "sabor">): string {
  return item.sabor ? `${item.nome} — ${item.sabor}` : item.nome;
}

export function subtotalItem(item: ItemCarrinho): number {
  return item.precoUnitario * item.quantidade;
}

export function novoItem(produto: Produto, sabor: string | undefined, quantidade: number): ItemCarrinho {
  return {
    id: idItem(produto.slug, sabor),
    produtoSlug: produto.slug,
    nome: produto.nome,
    precoUnitario: precoComSabor(produto, sabor),
    sabor,
    quantidade,
  };
}
