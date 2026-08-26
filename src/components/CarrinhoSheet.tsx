"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useCarrinho } from "@/lib/carrinho";
import { rotuloItem, subtotalItem } from "@/types/carrinho";
import { formatarPreco } from "@/lib/whatsapp";
import { formatarDataHora, linkPedidoCompleto } from "@/lib/pedido";
import { theme, media } from "@/styles/theme";

type Etapa = "carrinho" | "nome" | "resumo";

// <dialog> nativo: Escape, foco preso dentro do modal, resto da página inerte e
// camada de topo vêm de graça e corretos, sem biblioteca nova.
const Dialogo = styled.dialog`
  border: 0;
  padding: 0;
  background: transparent;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  margin: 0;
  color: ${theme.colors.ink};

  &::backdrop {
    background: rgba(46, 30, 26, 0.45);
  }
`;

const Ancora = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100%;

  ${media.tablet} {
    align-items: center;
  }
`;

const Painel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 92dvh;
  background: ${theme.colors.background};
  border-radius: 1rem 1rem 0 0;

  ${media.tablet} {
    max-width: 34rem;
    max-height: 88dvh;
    border-radius: 0.75rem;
  }
`;

const Topo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.line};
`;

const Titulo = styled.h2`
  font-size: ${theme.fontSize.secao};
  letter-spacing: -0.015em;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 60;
`;

const Fechar = styled.button`
  font-family: inherit;
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};
  background: transparent;
  border: 0;
  padding: ${theme.spacing.xs};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.ink};
  }
`;

const Corpo = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Rodape = styled.div`
  border-top: 1px solid ${theme.colors.line};
  padding: ${theme.spacing.md};
  padding-bottom: calc(${theme.spacing.md} + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Lista = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Linha = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.line};

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
`;

const NomeItem = styled.h3`
  font-size: ${theme.fontSize.lead};
  letter-spacing: -0.01em;
  font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 40;
`;

const Detalhe = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};
`;

const Controles = styled.div`
  margin-top: ${theme.spacing.xxs};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.pill};
  padding: 0.15rem;
`;

const BotaoQtd = styled.button`
  font-family: inherit;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${theme.colors.ink};
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${theme.colors.paper};
  }
`;

const Quantidade = styled.span`
  min-width: 1.75rem;
  text-align: center;
  font-size: ${theme.fontSize.body};
  font-variant-numeric: tabular-nums;
`;

const Subtotal = styled.p`
  font-family: ${theme.typography.display};
  font-size: ${theme.fontSize.lead};
`;

const Remover = styled.button`
  align-self: flex-start;
  font-family: inherit;
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.inkMuted};
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

const TotalLinha = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.spacing.md};

  dt {
    font-size: ${theme.fontSize.micro};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${theme.colors.inkMuted};
  }

  dd {
    font-family: ${theme.typography.display};
    font-size: ${theme.fontSize.produto};
  }
`;

const Principal = styled.button`
  font-family: inherit;
  font-size: ${theme.fontSize.small};
  font-weight: 600;
  width: 100%;
  padding: 0.95rem 1.5rem;
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

const PrincipalLink = styled(Principal).attrs({ as: "a" })`
  display: block;
  text-align: center;
`;

const Secundario = styled.button`
  font-family: inherit;
  font-size: ${theme.fontSize.small};
  width: 100%;
  padding: ${theme.spacing.xs};
  background: transparent;
  border: 0;
  color: ${theme.colors.inkSoft};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.ink};
  }
