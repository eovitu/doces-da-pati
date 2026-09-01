/**
 * Ponte tipada com o GA4 — nenhum componente chama gtag() direto.
 *
 * Regra inegociável: NUNCA passar nome, telefone, endereço, email ou
 * qualquer dado que identifique a cliente. Só dados de produto e
 * comportamento de navegação/pedido.
 */
import { ItemCarrinho, subtotalItem } from "@/types/carrinho";
import { Produto } from "@/types/produto";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Em dev não medimos nada — evita poluir os relatórios com testes locais. */
export const analyticsHabilitado = Boolean(GA_ID) && process.env.NODE_ENV === "production";

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag(...args);
}

function paraReais(centavos: number): number {
  return Math.round(centavos) / 100;
}

interface ItemGA4 {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_variant?: string;
}

export type ListaProdutos = "destaques" | "vitrine";
export type OrigemWhatsapp =
  | "cabecalho"
  | "rodape"
  | "encomendas"
  | "consulta_produto"
  | "pedido";

const NOMES_LISTA: Record<ListaProdutos, string> = {
  destaques: "Produtos em destaque",
  vitrine: "Vitrine principal",
};

function produtoParaGA4(
  produto: Pick<Produto, "slug" | "nome" | "preco">
): ItemGA4 {
  return {
    item_id: produto.slug,
    item_name: produto.nome,
    price: paraReais(produto.preco),
  };
}

function itemParaGA4(item: Pick<ItemCarrinho, "produtoSlug" | "nome" | "precoUnitario" | "sabor" | "quantidade">): ItemGA4 {
  return {
    item_id: item.produtoSlug,
    item_name: item.nome,
    price: paraReais(item.precoUnitario),
    quantity: item.quantidade,
    ...(item.sabor ? { item_variant: item.sabor } : {}),
  };
}

/** Cliente ainda não escolheu (ou recusou) — Analytics não roda. */
export function definirConsentimentoPadrao() {
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function atualizarConsentimento(concedido: boolean) {
  gtag("consent", "update", {
    analytics_storage: concedido ? "granted" : "denied",
    // ad_* seguem negados: o site não faz remarketing nem personalização de anúncio.
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function visualizarItemDaLista(
  produto: Pick<Produto, "slug" | "nome" | "preco">,
  lista: ListaProdutos
) {
  gtag("event", "view_item_list", {
    item_list_id: lista,
    item_list_name: NOMES_LISTA[lista],
    items: [produtoParaGA4(produto)],
  });
}

export function selecionarItem(
  produto: Pick<Produto, "slug" | "nome" | "preco">,
  lista: ListaProdutos
) {
  gtag("event", "select_item", {
    item_list_id: lista,
    item_list_name: NOMES_LISTA[lista],
    items: [produtoParaGA4(produto)],
  });
}

export function clicarWhatsapp(
  origem: OrigemWhatsapp,
  produto?: Pick<Produto, "slug" | "nome">
) {
  gtag("event", "click_whatsapp", {
    link_origem: origem,
    ...(produto
      ? { item_id: produto.slug, item_name: produto.nome }
      : {}),
  });
}

export function adicionarAoCarrinho(item: Parameters<typeof itemParaGA4>[0]) {
  gtag("event", "add_to_cart", {
    currency: "BRL",
    value: paraReais(item.precoUnitario) * item.quantidade,
    items: [itemParaGA4(item)],
  });
}

export function removerDoCarrinho(item: Parameters<typeof itemParaGA4>[0]) {
  gtag("event", "remove_from_cart", {
    currency: "BRL",
    value: paraReais(item.precoUnitario) * item.quantidade,
    items: [itemParaGA4(item)],
  });
}

export function iniciarCheckout(itens: ItemCarrinho[]) {
  const total = itens.reduce((soma, item) => soma + subtotalItem(item), 0);
  gtag("event", "begin_checkout", {
    currency: "BRL",
    value: paraReais(total),
    items: itens.map(itemParaGA4),
  });
}

/**
 * O pedido foi enviado pro WhatsApp — não sabemos se a Patricia confirmou
 * ou se a venda se concretizou, então isso é um lead, nunca "purchase".
 */
export function gerarLead(itens: ItemCarrinho[], tipoEntrega: "retirada" | "entrega" | null, formaPagamento: string | null) {
  const total = itens.reduce((soma, item) => soma + subtotalItem(item), 0);
  gtag("event", "generate_lead", {
    currency: "BRL",
    value: paraReais(total),
    ...(tipoEntrega ? { tipo_entrega: tipoEntrega } : {}),
    ...(formaPagamento ? { forma_pagamento: formaPagamento } : {}),
  });
}
