"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, firebaseConfigurado, getAuthClient } from "./firebase";

/**
 * Estado da sessão administrativa.
 *
 * Autenticar e autorizar são coisas diferentes: estar logado no Firebase não
 * torna ninguém administrador. Quem manda é o documento admins/{uid} no
 * Firestore — o mesmo critério usado por firestore.rules e storage.rules, e
 * criado só pelo script scripts/create-admin.mts.
 *
 * "carregando" é o estado inicial e existe para evitar o flicker de mostrar o
 * painel (ou o login) antes de saber quem está do outro lado.
 */
export type EstadoAdmin =
  | "carregando"
  | "deslogado"
  | "sem-permissao"
  | "autorizado";

interface AdminAuth {
  estado: EstadoAdmin;
  usuario: User | null;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuth | null>(null);

async function ehAdmin(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch {
    // Sem permissão de leitura ou sem rede: por segurança, não é admin.
    return false;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  // Sem as variáveis do Firebase não há sessão possível: já começa deslogado,
  // e o login trata a falha com uma mensagem compreensível.
  const [estado, setEstado] = useState<EstadoAdmin>(
    firebaseConfigurado ? "carregando" : "deslogado"
  );
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    if (!firebaseConfigurado) return;

    // Cobre login, logout e sessão expirada — o Firebase avisa nos três casos.
    return onAuthStateChanged(getAuthClient(), async (user) => {
      if (!user) {
        setUsuario(null);
        setEstado("deslogado");
        return;
      }
      const autorizado = await ehAdmin(user.uid);
      setUsuario(user);
      setEstado(autorizado ? "autorizado" : "sem-permissao");
    });
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    setEstado("carregando");
    try {
      await signInWithEmailAndPassword(getAuthClient(), email.trim(), senha);
      // O onAuthStateChanged acima resolve o estado final (autorizado ou não).
    } catch (erro) {
      setEstado("deslogado");
      throw erro;
    }
  }, []);

  const sair = useCallback(async () => {
    await signOut(getAuthClient());
  }, []);

  const valor = useMemo(
    () => ({ estado, usuario, entrar, sair }),
    [estado, usuario, entrar, sair]
  );

  return (
    <AdminAuthContext.Provider value={valor}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuth {
  const contexto = useContext(AdminAuthContext);
  if (!contexto) {
    throw new Error("useAdminAuth precisa estar dentro de <AdminAuthProvider>");
  }
  return contexto;
}
