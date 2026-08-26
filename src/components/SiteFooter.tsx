"use client";

import styled from "styled-components";
import { BairroEntrega, LojaInfo } from "@/types/produto";
import { linkContatoWhatsapp } from "@/lib/whatsapp";
import { theme, media } from "@/styles/theme";

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão (maquininha)",
  dinheiro: "Dinheiro",
};

const Footer = styled.footer`
  border-top: 1px solid ${theme.colors.line};
`;

const Inner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${theme.maxWidth};
  padding: ${theme.spacing.xl} ${theme.spacing.md};

  ${media.desktop} {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg} ${theme.spacing.xl};
  }
`;

const Colunas = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const Bloco = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Rotulo = styled.h2`
  font-family: ${theme.typography.body};
  font-size: ${theme.fontSize.micro};
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.colors.inkMuted};
  margin-bottom: ${theme.spacing.xxs};
`;

const Linha = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};
`;

const Marca = styled.p`
  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.produto};
  letter-spacing: -0.015em;
  color: ${theme.colors.ink};
  margin-bottom: ${theme.spacing.xs};
`;

const Link = styled.a`
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  color: ${theme.colors.accent};
  border-bottom: 1px solid transparent;
  align-self: flex-start;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${theme.colors.accentHover};
    border-color: ${theme.colors.accentHover};
  }
`;

const Base = styled.div`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.line};
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs} ${theme.spacing.md};
  justify-content: space-between;
  font-size: ${theme.fontSize.micro};
  color: ${theme.colors.inkMuted};
`;

export function SiteFooter({
  loja,
  bairros,
}: {
  loja: LojaInfo;
  bairros: BairroEntrega[];
}) {
  const pagamentos = loja.formasPagamento
    .map((forma) => ROTULO_PAGAMENTO[forma] ?? forma)
    .join(" · ");

  return (
    <Footer>
      <Inner>
        <Colunas>
          <Bloco>
            <Marca>{loja.nome}</Marca>
            <Linha>{loja.regiao}</Linha>
            <Link
              href={linkContatoWhatsapp(loja.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </Link>
            {loja.instagram && (
              <Link href={loja.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </Link>
            )}
          </Bloco>

          <Bloco>
            <Rotulo>Retirada e entrega</Rotulo>
            <Linha>Retirada no {loja.retirada}</Linha>
            {bairros.length > 0 && (
              <Linha>
                Entrega em {bairros.map((bairro) => bairro.nome).join(", ")}
              </Linha>
            )}
          </Bloco>

          <Bloco>
            <Rotulo>Horários</Rotulo>
            <Linha>Atendimento {loja.horarioAtendimento}</Linha>
            <Linha>Entrega {loja.horarioEntrega}</Linha>
          </Bloco>

          <Bloco>
            <Rotulo>Pagamento</Rotulo>
            {pagamentos && <Linha>{pagamentos}</Linha>}
            {loja.conservacao && <Linha>{loja.conservacao}</Linha>}
          </Bloco>
        </Colunas>

        <Base>
          <span>{loja.cnpjOuNome ?? loja.nome}</span>
          <span>Pedidos e confirmação pelo WhatsApp</span>
        </Base>
      </Inner>
    </Footer>
  );
}
