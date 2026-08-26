"use client";

import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import { LoginAdmin } from "./LoginAdmin";
import {
  BotaoSecundario,
  Cartao,
  Conteudo,
  Mensagem,
  Pagina,
  Subtitulo,
  Titulo,
} from "./ui";

/**
 * Porteiro da área administrativa.
 *
 * Esconder a interface não é segurança — quem garante que ninguém escreve no
 * banco são as Firestore/Storage Rules, que exigem admins/{uid}. O que esta
 * camada faz é decidir o que a pessoa vê, sem o flicker de mostrar o painel
 * antes de saber se ela pode entrar.
 */
function Porteiro({ children }: { children: React.ReactNode }) {
  const { estado, sair } = useAdminAuth();

  if (estado === "carregando") {
    return (
      <Pagina>
        <Conteudo>
          <Subtitulo role="status">Carregando…</Subtitulo>
        </Conteudo>
      </Pagina>
    );
  }

  if (estado === "deslogado") {
    return <LoginAdmin />;
  }

  if (estado === "sem-permissao") {
    return (
      <Pagina>
        <Conteudo>
          <Titulo>Sem acesso</Titulo>
          <Cartao>
            <Mensagem role="alert">
              Esta conta não tem permissão para administrar a loja.
            </Mensagem>
            <BotaoSecundario type="button" onClick={() => void sair()}>
              Sair
            </BotaoSecundario>
          </Cartao>
        </Conteudo>
      </Pagina>
    );
  }

  return <>{children}</>;
}

export function AreaAdmin({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <Porteiro>{children}</Porteiro>
    </AdminAuthProvider>
  );
}
