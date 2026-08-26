"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useCarrinho } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/whatsapp";
import { theme, media } from "@/styles/theme";

// Barra fixa no rodapé: no celular é o único ponto de entrada do carrinho que
// não obriga a pessoa a subir a página de volta.
const Barra = styled.div<{ $recuada: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  background: ${theme.colors.ink};
  color: ${theme.colors.background};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  padding-bottom: calc(${theme.spacing.sm} + env(safe-area-inset-bottom, 0px));

  /* com o carrinho aberto a barra fica atrás do modal: some para não competir */
  opacity: ${({ $recuada }) => ($recuada ? 0 : 1)};
  transition: opacity 0.2s ease;

  ${media.desktop} {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
  }
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: ${theme.maxWidth};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

const Resumo = styled.p`
  display: flex;
  flex-direction: column;
  font-size: ${theme.fontSize.small};
  line-height: 1.35;

  strong {
    font-family: ${theme.typography.display};
    font-size: ${theme.fontSize.lead};
    font-weight: 400;
  }

  span {
    color: ${theme.colors.disabled};
    font-size: ${theme.fontSize.micro};
  }
`;

const Botao = styled.button`
  font-family: inherit;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  padding: 0.75rem 1.4rem;
  border: 0;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${theme.colors.accentHover};
  }

  &:focus-visible {
    outline-color: ${theme.colors.background};
  }
`;

// A barra é fixa: sem este espaçador ela cobriria o fim do rodapé.
const Espacador = styled.div`
  height: 5.5rem;
`;

export function BarraCarrinho() {
  const { totalItens, total, abrir, aberto } = useCarrinho();
  const ref = useRef<HTMLDivElement>(null);
  const visivel = totalItens > 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !visivel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      el,
      { y: "100%" },
      { y: "0%", duration: 0.35, ease: "power2.out" }
    );
  }, [visivel]);

  if (!visivel) return null;

  return (
    <>
      <Espacador aria-hidden="true" />
      <Barra ref={ref} $recuada={aberto} aria-hidden={aberto}>
        <Inner>
          <Resumo>
          <strong>{formatarPreco(total)}</strong>
          <span>
            {totalItens} {totalItens === 1 ? "item" : "itens"} no carrinho
          </span>
        </Resumo>
        <Botao type="button" onClick={abrir} disabled={aberto}>
          Ver carrinho
        </Botao>
      </Inner>
      </Barra>
    </>
  );
}
