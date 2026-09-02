"use client";

import styled from "styled-components";
import { LojaInfo } from "@/types/produto";
import { linkContatoWhatsapp } from "@/lib/whatsapp";
import { clicarWhatsapp } from "@/lib/analytics";
import { theme, media } from "@/styles/theme";
import { Reveal } from "./Reveal";

const Header = styled.div`
  padding: ${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing.lg};

  ${media.desktop} {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg} ${theme.spacing.xl};
  }
`;

const Inner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${theme.maxWidth};
`;

const Sobretitulo = styled.p`
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: ${theme.spacing.md};
`;

const Nome = styled.h1`
  font-size: ${theme.fontSize.display};
  letter-spacing: -0.02em;
  max-width: 14ch;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 96;
`;

const Frase = styled.p`
  margin-top: ${theme.spacing.md};
  max-width: 34ch;
  font-size: ${theme.fontSize.lead};
  color: ${theme.colors.inkSoft};

  ${media.desktop} {
    max-width: 40ch;
  }
`;

const Meta = styled.dl`
  margin-top: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};

  ${media.tablet} {
    flex-direction: row;
    gap: ${theme.spacing.lg};
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};

  dt {
    font-size: ${theme.fontSize.micro};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${theme.colors.inkMuted};
  }

  dd {
    color: ${theme.colors.ink};
  }
`;

const Acao = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.lg};
  padding: 0.875rem 1.5rem;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #fff;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${theme.colors.accentHover};
    transform: translateY(-1px);
  }
`;

export function SiteHeader({ loja }: { loja: LojaInfo }) {
  return (
    <Reveal as="header">
      <Header>
        <Inner>
          <Sobretitulo>Doceria artesanal · {loja.regiao}</Sobretitulo>
          <Nome>{loja.nome}</Nome>
          <Frase>
            {loja.sobre ??
              "Doces feitos em casa, um a um, para o pedido chegar fresco. Escolha aqui e finalize a conversa no WhatsApp."}
          </Frase>

          <Meta>
            <MetaItem>
              <dt>Atendimento</dt>
              <dd>{loja.horarioAtendimento}</dd>
            </MetaItem>
            <MetaItem>
              <dt>Retirada</dt>
              <dd>{loja.retirada}</dd>
            </MetaItem>
            <MetaItem>
              <dt>Entrega</dt>
              <dd>{loja.horarioEntrega}</dd>
            </MetaItem>
          </Meta>

          <Acao
            href={linkContatoWhatsapp(loja.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => clicarWhatsapp("cabecalho")}
          >
            Falar no WhatsApp
          </Acao>
        </Inner>
      </Header>
    </Reveal>
  );
}
