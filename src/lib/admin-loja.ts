import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { EntregaConfig, LojaInfo } from "@/types/produto";

export async function salvarLojaInfo(info: LojaInfo): Promise<void> {
  await setDoc(doc(db, "loja", "info"), info, { merge: true });
}

export async function salvarEntregaConfig(config: EntregaConfig): Promise<void> {
  await setDoc(doc(db, "entrega", "config"), config, { merge: true });
}
