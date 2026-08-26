import { ItemCarrinho, rotuloItem, subtotalItem } from "@/types/carrinho";
import { formatarPreco } from "./whatsapp";

export function totalPedido(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, item) => soma + subtotalItem(item), 0);
}

/** "26/08/2026" e "12:30" no fuso de quem está montando o pedido. */
export function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarHora(data: Date): string {
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarDataHora(data: Date): string {
  return `${formatarData(data)} às ${formatarHora(data)}`;
}

/**
 * Monta o resumo do pedido que vai preenchido na conversa do WhatsApp.
 *
 * Deliberadamente não é chamado de nota nem de comprovante: o site não emite
 * documento fiscal nenhum, só organiza o que o cliente escolheu. Entrega,
 * frete e forma de pagamento ficam de fora — esses dados não existem no
 * pedido montado aqui e são combinados na conversa.
 */
export function mensagemPedido(
  itens: ItemCarrinho[],
  nomeCliente: string,
  agora: Date = new Date()
): string {
  const linhas = itens.map(
    (item) =>
      `• ${rotuloItem(item)} × ${item.quantidade} — ${formatarPreco(subtotalItem(item))}`
  );
  const divisoria = "--------------------------------";

  return [
    "NOVO PEDIDO — OS DOCES DA PATI",
    "",
    `Cliente: ${nomeCliente.trim()}`,
    `Data: ${formatarData(agora)}`,
    `Horário: ${formatarHora(agora)}`,
    "",
    "ITENS",
    "",
    ...linhas,
    "",
    divisoria,
    `TOTAL: ${formatarPreco(totalPedido(itens))}`,
    divisoria,
    "",
    "Pedido enviado pelo catálogo online.",
  ].join("\n");
}

export function linkPedidoCompleto(
  numero: string,
  itens: ItemCarrinho[],
  nomeCliente: string,
  agora: Date = new Date()
): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(
    mensagemPedido(itens, nomeCliente, agora)
  )}`;
}
