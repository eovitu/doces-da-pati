import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Termos de Uso — Os Doces da Pati",
  description: "Como funciona o catálogo online da Os Doces da Pati.",
};

// NOTA: texto simples e direto; não substitui revisão jurídica antes de
// considerar a loja plenamente adequada.
export default function TermosDeUso() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizadoEm="26 de agosto de 2026">
      <p>
        Este site é a vitrine online da Os Doces da Pati — um catálogo para
        você conhecer os produtos, montar um pedido e finalizar a compra
        conversando com a Patricia pelo WhatsApp.
      </p>

      <h2>O pedido não é confirmado automaticamente</h2>
      <p>
        Montar o pedido no site e enviar a mensagem pelo WhatsApp{" "}
        <strong>não confirma a venda</strong>. A confirmação — de
        disponibilidade, prazo, forma de pagamento e entrega — acontece na
        conversa com a Patricia.
      </p>

      <h2>Preços e disponibilidade podem mudar</h2>
      <p>
        Os preços mostrados no site podem ser atualizados sem aviso prévio.
        Produtos e sabores dependem da disponibilidade do dia; o que está
        esgotado é sinalizado no site, mas a confirmação final é sempre pelo
        WhatsApp.
      </p>

      <h2>As fotos são ilustrativas</h2>
      <p>
        As imagens dos produtos usadas hoje no site foram geradas por
        inteligência artificial a partir do catálogo real da loja, para
        representar a aparência geral de cada doce. O produto entregue pode
        variar em relação à foto — aparência, tamanho e finalização artesanal
        variam de fornada para fornada.
      </p>

      <h2>Uso do site</h2>
      <p>
        O site é de uso livre para consulta e montagem de pedidos. Pedimos
        que as informações fornecidas (como o nome no carrinho) sejam
        verdadeiras, para que a Patricia consiga te atender direito na
        conversa do WhatsApp.
      </p>

      <h2>Dúvidas</h2>
      <p>
        Qualquer dúvida sobre estes termos, fale com a Patricia pelo{" "}
        <a href="https://wa.me/5511986092770" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </p>
    </PaginaLegal>
  );
}
