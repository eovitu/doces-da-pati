/**
 * Cria (ou reaproveita) um usuário no Firebase Authentication e o
 * documento correspondente em admins/{uid} — sem esse documento as
 * Firestore Rules bloqueiam qualquer escrita, mesmo autenticada.
 *
 * Não define nem imprime senha: gera uma senha aleatória descartada na
 * hora e devolve um link de redefinição de senha pra pessoa logar com a
 * senha que ela mesma escolher.
 *
 * Uso:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npx tsx scripts/create-admin.mts <email> [nome]
 */
import { randomBytes } from "node:crypto";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error(
    "Defina GOOGLE_APPLICATION_CREDENTIALS apontando para a chave de service account do projeto doces-da-pati."
  );
}

const [email, nome] = process.argv.slice(2);
if (!email) {
  throw new Error("Uso: npx tsx scripts/create-admin.mts <email> [nome]");
}

initializeApp({ credential: cert(credentialsPath) });
const auth = getAuth();
const db = getFirestore();

async function criarAdmin() {
  const senhaTemporaria = randomBytes(24).toString("base64url");

  const usuario = await auth
    .getUserByEmail(email)
    .catch(() => auth.createUser({ email, password: senhaTemporaria, emailVerified: false }));

  await db
    .collection("admins")
    .doc(usuario.uid)
    .set({ email, nome: nome ?? email, criadoEm: new Date() }, { merge: true });

  const linkRedefinicao = await auth.generatePasswordResetLink(email);

  console.log(`Admin pronto: uid=${usuario.uid}, email=${email}`);
  console.log(`Link para definir a senha (válido por tempo limitado): ${linkRedefinicao}`);
}

criarAdmin().catch((error) => {
  console.error("Falha ao criar admin:", error);
  process.exit(1);
});
