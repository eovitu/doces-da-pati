"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Produto } from "@/types/produto";
import { formatarPreco, linkPedidoWhatsapp } from "@/lib/whatsapp";
import { theme, media } from "@/styles/theme";

gsap.registerPlugin(ScrollTrigger);

const Card = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${theme.radii.lg};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  background: ${theme.colors.border};
`;

const ImagemPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${theme.spacing.sm};
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: 0.875rem;
`;

const IndisponivelBadge = styled.span`
  position: absolute;
  top: ${theme.spacing.xs};
  left: ${theme.spacing.xs};
  border-radius: 999px;
  background: rgba(28, 25, 23, 0.8);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md};

  ${media.desktop} {
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.sm};
  }
`;

const Nome = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};

  ${media.desktop} {
    font-size: 1.125rem;
  }
`;

const Descricao = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PrecoRow = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${theme.spacing.xs};
`;

const Preco = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const BotaoPedir = styled.a<{ $disponivel: boolean }>`
  margin-top: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radii.md};
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  transition: background-color 0.15s ease;
  background: ${({ $disponivel }) => ($disponivel ? theme.colors.accent : theme.colors.disabled)};
  pointer-events: ${({ $disponivel }) => ($disponivel ? "auto" : "none")};

  ${({ $disponivel }) =>
    $disponivel && `&:hover { background: ${theme.colors.accentHover}; }`}
`;

export function ProdutoCard({ produto, whatsapp }: { produto: Produto; whatsapp: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imagem = produto.imagens[0];
  const disponivel = !produto.controlaEstoque || (produto.estoque ?? 0) > 0;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <Card ref={cardRef}>
      <ImageWrapper>
        {imagem ? (
          <Image
            src={imagem.url}
            alt={imagem.alt ?? produto.nome}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
          />
        ) : (
          <ImagemPlaceholder>{produto.nome}</ImagemPlaceholder>
        )}
        {!disponivel && <IndisponivelBadge>Indisponível</IndisponivelBadge>}
      </ImageWrapper>

      <Content>
        <Nome>{produto.nome}</Nome>
        {produto.descricao && <Descricao>{produto.descricao}</Descricao>}

        <PrecoRow>
          <Preco>{produto.preco === 0 ? "Consulte o preço" : formatarPreco(produto.preco)}</Preco>
        </PrecoRow>

        <BotaoPedir
          href={linkPedidoWhatsapp(whatsapp, produto)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!disponivel}
          $disponivel={disponivel}
        >
          Pedir pelo WhatsApp
        </BotaoPedir>
      </Content>
    </Card>
  );
}
