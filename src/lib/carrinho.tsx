"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Produto } from "@/types/produto";
import { ItemCarrinho, idItem, novoItem, subtotalItem } from "@/types/carrinho";

// Carrinho vive só no cliente: nada de Firestore, nada de backend. O
// localStorage existe apenas para o pedido sobreviver a um recarregamento
// acidental — se não estiver disponível, o carrinho continua funcionando
// normalmente em memória.
const CHAVE = "doces-da-pati:carrinho";

type Acao =
  | { tipo: "adicionar"; produto: Produto; sabor?: string; quantidade: number }
  | { tipo: "definirQuantidade"; id: string; quantidade: number }
  | { tipo: "remover"; id: string }
  | { tipo: "limpar" }
  | { tipo: "restaurar"; itens: ItemCarrinho[] };

function reducer(itens: ItemCarrinho[], acao: Acao): ItemCarrinho[] {
  switch (acao.tipo) {
    case "adicionar": {
      const id = idItem(acao.produto.slug, acao.sabor);
      const existente = itens.find((item) => item.id === id);
      if (existente) {
        return itens.map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade + acao.quantidade }
            : item
        );
      }
      return [...itens, novoItem(acao.produto, acao.sabor, acao.quantidade)];
    }
    case "definirQuantidade":
      if (acao.quantidade < 1) {
        return itens.filter((item) => item.id !== acao.id);
      }
      return itens.map((item) =>
        item.id === acao.id ? { ...item, quantidade: acao.quantidade } : item
      );
    case "remover":
      return itens.filter((item) => item.id !== acao.id);
    case "limpar":
      return [];
    case "restaurar":
      return acao.itens;
  }
}

interface CarrinhoContexto {
  itens: ItemCarrinho[];
  totalItens: number;
  total: number;
  adicionar: (produto: Produto, sabor?: string, quantidade?: number) => void;
  definirQuantidade: (id: string, quantidade: number) => void;
  remover: (id: string) => void;
  limpar: () => void;
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
  /** id da última linha alterada — usado só para o feedback visual */
  ultimoAdicionado: string | null;
}

const Contexto = createContext<CarrinhoContexto | null>(null);

function ehItemValido(valor: unknown): valor is ItemCarrinho {
  if (typeof valor !== "object" || valor === null) return false;
  const item = valor as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.produtoSlug === "string" &&
    typeof item.nome === "string" &&
    typeof item.precoUnitario === "number" &&
    typeof item.quantidade === "number" &&
    item.quantidade > 0 &&
    (item.sabor === undefined || typeof item.sabor === "string")
  );
}

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, dispatch] = useReducer(reducer, []);
  const [aberto, setAberto] = useState(false);
  const [ultimoAdicionado, setUltimoAdicionado] = useState<string | null>(null);
  // Não grava na passada de montagem: nela `itens` ainda é a lista vazia
  // inicial e sobrescreveria o que acabou de ser lido do localStorage.
  const montando = useRef(true);

  // Hidrata depois da montagem para o HTML do servidor e o do cliente baterem.
  useEffect(() => {
    try {
      const bruto = window.localStorage.getItem(CHAVE);
      if (bruto) {
        const salvos: unknown = JSON.parse(bruto);
        if (Array.isArray(salvos)) {
          dispatch({ tipo: "restaurar", itens: salvos.filter(ehItemValido) });
        }
      }
    } catch {
      // localStorage indisponível (aba anônima, storage bloqueado): segue em memória
    }
  }, []);

  useEffect(() => {
    if (montando.current) {
      montando.current = false;
      return;
    }
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      // idem
    }
  }, [itens]);

  const adicionar = useCallback(
    (produto: Produto, sabor?: string, quantidade = 1) => {
      dispatch({ tipo: "adicionar", produto, sabor, quantidade });
      setUltimoAdicionado(idItem(produto.slug, sabor));
    },
    []
  );

  const definirQuantidade = useCallback((id: string, quantidade: number) => {
    dispatch({ tipo: "definirQuantidade", id, quantidade });
  }, []);

  const remover = useCallback((id: string) => {
    dispatch({ tipo: "remover", id });
  }, []);

  const limpar = useCallback(() => dispatch({ tipo: "limpar" }), []);
  const abrir = useCallback(() => setAberto(true), []);
  const fechar = useCallback(() => setAberto(false), []);

  const valor = useMemo<CarrinhoContexto>(() => {
    return {
      itens,
      totalItens: itens.reduce((soma, item) => soma + item.quantidade, 0),
      total: itens.reduce((soma, item) => soma + subtotalItem(item), 0),
      adicionar,
      definirQuantidade,
      remover,
      limpar,
      aberto,
      abrir,
      fechar,
      ultimoAdicionado,
    };
  }, [itens, adicionar, definirQuantidade, remover, limpar, aberto, abrir, fechar, ultimoAdicionado]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrinho(): CarrinhoContexto {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  }
  return contexto;
}
