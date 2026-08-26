"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";

const Link = styled.a`
  position: absolute;
  left: ${theme.spacing.md};
  top: ${theme.spacing.md};
  z-index: 10;
  padding: 0.75rem 1.25rem;
  border-radius: ${theme.radii.pill};
  background: ${theme.colors.accent};
  color: #fff;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  transform: translateY(-200%);
  transition: transform 0.2s ease;

  &:focus-visible {
    transform: translateY(0);
  }
`;

export function SkipLink() {
  return <Link href="#conteudo">Pular para os produtos</Link>;
}
