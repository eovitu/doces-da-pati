import { getProdutos } from "@/lib/produtos";
import { entregaConfigSeed, lojaInfoSeed } from "@/data/produtos-seed";
import { SiteHeader } from "@/components/SiteHeader";
import { AvisoTemporario } from "@/components/AvisoTemporario";
import { Vitrine } from "@/components/Vitrine";
import { Encomendas } from "@/components/Encomendas";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { linkEncomendaWhatsapp } from "@/lib/whatsapp";

export default async function Home() {
  const produtos = await getProdutos();
  const loja = lojaInfoSeed; // trocar por dados vindos do Firebase quando existir o documento "loja/info"
  const aviso = loja.avisoTemporario;

  return (
    <>
      <SkipLink />
      {aviso?.ativo && <AvisoTemporario mensagem={aviso.mensagem} />}
      <SiteHeader loja={loja} />
      <main id="conteudo">
        <Vitrine produtos={produtos} whatsapp={loja.whatsapp} />
        <Encomendas href={linkEncomendaWhatsapp(loja.whatsapp)} />
      </main>
      <SiteFooter loja={loja} bairros={entregaConfigSeed.bairros} />
    </>
  );
}
