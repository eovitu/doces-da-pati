import { Produto } from "@/types/produto";

/**
 * Monta o link do WhatsApp já com a mensagem de pedido pronta.
 * Ajustar o texto assim que o briefing definir o modelo exato de mensagem.
 */
export function linkPedidoWhatsapp(numero: string, produto: Produto): string {
  const precoTexto = produto.preco === 0 ? "consulte o preço" : formatarPreco(produto.preco);
  const mensagem = `Olá! Vim pelo site e gostaria de pedir: ${produto.nome} (${precoTexto}).`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function linkContatoWhatsapp(numero: string): string {
  const mensagem = "Olá! Vim pelo site e gostaria de tirar uma dúvida.";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Formata um preço em centavos como moeda. `0` significa "sem preço
 * definido ainda" (ex.: encomenda sob consulta) — nunca deve chegar aqui
 * como "R$ 0,00"; quem chama deve checar `preco === 0` antes.
 */
export function formatarPreco(precoEmCentavos: number): string {
  return (precoEmCentavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
