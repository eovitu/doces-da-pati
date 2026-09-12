/**
 * Cria somente o Bombom de Morango no Firestore, sem substituir os demais
 * produtos ou as configurações da loja.
 *
 * Execute depois que a imagem estiver publicada em produção:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run seed:bombom-de-morango
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { produtosSeed } from "../src/data/produtos-seed";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error(
    "Defina GOOGLE_APPLICATION_CREDENTIALS apontando para a chave de service account do projeto doces-da-pati."
  );
}

initializeApp({ credential: cert(credentialsPath) });

async function adicionarProduto() {
  const produto = produtosSeed.find(({ slug }) => slug === "bombom-de-morango");
  if (!produto) {
    throw new Error("Bombom de Morango não foi encontrado em produtosSeed.");
  }

  const db = getFirestore();
  const produtoRef = db.collection("produtos").doc(produto.slug);
  const produtoExistente = await produtoRef.get();

  if (produtoExistente.exists) {
    console.log("Bombom de Morango já existe no Firestore; nenhuma alteração foi feita.");
    return;
  }

  const dados = { ...produto };
  Reflect.deleteProperty(dados, "slug");
  await produtoRef.create(dados);
  console.log("Bombom de Morango criado no Firestore.");
}

adicionarProduto().catch((error) => {
  console.error("Falha ao criar o Bombom de Morango no Firestore:", error);
  process.exit(1);
});
