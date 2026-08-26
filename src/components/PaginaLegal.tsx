import styled from "styled-components";
import Link from "next/link";
import { theme, media } from "@/styles/theme";

const Secao = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 720px;
  padding: ${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing.xxl};

  ${media.desktop} {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  }
`;

const Voltar = styled(Link)`
  display: inline-block;
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.accent};
  border-bottom: 1px solid transparent;

  &:hover {
    border-color: ${theme.colors.accent};
  }
`;

const Titulo = styled.h1`
  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.secao};
  letter-spacing: -0.01em;
  margin-bottom: ${theme.spacing.xs};
`;

const Atualizado = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};
  margin-bottom: ${theme.spacing.xl};
`;

const Prosa = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  font-size: ${theme.fontSize.body};
  color: ${theme.colors.ink};
  line-height: 1.7;

  h2 {
    font-family: ${theme.typography.display};
    font-size: ${theme.fontSize.lead};
    margin-top: ${theme.spacing.md};
  }

  ul {
    padding-left: 1.2em;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
  }

  a {
    color: ${theme.colors.accent};
    border-bottom: 1px solid ${theme.colors.accent};
  }
`;

export function PaginaLegal({
  titulo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  atualizadoEm: string;
  children: React.ReactNode;
}) {
  return (
    <Secao>
      <Voltar href="/">← Voltar para a vitrine</Voltar>
      <Titulo>{titulo}</Titulo>
      <Atualizado>Atualizado em {atualizadoEm}</Atualizado>
      <Prosa>{children}</Prosa>
    </Secao>
  );
}
