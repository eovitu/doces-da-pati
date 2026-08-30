"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { theme, media } from "@/styles/theme";
import { Produto } from "@/types/produto";
import {
  gerarSlug,
  listarTodosProdutos,
  reordenarProdutos,
  salvarProduto,
} from "@/lib/admin-produtos";
import {
  BotaoIcone,
  Botao,
  BotaoSecundario,
  Campo,
  Cartao,
  Input,
  LinhaCheckbox,
  Mensagem,
  Rotulo,
  Textarea,
} from "./ui";

const Lista = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const LinhaProduto = styled.li<{ $inativo: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.sm};
  opacity: ${(p) => (p.$inativo ? 0.55 : 1)};
  max-width: 100%;
  overflow-wrap: anywhere;

  ${media.tablet} {
    flex-direction: row;
    align-items: center;
  }
`;

const InfoProduto = styled.div`
  flex: 1;
  min-width: 0;
`;

const NomeProduto = styled.p`
  font-size: ${theme.fontSize.small};
  font-weight: 600;
`;

const DetalheProduto = styled.p`
  font-size: ${theme.fontSize.micro};
  color: ${theme.colors.inkSoft};
`;

const Acoes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.xxs};

  ${media.tablet} {
    flex-shrink: 0;
  }
`;

const Grade = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  ${`@media (min-width: ${theme.breakpoints.tablet})`} {
    grid-template-columns: 1fr 1fr;
  }
