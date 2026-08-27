import { getProdutos } from "@/lib/produtos";
import { getEntregaConfig, getLojaInfo } from "@/lib/loja";
import { SiteHeader } from "@/components/SiteHeader";
import { AvisoTemporario } from "@/components/AvisoTemporario";
import { Vitrine } from "@/components/Vitrine";
import { Encomendas } from "@/components/Encomendas";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { CarrinhoProvider } from "@/lib/carrinho";
import { BarraCarrinho } from "@/components/BarraCarrinho";
import { CarrinhoSheet } from "@/components/CarrinhoSheet";
import { linkEncomendaWhatsapp } from "@/lib/whatsapp";
import { jsonLdLoja } from "@/lib/jsonld";

// Com o Firebase ligado, os dados vêm do Firestore e mudam pelo admin — sem
// revalidação a vitrine ficaria presa aos dados do último build. 60s é
// folgado sobrando cota das 50.000 leituras/dia do plano Spark (ver
// docs/ESPECIFICACAO.md §7) e ainda reflete uma edição quase em tempo real.
export const revalidate = 60;

export default async function Home() {
  const [produtos, loja, entrega] = await Promise.all([
    getProdutos(),
    getLojaInfo(),
    getEntregaConfig(),
  ]);
  const aviso = loja.avisoTemporario;

  return (
    <CarrinhoProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdLoja(loja, produtos) }}
      />
      <SkipLink />
      {aviso?.ativo && <AvisoTemporario mensagem={aviso.mensagem} />}
      <SiteHeader loja={loja} />
      <main id="conteudo">
        <Vitrine produtos={produtos} whatsapp={loja.whatsapp} />
        <Encomendas href={linkEncomendaWhatsapp(loja.whatsapp)} />
      </main>
      <SiteFooter loja={loja} bairros={entrega.bairros} />
      <BarraCarrinho />
      <CarrinhoSheet whatsapp={loja.whatsapp} />
    </CarrinhoProvider>
  );
}
