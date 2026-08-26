"use client";

import styled from "styled-components";
import { theme, media } from "@/styles/theme";
import { Reveal } from "./Reveal";

// Encomendas de festinha são sob consulta: não têm preço e por isso não são
// card de produto. Chamada à parte, levando direto para a conversa.
const Faixa = styled.div`
  background: ${theme.colors.accentSoft};
`;

const Inner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${theme.maxWidth};
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  ${media.desktop} {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg};
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${theme.spacing.xl};
  }
`;

const Titulo = styled.h2`
  font-size: ${theme.fontSize.secao};
  letter-spacing: -0.015em;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 60;
  max-width: 16ch;
`;

const Texto = styled.p`
  margin-top: ${theme.spacing.sm};
  max-width: 46ch;
  color: ${theme.colors.inkSoft};
`;

const Acao = styled.a`
  flex-shrink: 0;
  align-self: flex-start;
  display: inline-flex;
  padding: 0.875rem 1.5rem;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #fff;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${theme.colors.accentHover};
    transform: translateY(-1px);
  }
`;

export function Encomendas({ href }: { href: string }) {
  return (
    <Reveal as="section">
      <Faixa>
        <Inner>
          <div>
            <Titulo>Encomendas para festinha</Titulo>
            <Texto>
              Brigadeiros e pão de mel em quantidade, sob consulta. Me conte a data,
              quantas pessoas e os sabores que você quer — a gente combina o resto
              pelo WhatsApp.
            </Texto>
          </div>
          <Acao href={href} target="_blank" rel="noopener noreferrer">
            Pedir orçamento
          </Acao>
        </Inner>
      </Faixa>
    </Reveal>
  );
}
