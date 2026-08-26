"use client";

import styled from "styled-components";
import { Produto } from "@/types/produto";
import { theme, media } from "@/styles/theme";
import { ProdutoItem } from "./ProdutoItem";
import { Reveal } from "./Reveal";

// Grid editorial, não malha uniforme: no desktop os 8 produtos ocupam quatro
// linhas de larguras diferentes (7+5, 4+4+4, 6+6, 5 solto), como uma página de
// revista. O padrão se repete se a Patricia cadastrar mais produtos.
const SPANS_DESKTOP = [7, 5, 4, 4, 4, 6, 6, 5];
const SIZES = [
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 58vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 42vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 50vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 50vw",
  "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 42vw",
];

const Secao = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: ${theme.maxWidth};
  padding: ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.xl};

  ${media.desktop} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.xxl};
  }
`;

const Cabecalho = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.line};
`;

const TituloSecao = styled.h2`
  font-size: ${theme.fontSize.secao};
  letter-spacing: -0.015em;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 60;
`;

const Contagem = styled.p`
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.inkMuted};
  white-space: nowrap;
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xl};

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xl} ${theme.spacing.lg};
  }

  ${media.desktop} {
    grid-template-columns: repeat(12, 1fr);
    column-gap: ${theme.spacing.lg};
    row-gap: ${theme.spacing.xxl};
  }
`;

const Celula = styled.li<{ $span: number; $recuo: boolean }>`
  ${media.desktop} {
    grid-column: span ${({ $span }) => $span};
    /* o segundo de cada par desce um pouco: é o que tira a página da malha */
    padding-top: ${({ $recuo }) => ($recuo ? theme.spacing.xl : "0")};
  }
`;

export function Vitrine({ produtos, whatsapp }: { produtos: Produto[]; whatsapp: string }) {
  return (
    <Secao id="produtos" aria-labelledby="titulo-produtos">
      <Cabecalho>
        <TituloSecao id="titulo-produtos">A vitrine</TituloSecao>
        <Contagem>
          {produtos.length} {produtos.length === 1 ? "item" : "itens"}
        </Contagem>
      </Cabecalho>

      <Grid>
        {produtos.map((produto, i) => {
          const span = SPANS_DESKTOP[i % SPANS_DESKTOP.length];
          return (
            <Celula key={produto.slug} $span={span} $recuo={span === 5 && i % 2 === 1}>
              <Reveal>
                <ProdutoItem
                  produto={produto}
                  whatsapp={whatsapp}
                  sizes={SIZES[i % SIZES.length]}
                  prioridade={i === 0}
                />
              </Reveal>
            </Celula>
          );
        })}
      </Grid>
    </Secao>
  );
}
