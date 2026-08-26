"use client";

import styled from "styled-components";
import { theme, media } from "@/styles/theme";

const Faixa = styled.div`
  background: ${theme.colors.accentSoft};
  color: ${theme.colors.ink};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  text-align: center;
  font-size: ${theme.fontSize.small};

  ${media.desktop} {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
  }
`;

const Inner = styled.p`
  margin: 0 auto;
  max-width: ${theme.maxWidth};
`;

export function AvisoTemporario({ mensagem }: { mensagem: string }) {
  return (
    <Faixa role="status">
      <Inner>{mensagem}</Inner>
    </Faixa>
  );
}
