"use client";

import Image from "next/image";
import styled from "styled-components";
import { Produto } from "@/types/produto";
import { formatarPreco, linkPedidoWhatsapp } from "@/lib/whatsapp";
import { theme, media } from "@/styles/theme";

// Sem cartão: nem borda, nem sombra, nem caixa branca. As fotos foram feitas
// sobre mármore e parede off-white, então o produto assenta direto num "papel"
// (theme.colors.paper) puxado do fundo das próprias imagens. O contorno da
// foto some e sobra o doce.
const Figura = styled.figure`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  /* sem raio: canto reto some contra o fundo, canto arredondado desenha a
     moldura que a gente está justamente tentando não ter */
  background: ${theme.colors.paper};

  img {
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

const Item = styled.article<{ $disponivel: boolean }>`
  display: flex;
  flex-direction: column;

  ${Figura} {
    opacity: ${({ $disponivel }) => ($disponivel ? 1 : 0.55)};
  }

  &:hover ${Figura} img {
    transform: scale(1.03);
  }

  ${media.reducedMotion} {
    &:hover ${Figura} img {
      transform: none;
    }
  }
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${theme.spacing.md};
  text-align: center;
  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.lead};
  color: ${theme.colors.inkMuted};
  background: ${theme.colors.paper};
`;

const Selo = styled.span`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.sm};
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.ink};
  color: ${theme.colors.background};
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.7rem;
`;

const Texto = styled.div`
  padding-top: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Nome = styled.h3`
  font-size: ${theme.fontSize.produto};
  letter-spacing: -0.015em;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 40;
  /* "Espetinho de bombom de morango" é o nome mais longo — quebra em duas
     linhas equilibradas em vez de deixar uma palavra órfã. */
  max-width: 18ch;
`;

const Descricao = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};
  max-width: 42ch;
`;

const Sabores = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};
  max-width: 42ch;
`;

const Rodape = styled.div`
  margin-top: ${theme.spacing.sm};
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${theme.spacing.md};
`;

const Preco = styled.p`
  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.lead};
  color: ${theme.colors.ink};
`;

const Pedir = styled.a`
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  color: ${theme.colors.accent};
  border-bottom: 1px solid ${theme.colors.accent};
  padding-bottom: 1px;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${theme.colors.accentHover};
    border-color: ${theme.colors.accentHover};
  }
`;

const Indisponivel = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};
`;

// Oito links com o mesmo texto visível na página — o nome do produto precisa
// estar no rótulo acessível para leitor de tela distinguir um do outro.
export function ProdutoItem({
  produto,
  whatsapp,
  sizes,
  prioridade = false,
}: {
  produto: Produto;
  whatsapp: string;
  sizes: string;
  prioridade?: boolean;
}) {
  const imagem = produto.imagens[0];
  const disponivel = !produto.controlaEstoque || (produto.estoque ?? 0) > 0;

  return (
    <Item $disponivel={disponivel}>
      <Figura>
        {imagem ? (
          <Image
            src={imagem.url}
            alt={imagem.alt ?? produto.nome}
            fill
            sizes={sizes}
            priority={prioridade}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Placeholder>{produto.nome}</Placeholder>
        )}
        {!disponivel && <Selo>Esgotado</Selo>}
      </Figura>

      <Texto>
        <Nome>{produto.nome}</Nome>
        {produto.descricao && <Descricao>{produto.descricao}</Descricao>}
        {produto.sabores && produto.sabores.length > 0 && (
          <Sabores>Sabores: {produto.sabores.join(", ")}</Sabores>
        )}

        <Rodape>
          <Preco>
            {produto.preco === 0 ? "Consulte o preço" : formatarPreco(produto.preco)}
          </Preco>
          {disponivel ? (
            <Pedir
              href={linkPedidoWhatsapp(whatsapp, produto)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pedir ${produto.nome} pelo WhatsApp`}
            >
              Pedir pelo WhatsApp
            </Pedir>
          ) : (
            <Indisponivel>Sem estoque no momento</Indisponivel>
          )}
        </Rodape>
      </Texto>
    </Item>
  );
}