`;

function formatarCentavos(centavos: number): string {
  return (centavos / 100).toFixed(2).replace(".", ",");
}

function paraCentavos(valorReais: string): number {
  const normalizado = valorReais.replace(/\./g, "").replace(",", ".");
  const numero = Number.parseFloat(normalizado);
  return Number.isFinite(numero) ? Math.round(numero * 100) : 0;
}

interface FormularioProduto {
  slugOriginal: string | null;
  nome: string;
  descricao: string;
  preco: string;
  imagemUrl: string;
  sabores: string;
  controlaEstoque: boolean;
  estoque: string;
  estoquePorSabor: Record<string, string>;
  precoAdicionalPorSabor: Record<string, string>;
  ativo: boolean;
  destaque: boolean;
}

function listaDeSabores(saboresTexto: string): string[] {
  return saboresTexto
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function produtoParaFormulario(produto: Produto): FormularioProduto {
  const estoquePorSabor: Record<string, string> = {};
  const precoAdicionalPorSabor: Record<string, string> = {};
  for (const sabor of produto.sabores ?? []) {
    const quantidade = produto.estoquePorSabor?.[sabor];
    if (quantidade !== undefined) estoquePorSabor[sabor] = String(quantidade);
    const adicional = produto.precoAdicionalPorSabor?.[sabor];
    if (adicional) precoAdicionalPorSabor[sabor] = formatarCentavos(adicional);
  }
  return {
    slugOriginal: produto.slug,
    nome: produto.nome,
    descricao: produto.descricao ?? "",
    preco: formatarCentavos(produto.preco),
    imagemUrl: produto.imagens[0]?.url ?? "",
    sabores: (produto.sabores ?? []).join(", "),
    controlaEstoque: produto.controlaEstoque,
    estoque: produto.estoque != null ? String(produto.estoque) : "",
    estoquePorSabor,
    precoAdicionalPorSabor,
    ativo: produto.ativo,
    destaque: produto.destaque ?? false,
  };
}

const FORMULARIO_VAZIO: FormularioProduto = {
  slugOriginal: null,
  nome: "",
  descricao: "",
  preco: "",
  imagemUrl: "",
  sabores: "",
  controlaEstoque: false,
  estoque: "",
  estoquePorSabor: {},
  precoAdicionalPorSabor: {},
  ativo: true,
  destaque: false,
};

export function ProdutosAdmin() {
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [formulario, setFormulario] = useState<FormularioProduto | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function recarregar() {
    setProdutos(await listarTodosProdutos());
  }

  useEffect(() => {
    let cancelado = false;
    listarTodosProdutos()
      .then((dados) => {
        if (!cancelado) setProdutos(dados);
      })
      .catch(() => {
        if (!cancelado) setErro("Não foi possível carregar os produtos.");
      });
    return () => {
      cancelado = true;
    };
  }, []);

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!formulario) return;
    setErro(null);

    const slug = formulario.slugOriginal ?? gerarSlug(formulario.nome);
    if (!slug) {
      setErro("Dê um nome ao produto antes de salvar.");
      return;
    }

    const existente = produtos?.find((p) => p.slug === slug);
    const sabores = listaDeSabores(formulario.sabores);
    const temSabores = sabores.length > 0;

    const estoquePorSabor: Record<string, number> = {};
    if (formulario.controlaEstoque && temSabores) {
      for (const s of sabores) {
        const valor = formulario.estoquePorSabor[s];
        if (valor !== undefined && valor !== "") {
          estoquePorSabor[s] = Number.parseInt(valor, 10);
        }
      }
    }

    const precoAdicionalPorSabor: Record<string, number> = {};
    if (temSabores) {
      for (const s of sabores) {
        const valor = formulario.precoAdicionalPorSabor[s];
        if (valor !== undefined && valor.trim() !== "") {
          precoAdicionalPorSabor[s] = paraCentavos(valor);
        }
      }
    }

    const produto: Produto = {
      slug,
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim() || undefined,
      preco: paraCentavos(formulario.preco),
      imagens: formulario.imagemUrl.trim()
        ? [{ url: formulario.imagemUrl.trim() }]
        : [],
      ativo: formulario.ativo,
      ordem: existente?.ordem ?? produtos?.length ?? 0,
      controlaEstoque: formulario.controlaEstoque,
      estoque:
        formulario.controlaEstoque && !temSabores && formulario.estoque !== ""
          ? Number.parseInt(formulario.estoque, 10)
          : undefined,
      estoquePorSabor:
        formulario.controlaEstoque && temSabores ? estoquePorSabor : undefined,
      precoAdicionalPorSabor: temSabores ? precoAdicionalPorSabor : undefined,
      sabores,
      destaque: formulario.destaque,
    };

    setSalvando(true);
    try {
      await salvarProduto(produto);
      setFormulario(null);
      await recarregar();
    } catch {
      setErro("Não foi possível salvar. Tente de novo em instantes.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(produto: Produto) {
    setErro(null);
    try {
      await salvarProduto({ ...produto, ativo: !produto.ativo });
      await recarregar();
    } catch {
      setErro("Não foi possível atualizar o produto.");
    }
  }

  async function mover(indice: number, direcao: -1 | 1) {
    if (!produtos) return;
    const alvo = indice + direcao;
    if (alvo < 0 || alvo >= produtos.length) return;
    const copia = [...produtos];
    [copia[indice], copia[alvo]] = [copia[alvo], copia[indice]];
    setProdutos(copia);
    try {
      await reordenarProdutos(copia.map((p) => p.slug));
    } catch {
      setErro("Não foi possível reordenar. Tente de novo.");
      await recarregar();
    }
  }

  return (
    <Cartao>
      <NomeProduto as="h2">Produtos</NomeProduto>

      {erro && <Mensagem role="alert">{erro}</Mensagem>}

      {produtos === null && <DetalheProduto>Carregando…</DetalheProduto>}

      {produtos && (
        <Lista>
          {produtos.map((produto, indice) => (
            <LinhaProduto key={produto.slug} $inativo={!produto.ativo}>
              <InfoProduto>
                <NomeProduto>{produto.nome}</NomeProduto>
                <DetalheProduto>
                  {formatarCentavos(produto.preco)}
                  {produto.controlaEstoque &&
                    produto.sabores?.length &&
                    ` · estoque: ${produto.sabores
                      .map((s) => `${s} (${produto.estoquePorSabor?.[s] ?? "livre"})`)
                      .join(", ")}`}
                  {produto.controlaEstoque &&
                    !produto.sabores?.length &&
                    ` · estoque: ${produto.estoque ?? 0}`}
                  {!produto.ativo && " · fora da vitrine"}
                  {produto.destaque && " · destaque"}
                </DetalheProduto>
              </InfoProduto>
              <Acoes>
                <BotaoIcone
                  type="button"
                  aria-label="Mover para cima"
                  disabled={indice === 0}
                  onClick={() => mover(indice, -1)}
                >
                  ↑
                </BotaoIcone>
                <BotaoIcone
                  type="button"
                  aria-label="Mover para baixo"
                  disabled={indice === produtos.length - 1}
                  onClick={() => mover(indice, 1)}
                >
                  ↓
                </BotaoIcone>
                <BotaoIcone
                  type="button"
                  onClick={() => setFormulario(produtoParaFormulario(produto))}
                >
                  Editar
                </BotaoIcone>
                <BotaoIcone type="button" onClick={() => alternarAtivo(produto)}>
                  {produto.ativo ? "Tirar da vitrine" : "Voltar à vitrine"}
                </BotaoIcone>
              </Acoes>
            </LinhaProduto>
          ))}
        </Lista>
      )}

      {formulario ? (
        <form onSubmit={salvar} style={{ marginTop: theme.spacing.md }}>
          <Grade>
            <Campo>
              <Rotulo htmlFor="produto-nome">Nome</Rotulo>
              <Input
                id="produto-nome"
                required
                value={formulario.nome}
                onChange={(e) =>
                  setFormulario({ ...formulario, nome: e.target.value })
                }
              />
            </Campo>
            <Campo>
              <Rotulo htmlFor="produto-preco">Preço (R$)</Rotulo>
              <Input
                id="produto-preco"
                inputMode="decimal"
                placeholder="0,00"
                value={formulario.preco}
                onChange={(e) =>
                  setFormulario({ ...formulario, preco: e.target.value })
                }
              />
            </Campo>
          </Grade>

          <Campo>
            <Rotulo htmlFor="produto-descricao">Descrição</Rotulo>
            <Textarea
              id="produto-descricao"
              value={formulario.descricao}
              onChange={(e) =>
                setFormulario({ ...formulario, descricao: e.target.value })
              }
            />
          </Campo>

          <Campo>
            <Rotulo htmlFor="produto-imagem">Foto (caminho ou URL)</Rotulo>
            <Input
              id="produto-imagem"
              placeholder="/produtos/exemplo.webp"
              value={formulario.imagemUrl}
              onChange={(e) =>
                setFormulario({ ...formulario, imagemUrl: e.target.value })
              }
            />
          </Campo>

          <Campo>
            <Rotulo htmlFor="produto-sabores">Sabores (separados por vírgula)</Rotulo>
            <Input
              id="produto-sabores"
              value={formulario.sabores}
              onChange={(e) =>
                setFormulario({ ...formulario, sabores: e.target.value })
              }
            />
          </Campo>

          {listaDeSabores(formulario.sabores).length > 0 && (
            <Campo>
              <Rotulo>Acréscimo de preço por sabor (opcional)</Rotulo>
              {listaDeSabores(formulario.sabores).map((s) => (
                <Grade key={s} style={{ alignItems: "center", marginTop: theme.spacing.xxs }}>
                  <DetalheProduto>{s}</DetalheProduto>
                  <Input
                    inputMode="decimal"
                    placeholder="0,00"
                    value={formulario.precoAdicionalPorSabor[s] ?? ""}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        precoAdicionalPorSabor: {
                          ...formulario.precoAdicionalPorSabor,
                          [s]: e.target.value,
                        },
                      })
                    }
                  />
                </Grade>
              ))}
            </Campo>
          )}

          <Campo>
            <LinhaCheckbox>
              <input
                type="checkbox"
                checked={formulario.destaque}
                onChange={(e) =>
                  setFormulario({ ...formulario, destaque: e.target.checked })
                }
              />
              Exibir nos destaques
            </LinhaCheckbox>
          </Campo>

          <Campo>
            <LinhaCheckbox>
              <input
                type="checkbox"
                checked={formulario.controlaEstoque}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    controlaEstoque: e.target.checked,
                  })
                }
              />
              Controlar estoque
            </LinhaCheckbox>
          </Campo>

          {formulario.controlaEstoque && listaDeSabores(formulario.sabores).length > 0 && (
            <Campo>
              <Rotulo>Quantidade em estoque por sabor</Rotulo>
              {listaDeSabores(formulario.sabores).map((s) => (
                <Grade key={s} style={{ alignItems: "center", marginTop: theme.spacing.xxs }}>
                  <DetalheProduto>{s}</DetalheProduto>
                  <Input
                    type="number"
                    min={0}
                    placeholder="livre (sem controle)"
                    value={formulario.estoquePorSabor[s] ?? ""}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        estoquePorSabor: {
                          ...formulario.estoquePorSabor,
                          [s]: e.target.value,
                        },
                      })
                    }
                  />
                </Grade>
              ))}
            </Campo>
          )}

          {formulario.controlaEstoque && listaDeSabores(formulario.sabores).length === 0 && (
            <Campo>
              <Rotulo htmlFor="produto-estoque">Quantidade em estoque</Rotulo>
              <Input
                id="produto-estoque"
                type="number"
                min={0}
                value={formulario.estoque}
                onChange={(e) =>
                  setFormulario({ ...formulario, estoque: e.target.value })
                }
              />
            </Campo>
          )}

          <Campo>
            <LinhaCheckbox>
              <input
                type="checkbox"
                checked={formulario.ativo}
                onChange={(e) =>
                  setFormulario({ ...formulario, ativo: e.target.checked })
                }
              />
              Aparece na vitrine
            </LinhaCheckbox>
          </Campo>

          <div style={{ display: "flex", gap: theme.spacing.sm }}>
            <Botao type="submit" disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar produto"}
            </Botao>
            <BotaoSecundario type="button" onClick={() => setFormulario(null)}>
              Cancelar
            </BotaoSecundario>
          </div>
        </form>
      ) : (
        <Botao
          type="button"
          style={{ marginTop: theme.spacing.md }}
          onClick={() => setFormulario(FORMULARIO_VAZIO)}
        >
          Adicionar produto
        </Botao>
      )}
    </Cartao>
  );
}