`;

const Vazio = styled.div`
  padding: ${theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  text-align: center;

  p {
    color: ${theme.colors.inkSoft};
  }
`;

const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  label {
    font-size: ${theme.fontSize.small};
    font-weight: 600;
  }

  input {
    font-family: inherit;
    font-size: ${theme.fontSize.body};
    padding: 0.85rem 1rem;
    border: 1px solid ${theme.colors.line};
    border-radius: ${theme.radii.md};
    background: ${theme.colors.background};
    color: ${theme.colors.ink};

    &::placeholder {
      color: ${theme.colors.inkMuted};
    }
  }
`;

const Erro = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.accentHover};
`;

const Nota = styled.p`
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkMuted};
`;

const ResumoLista = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  li {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing.md};
    font-size: ${theme.fontSize.small};
  }

  li span:last-child {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;

export function CarrinhoSheet({ whatsapp }: { whatsapp: string }) {
  const { itens, total, totalItens, definirQuantidade, remover, aberto, fechar, limpar } =
    useCarrinho();
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [etapaEscolhida, setEtapa] = useState<Etapa>("carrinho");
  // Carrinho vazio nunca chega às etapas de finalização: se a última linha for
  // removida no meio do caminho, a tela volta sozinha para o carrinho.
  const etapa: Etapa = itens.length === 0 ? "carrinho" : etapaEscolhida;
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [finalizadoEm, setFinalizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;

    if (aberto && !dialogo.open) {
      setEtapa("carrinho");
      setErro(null);
      dialogo.showModal();
      const painel = painelRef.current;
      if (painel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          painel,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    } else if (!aberto && dialogo.open) {
      dialogo.close();
    }
  }, [aberto]);

  // Escape e clique no backdrop fecham o <dialog> por conta própria; o estado
  // do contexto precisa acompanhar.
  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    const onClose = () => fechar();
    dialogo.addEventListener("close", onClose);
    return () => dialogo.removeEventListener("close", onClose);
  }, [fechar]);

  useEffect(() => {
    if (etapa === "nome") inputRef.current?.focus();
  }, [etapa]);

  function irParaNome() {
    if (itens.length === 0) return;
    setErro(null);
    setEtapa("nome");
  }

  function confirmarNome(evento: React.FormEvent) {
    evento.preventDefault();
    if (nome.trim().length < 2) {
      setErro("Precisamos do seu nome para o pedido.");
      inputRef.current?.focus();
      return;
    }
    setErro(null);
    setFinalizadoEm(new Date());
    setEtapa("resumo");
  }

  function aoEnviar() {
    // A conversa abre com a mensagem pronta; quem envia é a pessoa.
    limpar();
    fechar();
  }

  const momento = finalizadoEm ?? new Date();
  const titulo =
    etapa === "carrinho" ? "Seu pedido" : etapa === "nome" ? "Quase lá" : `Pedido de ${nome.trim()}`;

  return (
    <Dialogo
      ref={dialogoRef}
      aria-labelledby="titulo-carrinho"
      onClick={(evento) => {
        if (evento.target === dialogoRef.current) fechar();
      }}
    >
      <Ancora>
        <Painel ref={painelRef} onClick={(evento) => evento.stopPropagation()}>
          <Topo>
            <Titulo id="titulo-carrinho">{titulo}</Titulo>
            <Fechar type="button" onClick={fechar} aria-label="Fechar carrinho">
              Fechar
            </Fechar>
          </Topo>

          {etapa === "carrinho" && (
            <>
              <Corpo>
                {itens.length === 0 ? (
                  <Vazio>
                    <p>Seu carrinho está vazio.</p>
                    <p>Escolha um doce na vitrine para começar o pedido.</p>
                  </Vazio>
                ) : (
                  <Lista>
                    {itens.map((item) => (
                      <Linha key={item.id}>
                        <NomeItem>{rotuloItem(item)}</NomeItem>
                        <Detalhe>
                          {formatarPreco(item.precoUnitario)} × {item.quantidade}
                        </Detalhe>
                        <Controles>
                          <Stepper>
                            <BotaoQtd
                              type="button"
                              onClick={() => definirQuantidade(item.id, item.quantidade - 1)}
                              aria-label={`Diminuir quantidade de ${rotuloItem(item)}`}
                            >
                              −
                            </BotaoQtd>
                            <Quantidade aria-live="polite">{item.quantidade}</Quantidade>
                            <BotaoQtd
                              type="button"
                              onClick={() => definirQuantidade(item.id, item.quantidade + 1)}
                              aria-label={`Aumentar quantidade de ${rotuloItem(item)}`}
                            >
                              +
                            </BotaoQtd>
                          </Stepper>
                          <Subtotal>{formatarPreco(subtotalItem(item))}</Subtotal>
                        </Controles>
                        <Remover
                          type="button"
                          onClick={() => remover(item.id)}
                          aria-label={`Remover ${rotuloItem(item)} do pedido`}
                        >
                          Remover
                        </Remover>
                      </Linha>
                    ))}
                  </Lista>
                )}
              </Corpo>

              <Rodape>
                {itens.length > 0 && (
                  <TotalLinha as="dl">
                    <dt>
                      Total · {totalItens} {totalItens === 1 ? "item" : "itens"}
                    </dt>
                    <dd>{formatarPreco(total)}</dd>
                  </TotalLinha>
                )}
                <Principal type="button" onClick={irParaNome} disabled={itens.length === 0}>
                  {itens.length === 0 ? "Escolha um produto" : "Finalizar pedido"}
                </Principal>
                {itens.length > 0 && (
                  <Secundario type="button" onClick={fechar}>
                    Continuar escolhendo
                  </Secundario>
                )}
              </Rodape>
            </>
          )}

          {etapa === "nome" && (
            <form onSubmit={confirmarNome} noValidate>
              <Corpo>
                <Campo>
                  <label htmlFor="nome-cliente">Como podemos te chamar?</label>
                  <input
                    id="nome-cliente"
                    ref={inputRef}
                    name="nome"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="done"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    aria-describedby={erro ? "erro-nome" : undefined}
                    aria-invalid={erro ? true : undefined}
                  />
                  {erro && <Erro id="erro-nome">{erro}</Erro>}
                </Campo>
                <Nota>
                  É só para a Patricia saber quem está pedindo. Nada é salvo no site.
                </Nota>
              </Corpo>
              <Rodape>
                <Principal type="submit">Confirmar pedido</Principal>
                <Secundario type="button" onClick={() => setEtapa("carrinho")}>
                  Voltar ao carrinho
                </Secundario>
              </Rodape>
            </form>
          )}

          {etapa === "resumo" && (
            <>
              <Corpo>
                <Nota>{formatarDataHora(momento)}</Nota>
                <ResumoLista>
                  {itens.map((item) => (
                    <li key={item.id}>
                      <span>
                        {rotuloItem(item)} × {item.quantidade}
                      </span>
                      <span>{formatarPreco(subtotalItem(item))}</span>
                    </li>
                  ))}
                </ResumoLista>
                <TotalLinha as="dl">
                  <dt>Total</dt>
                  <dd>{formatarPreco(total)}</dd>
                </TotalLinha>
                <Nota>
                  O WhatsApp abre com esse resumo já escrito. Confira a conversa e toque
                  em enviar para a Patricia receber.
                </Nota>
              </Corpo>
              <Rodape>
                <PrincipalLink
                  href={linkPedidoCompleto(whatsapp, itens, nome, momento)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={aoEnviar}
                >
                  Enviar pedido pelo WhatsApp
                </PrincipalLink>
                <Secundario type="button" onClick={() => setEtapa("carrinho")}>
                  Voltar e alterar o pedido
                </Secundario>
              </Rodape>
            </>
          )}
        </Painel>
      </Ancora>
    </Dialogo>
  );
}
