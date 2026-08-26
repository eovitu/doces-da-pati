import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { EntregaConfig, LojaInfo } from "@/types/produto";
import { entregaConfigSeed, lojaInfoSeed } from "@/data/produtos-seed";

const USA_FIREBASE = process.env.NEXT_PUBLIC_USA_FIREBASE === "true";

/**
 * Mesmo critério de src/lib/produtos.ts: com o Firebase desligado, usa o
 * seed local; com ele ligado, o Firestore é a fonte de verdade e o seed
 * só serve para popular o banco pela primeira vez.
 */
export async function getLojaInfo(): Promise<LojaInfo> {
  if (!USA_FIREBASE) {
    return lojaInfoSeed;
  }

  const snap = await getDoc(doc(db, "loja", "info"));
  return snap.exists() ? (snap.data() as LojaInfo) : lojaInfoSeed;
}

export async function getEntregaConfig(): Promise<EntregaConfig> {
  if (!USA_FIREBASE) {
    return entregaConfigSeed;
  }

  const snap = await getDoc(doc(db, "entrega", "config"));
  return snap.exists() ? (snap.data() as EntregaConfig) : entregaConfigSeed;
}
