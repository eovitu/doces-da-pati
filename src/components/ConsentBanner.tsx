"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { theme, media } from "@/styles/theme";
import { atualizarConsentimento } from "@/lib/analytics";

export const CHAVE_CONSENTIMENTO = "doces-da-pati:consent-analytics";
const EVENTO_REABRIR = "doces-da-pati:reabrir-preferencias-cookies";

/** Usado pelo link "Preferências de cookies" no rodapé para reabrir o banner. */
export function reabrirPreferenciasCookies() {
  window.dispatchEvent(new Event(EVENTO_REABRIR));
}

const Faixa = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.paper};
  border-top: 1px solid ${theme.colors.line};
  box-shadow: 0 -4px 16px rgba(46, 30, 26, 0.08);

  ${media.tablet} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
  }
`;

const Texto = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};

  a {
    color: ${theme.colors.accent};
    border-bottom: 1px solid ${theme.colors.accent};
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-shrink: 0;
`;

const BotaoBase = styled.button`
  font-family: ${theme.typography.body};
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  min-height: 44px;
  padding: 0.6rem 1.25rem;
  border-radius: ${theme.radii.pill};
  cursor: pointer;
`;

const Aceitar = styled(BotaoBase)`
  border: 0;
  background: ${theme.colors.accent};
  color: #fff;

  &:hover {
    background: ${theme.colors.accentHover};
  }
`;

const Recusar = styled(BotaoBase)`
  border: 1px solid ${theme.colors.line};
  background: transparent;
  color: ${theme.colors.ink};

  &:hover {
    border-color: ${theme.colors.inkMuted};
  }
`;

export function ConsentBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function lerConsentimentoSalvo(): string | null {
      try {
        return window.localStorage.getItem(CHAVE_CONSENTIMENTO);
      } catch {
        return null;
      }
    }
    // Promise.resolve só pra manter o setState dentro de um callback, não
    // direto no corpo do effect — leitura em si é síncrona.
    Promise.resolve(lerConsentimentoSalvo()).then((salvo) => {
      setVisivel(salvo !== "granted" && salvo !== "denied");
    });

    function reabrir() {
      setVisivel(true);
    }
    window.addEventListener(EVENTO_REABRIR, reabrir);
    return () => window.removeEventListener(EVENTO_REABRIR, reabrir);
  }, []);

  function escolher(concedido: boolean) {
    try {
      window.localStorage.setItem(CHAVE_CONSENTIMENTO, concedido ? "granted" : "denied");
    } catch {
      // segue sem persistir; pergunta de novo na próxima visita
    }
    atualizarConsentimento(concedido);
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <Faixa role="dialog" aria-label="Preferências de cookies">
      <Texto>
        Usamos o Google Analytics só pra entender quais produtos fazem mais
        sucesso — sem coletar nome, telefone ou endereço.{" "}
        <Link href="/privacidade">Saiba mais</Link>
      </Texto>
      <Acoes>
        <Recusar type="button" onClick={() => escolher(false)}>
          Recusar
        </Recusar>
        <Aceitar type="button" onClick={() => escolher(true)}>
          Aceitar
        </Aceitar>
      </Acoes>
    </Faixa>
  );
}
