/**
 * Popula o Firestore com o catálogo, os dados da loja e a configuração de
 * entrega. Fonte de verdade: src/data/produtos-seed.ts.
 *
 * Uso:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run seed
 *
 * A chave de service account nunca é commitada (ver .gitignore).
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { produtosSeed, lojaInfoSeed, entregaConfigSeed } from "../src/data/produtos-seed";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error(
    "Defina GOOGLE_APPLICATION_CREDENTIALS apontando para a chave de service account do projeto doces-da-pati."
  );
}

initializeApp({ credential: cert(credentialsPath) });
const db = getFirestore();

async function seed() {
  const batch = db.batch();

  for (const produto of produtosSeed) {
    const { slug, ...dados } = produto;
    batch.set(db.collection("produtos").doc(slug), dados);
  }

  batch.set(db.collection("loja").doc("info"), lojaInfoSeed);
  batch.set(db.collection("entrega").doc("config"), entregaConfigSeed);

  await batch.commit();
  console.log(`Seed concluído: ${produtosSeed.length} produtos, loja/info e entrega/config.`);
}

seed().catch((error) => {
  console.error("Falha ao popular o Firestore:", error);
  process.exit(1);
});
