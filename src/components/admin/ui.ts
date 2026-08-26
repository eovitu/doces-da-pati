"use client";

import styled from "styled-components";
import { theme, media } from "@/styles/theme";

// Peças básicas do painel. Mesma marca da vitrine (cores, tipografia), mas
// sem a experiência editorial: aqui é ferramenta, prioridade é usabilidade.

export const Pagina = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  color: ${theme.colors.ink};
`;

export const Conteudo = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 720px;
  padding: ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.xl};

  ${media.desktop} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

export const Titulo = styled.h1`
  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.secao};
  letter-spacing: -0.01em;
`;

export const Subtitulo = styled.p`
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.inkSoft};
  font-size: ${theme.fontSize.small};
`;

export const Cartao = styled.section`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.md};
`;

export const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};
  margin-bottom: ${theme.spacing.md};
`;

export const Rotulo = styled.label`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};
`;

export const Input = styled.input`
  /* 16px no mobile impede o zoom automático do iOS ao focar o campo. */
  font-family: ${theme.typography.body};
  font-size: 1rem;
  color: ${theme.colors.ink};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.sm};
  padding: ${theme.spacing.sm};
  min-height: 48px;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    background: ${theme.colors.paper};
    color: ${theme.colors.inkMuted};
  }
`;

export const Botao = styled.button`
  font-family: ${theme.typography.body};
  font-size: ${theme.fontSize.body};
  min-height: 48px;
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: #ffffff;
  background: ${theme.colors.accent};
  border: none;
  border-radius: ${theme.radii.sm};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${theme.colors.accentHover};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.ink};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${theme.colors.disabled};
    color: ${theme.colors.ink};
    cursor: default;
  }
`;

export const BotaoSecundario = styled(Botao)`
  width: auto;
  background: transparent;
  color: ${theme.colors.accent};
  border: 1px solid ${theme.colors.accent};

  &:hover:not(:disabled) {
    background: ${theme.colors.accentSoft};
    color: ${theme.colors.accentHover};
  }
`;

export const Textarea = styled.textarea`
  font-family: ${theme.typography.body};
  font-size: 1rem;
  color: ${theme.colors.ink};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.sm};
  padding: ${theme.spacing.sm};
  min-height: 96px;
  resize: vertical;

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
    border-color: ${theme.colors.accent};
  }
`;

export const LinhaCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.ink};

  input {
    width: 20px;
    height: 20px;
    accent-color: ${theme.colors.accent};
  }
`;

export const BotaoIcone = styled.button`
  font-family: ${theme.typography.body};
  font-size: ${theme.fontSize.small};
  min-height: 36px;
  min-width: 36px;
  padding: 0 ${theme.spacing.xs};
  color: ${theme.colors.inkSoft};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.sm};
  cursor: pointer;

  &:hover:not(:disabled) {
    color: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const Mensagem = styled.p`
  margin-bottom: ${theme.spacing.md};
  padding: ${theme.spacing.sm};
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.ink};
  background: ${theme.colors.accentSoft};
  border-left: 3px solid ${theme.colors.accent};
  border-radius: ${theme.radii.sm};
`;
