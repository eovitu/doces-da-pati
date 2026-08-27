"use client";

import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { precoComSabor, Produto, saborEsgotado } from "@/types/produto";

import { useCarrinho } from "@/lib/carrinho";
import { formatarPreco } from "@/lib/whatsapp";
import { theme, media } from "@/styles/theme";

const Bloco = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Rotulo = styled.p`
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.inkMuted};
`;

const Sabores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
`;

const Sabor = styled.button<{ $ativo: boolean }>`
  font-family: inherit;
  font-size: ${theme.fontSize.small};
  min-height: 44px;
  padding: 0.4rem 0.85rem;
  border-radius: ${theme.radii.pill};
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  border: 1px solid
    ${({ $ativo }) => ($ativo ? theme.colors.ink : theme.colors.line)};
  background: ${({ $ativo }) => ($ativo ? theme.colors.ink : "transparent")};
  color: ${({ $ativo }) => ($ativo ? theme.colors.background : theme.colors.inkSoft)};

  &:hover:not(:disabled) {
    border-color: ${({ $ativo }) => ($ativo ? theme.colors.ink : theme.colors.inkMuted)};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    text-decoration: line-through;
  }
`;

const Linha = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Botao = styled.button`
  font-family: inherit;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border: 0;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${theme.colors.accentHover};
  }

  &:disabled {
    background: ${theme.colors.disabled};
    color: ${theme.colors.inkSoft};
    cursor: not-allowed;
  }
`;

const NoCarrinho = styled.span`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};
`;

const Aviso = styled.span`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};
`;

const Consulta = styled.a`
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  color: ${theme.colors.accent};
  border-bottom: 1px solid ${theme.colors.accent};

  &:hover {
    color: ${theme.colors.accentHover};
    border-color: ${theme.colors.accentHover};
  }

  ${media.desktop} {
    white-space: nowrap;
  }
`;

export function AdicionarAoCarrinho({
  produto,
  disponivel,
  linkConsulta,
}: {
  produto: Produto;
  disponivel: boolean;
  linkConsulta: string;
}) {
  const { adicionar, itens } = useCarrinho();
  const temSabores = Boolean(produto.sabores && produto.sabores.length > 0);
  const [sabor, setSabor] = useState<string | undefined>(undefined);
  const [confirmado, setConfirmado] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const grupoId = useId();

  const noCarrinho = itens
    .filter((item) => item.produtoSlug === produto.slug)
    .reduce((soma, item) => soma + item.quantidade, 0);

  useEffect(() => {
    if (!confirmado) return;
    const timer = window.setTimeout(() => setConfirmado(false), 1600);
    return () => window.clearTimeout(timer);
  }, [confirmado]);

  // Produto sem preço definido não entra no carrinho: somar um valor
  // inventado ao total seria pior do que mandar a pessoa perguntar.
  if (produto.preco === 0) {
    return (
      <Consulta href={linkConsulta} target="_blank" rel="noopener noreferrer">
        Consultar no WhatsApp
      </Consulta>
    );
  }

  if (!disponivel) {
    return <Aviso>Sem estoque no momento</Aviso>;
  }

  const faltaEscolherSabor = temSabores && !sabor;

  function onAdicionar() {
    if (faltaEscolherSabor) return;
    adicionar(produto, sabor);
    setConfirmado(true);
    const el = botaoRef.current;
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.28, ease: "power2.out" });
    }
  }

  return (
    <Bloco>
      {temSabores && (
        <>
          <Rotulo id={grupoId}>Escolha o sabor</Rotulo>
          <Sabores role="group" aria-labelledby={grupoId}>
            {produto.sabores?.map((opcao) => {
              const esgotado = saborEsgotado(produto, opcao);
              const adicional = produto.precoAdicionalPorSabor?.[opcao] ?? 0;
              return (
                <Sabor
                  key={opcao}
                  type="button"
                  disabled={esgotado}
                  $ativo={sabor === opcao}
                  aria-pressed={sabor === opcao}
                  aria-label={esgotado ? `${opcao} — esgotado` : opcao}
                  onClick={() => setSabor(sabor === opcao ? undefined : opcao)}
                >
                  {opcao}
                  {adicional > 0 && ` (+${formatarPreco(adicional)})`}
                  {esgotado && " (esgotado)"}
                </Sabor>
              );
            })}
          </Sabores>
        </>
      )}

      <Linha>
        <Botao
          ref={botaoRef}
          type="button"
          onClick={onAdicionar}
          disabled={faltaEscolherSabor}
          aria-label={`Adicionar ${produto.nome}${sabor ? ` sabor ${sabor}` : ""} ao carrinho`}
        >
          {confirmado ? "Adicionado ✓" : "Adicionar"}
        </Botao>
        {faltaEscolherSabor ? (
          <Aviso>Escolha um sabor para adicionar</Aviso>
        ) : sabor && precoComSabor(produto, sabor) !== produto.preco ? (
          <NoCarrinho>{formatarPreco(precoComSabor(produto, sabor))}</NoCarrinho>
        ) : (
          noCarrinho > 0 && (
            <NoCarrinho>
              {noCarrinho} no carrinho
            </NoCarrinho>
          )
        )}
      </Linha>
    </Bloco>
  );
}

