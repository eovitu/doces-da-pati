import { Produto } from "@/types/produto";

/**
 * Monta o link do WhatsApp já com a mensagem de pedido pronta.
 * Ajustar o texto assim que o briefing definir o modelo exato de mensagem.
 */
export function linkPedidoWhatsapp(numero: string, produto: Produto): string {
  const mensagem = `Olá! Vim pelo site e gostaria de pedir: ${produto.nome} (${formatarPreco(produto.preco)}).`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function linkContatoWhatsapp(numero: string): string {
  const mensagem = "Olá! Vim pelo site e gostaria de tirar uma dúvida.";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
