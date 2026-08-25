import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Produto } from "@/types/produto";
import { produtosSeed } from "@/data/produtos-seed";

const USA_FIREBASE = process.env.NEXT_PUBLIC_USA_FIREBASE === "true";

/**
 * Busca os produtos ativos da vitrine, na ordem definida pela Patricia.
 *
 * Enquanto o Firebase não estiver configurado (USA_FIREBASE=false),
 * usa src/data/produtos-seed.ts — os mesmos dados que o script de seed
 * grava no Firestore.
 */
export async function getProdutos(): Promise<Produto[]> {
  if (!USA_FIREBASE) {
    return produtosSeed.filter((produto) => produto.ativo);
  }

  const snap = await getDocs(
    query(collection(db, "produtos"), orderBy("ordem"))
  );
  return snap.docs
    .map((doc) => ({ slug: doc.id, ...doc.data() }) as Produto)
    .filter((produto) => produto.ativo);
}
