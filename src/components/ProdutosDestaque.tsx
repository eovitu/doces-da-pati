"use client";

import styled from "styled-components";
import { Produto } from "@/types/produto";
import { theme, media } from "@/styles/theme";
import { ProdutoItem } from "./ProdutoItem";
import { Reveal } from "./Reveal";

const SIZES = "(max-width: 767px) 100vw, 50vw";

const Secao = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: ${theme.maxWidth};
  padding: ${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing.lg};

  ${media.desktop} {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg} ${theme.spacing.xl};
  }
`;

const Cabecalho = styled.div`
  max-width: 42rem;
  margin-bottom: ${theme.spacing.xl};
`;

const Rotulo = styled.p`
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.fontSize.micro};
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${theme.colors.accent};
`;

const Titulo = styled.h2`
  font-size: ${theme.fontSize.display};
  letter-spacing: -0.035em;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 72;
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xl};

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const Celula = styled.li`
  height: 100%;
`;

const RevealCheia = styled(Reveal)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export function ProdutosDestaque({
  produtos,
  whatsapp,
}: {
  produtos: Produto[];
  whatsapp: string;
}) {
  if (produtos.length === 0) return null;

  return (
    <Secao aria-labelledby="titulo-destaques">
      <Cabecalho>
        <Rotulo>Escolhas da Pati</Rotulo>
        <Titulo id="titulo-destaques">Produtos em destaque</Titulo>
      </Cabecalho>

      <Grid>
        {produtos.map((produto, indice) => (
          <Celula key={produto.slug}>
            <RevealCheia>
              <ProdutoItem
                produto={produto}
                whatsapp={whatsapp}
                sizes={SIZES}
                prioridade={indice === 0}
              />
            </RevealCheia>
          </Celula>
        ))}
      </Grid>
    </Secao>
  );
}
