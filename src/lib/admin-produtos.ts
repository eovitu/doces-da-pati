import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Produto } from "@/types/produto";

/**
 * Lê todos os produtos (inclusive inativos) direto do Firestore, para o
 * painel administrativo — diferente de getProdutos(), que só devolve os
 * ativos para a vitrine pública.
 */
export async function listarTodosProdutos(): Promise<Produto[]> {
  const snap = await getDocs(query(collection(db, "produtos"), orderBy("ordem")));
  return snap.docs.map((d) => ({ slug: d.id, ...d.data() }) as Produto);
}

export function gerarSlug(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos após a normalização
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Grava um produto no Firestore. O documento é identificado pelo slug —
 * criar e editar usam a mesma função (merge: true preserva campos que o
 * formulário do admin não conhece).
 */
export async function salvarProduto(produto: Produto): Promise<void> {
  const { slug, ...dados } = produto;
  await setDoc(
    doc(db, "produtos", slug),
    { ...dados, atualizadoEm: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Soft delete: o produto some da vitrine (getProdutos filtra por ativo),
 * mas o documento continua no Firestore. Nada é apagado de verdade.
 */
export async function arquivarProduto(slug: string): Promise<void> {
  await setDoc(doc(db, "produtos", slug), { ativo: false }, { merge: true });
}

export async function reordenarProdutos(
  slugsNaNovaOrdem: string[]
): Promise<void> {
  await Promise.all(
    slugsNaNovaOrdem.map((slug, ordem) =>
      setDoc(doc(db, "produtos", slug), { ordem }, { merge: true })
    )
  );
}
