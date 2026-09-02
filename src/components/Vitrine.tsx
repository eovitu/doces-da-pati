"use client";

import styled from "styled-components";
import { Produto } from "@/types/produto";
import { theme, media } from "@/styles/theme";
import { ProdutoItem } from "./ProdutoItem";
import { Reveal } from "./Reveal";

// Grid fixo: 1 coluna no mobile, 2 no tablet/desktop, cards com a mesma
// altura em cada fileira. O grid editorial de larguras variáveis saiu daqui
// por deixar buracos no fim de fileira (a última tinha só 5 de 12 colunas).
const SIZES = "(max-width: 767px) 100vw, 50vw";

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
`;

const Celula = styled.li`
  height: 100%;
`;

// Reveal renderiza uma div comum; sem isso ela não estica pra acompanhar a
// altura da fileira do grid, e o card de dentro não teria como preencher.
const RevealCheia = styled(Reveal)`
  height: 100%;
  display: flex;
  flex-direction: column;
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
        {produtos.map((produto, i) => (
          <Celula key={produto.slug}>
            <RevealCheia>
              <ProdutoItem
                produto={produto}
                whatsapp={whatsapp}
                sizes={SIZES}
                lista="vitrine"
                prioridade={i === 0}
              />
            </RevealCheia>
          </Celula>
        ))}
      </Grid>
    </Secao>
  );
}
