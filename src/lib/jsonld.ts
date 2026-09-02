import { LojaInfo, Produto } from "@/types/produto";
import { absoluteUrl } from "./site";

/**
 * LocalBusiness/Bakery com só o que existe de verdade no modelo de dados —
 * sem endereço de rua (não temos) e sem inventar horário estruturado além
 * do que já está em horarioAtendimento.
 */
export function jsonLdLoja(loja: LojaInfo, produtos: Produto[]): string {
  const precos = produtos.filter((p) => p.preco > 0).map((p) => p.preco);
  const faixaDePreco =
    precos.length > 0
      ? `R$${(Math.min(...precos) / 100).toFixed(0)} - R$${(Math.max(...precos) / 100).toFixed(0)}`
      : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": absoluteUrl("/#business"),
    name: loja.nome,
    url: absoluteUrl(),
    logo: absoluteUrl("/produtos/logo-doces-da-pati.png"),
    image: absoluteUrl("/og.jpg"),
    telephone: `+${loja.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: loja.regiao,
    ...(faixaDePreco ? { priceRange: faixaDePreco } : {}),
    ...(loja.instagram ? { sameAs: [loja.instagram] } : {}),
  };

  return JSON.stringify(json);
}
