import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Produto } from "@/types/produto";
import { produtosMock } from "@/data/produtos-mock";

const USA_FIREBASE = process.env.NEXT_PUBLIC_USA_FIREBASE === "true";

/**
 * Busca os produtos da vitrine.
 *
 * Enquanto o Firebase não estiver configurado (USA_FIREBASE=false),
 * usa os dados de src/data/produtos-mock.ts — assim dá pra desenvolver
 * o layout inteiro sem depender de nada externo.
 */
export async function getProdutos(): Promise<Produto[]> {
  if (!USA_FIREBASE) {
    return produtosMock;
  }

  const snap = await getDocs(query(collection(db, "produtos"), orderBy("nome")));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Produto);
}
