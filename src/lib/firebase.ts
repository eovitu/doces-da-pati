import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Todas as chaves vêm de variáveis de ambiente (.env.local).
// Chaves do Firebase Web SDK NÃO são secretas por natureza — a segurança real
// vem das Firestore/Storage Rules, não de esconder essas variáveis.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita reinicializar o app em hot-reload / múltiplos imports
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ignoreUndefinedProperties: o admin monta objetos com campos opcionais
// (descrição, estoque) que ficam `undefined` quando vazios — sem isso o
// Firestore rejeita o setDoc inteiro em vez de simplesmente omitir o campo.
// initializeFirestore só pode rodar uma vez por app — em hot-reload ele
// estoura "already been called", e nesse caso a instância já configurada
// é reaproveitada via getFirestore.
export const db = (() => {
  try {
    return initializeFirestore(firebaseApp, { ignoreUndefinedProperties: true });
  } catch {
    return getFirestore(firebaseApp);
  }
})();
export const storage = getStorage(firebaseApp);

// Auth só é usado na área administrativa (a vitrine pública não pede login).
// Fica atrás de uma função porque getAuth() estoura na hora se as variáveis
// do Firebase não estiverem definidas — o que quebraria até o build da
// vitrine pública, que não precisa de Auth para nada.
export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export function getAuthClient() {
  return getAuth(firebaseApp);
}
