import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de Privacidade — Os Doces da Pati",
  description: "Como o site da Os Doces da Pati trata os dados de quem faz um pedido.",
};

// NOTA: este texto foi escrito para ser honesto e compreensível, mas não
// substitui uma revisão jurídica. Antes de considerar a loja plenamente
// adequada à LGPD, um profissional habilitado deve revisar este conteúdo.
export default function PoliticaDePrivacidade() {
  return (
    <PaginaLegal titulo="Política de Privacidade" atualizadoEm="26 de agosto de 2026">
      <p>
        Este site é o catálogo online da Os Doces da Pati. Aqui explicamos, de
        forma simples, quais dados usamos quando você visita o site ou monta
        um pedido.
      </p>

      <h2>O que coletamos e quando</h2>
      <p>
        O único dado pessoal que pedimos é o <strong>seu nome</strong>, e só
        no momento em que você decide finalizar um pedido pelo carrinho. Esse
        nome fica só no seu navegador, na memória da página — não é enviado
        para nenhum banco de dados nosso. Ele serve unicamente para montar a
        mensagem que você mesma confirma e envia pelo WhatsApp.
      </p>
      <p>
        Os produtos que você coloca no carrinho (o quê, quantidade, sabor)
        ficam guardados no seu próprio celular ou computador, para o carrinho
        não se perder se a página recarregar. Isso também não vai para
        nenhum servidor nosso.
      </p>

      <h2>Como o pedido é finalizado</h2>
      <p>
        Quando você toca em enviar, o site abre uma conversa no seu WhatsApp
        com a mensagem do pedido já escrita. A partir desse momento, a
        conversa acontece no WhatsApp e passa a valer a{" "}
        <a
          href="https://www.whatsapp.com/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          política de privacidade do próprio WhatsApp
        </a>
        , não a nossa. É ali que a Patricia confirma o pedido, o telefone e o
        endereço de entrega com você.
      </p>

      <h2>O que fica guardado nos nossos sistemas</h2>
      <p>
        Usamos o Firebase (Google Cloud), com banco de dados hospedado na
        região <strong>southamerica-east1 (São Paulo)</strong>, para guardar
        apenas:
      </p>
      <ul>
        <li>o catálogo de produtos e as informações da loja (dados públicos, sem nenhuma informação sobre clientes);</li>
        <li>o login da Patricia para administrar o site — nenhuma cliente precisa criar conta.</li>
      </ul>
      <p>
        Não guardamos nome, telefone, endereço ou qualquer outro dado de
        quem faz pedido no nosso banco de dados.
      </p>

      <h2>Quem tem acesso</h2>
      <p>
        Só a Patricia, dona da loja, tem acesso à área administrativa do
        site. Não vendemos nem compartilhamos nenhum dado com terceiros para
        fins comerciais.
      </p>

      <h2>Google Analytics</h2>
      <p>
        Usamos o Google Analytics para entender, de forma agregada, quantas
        pessoas visitam o site e quais produtos despertam mais interesse —
        por exemplo, visualizações de produto e cliques em &ldquo;adicionar ao
        carrinho&rdquo;. Essas informações não incluem seu nome, telefone,
        endereço ou qualquer dado que identifique você.
      </p>
      <p>
        O Analytics só é ativado se você aceitar no banner de cookies que
        aparece no rodapé do site. Você pode recusar, e pode mudar de ideia a
        qualquer momento pelo link &ldquo;Preferências de cookies&rdquo; no rodapé.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Como o site não guarda dados pessoais seus em banco de dados, não há
        um cadastro para corrigir ou apagar. Se mesmo assim você quiser saber
        mais, pedir alguma informação ou tiver qualquer dúvida sobre
        privacidade, fale diretamente com a Patricia pelo WhatsApp:{" "}
        <a href="https://wa.me/5511986092770" target="_blank" rel="noopener noreferrer">
          (11) 98609-2770
        </a>
        .
      </p>
    </PaginaLegal>
  );
}
