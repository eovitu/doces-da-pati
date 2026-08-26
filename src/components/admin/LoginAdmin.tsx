"use client";

import { useId, useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { firebaseConfigurado } from "@/lib/firebase";
import { MENSAGEM_CONFIG, mensagemDeErroDeLogin } from "@/lib/erros-auth";
import {
  Botao,
  Campo,
  Cartao,
  Conteudo,
  Input,
  Mensagem,
  Pagina,
  Rotulo,
  Subtitulo,
  Titulo,
} from "./ui";

export function LoginAdmin() {
  const { entrar } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const idEmail = useId();
  const idSenha = useId();
  const idErro = useId();

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch (falha) {
      setErro(mensagemDeErroDeLogin(falha));
      setEnviando(false);
    }
  }

  return (
    <Pagina>
      <Conteudo>
        <Titulo>Entrar</Titulo>
        <Subtitulo>Área da Patricia — Os Doces da Pati.</Subtitulo>

        <Cartao>
          <form onSubmit={aoEnviar} noValidate>
            {!firebaseConfigurado && (
              <Mensagem role="alert">{MENSAGEM_CONFIG}</Mensagem>
            )}
            {erro && (
              <Mensagem id={idErro} role="alert">
                {erro}
              </Mensagem>
            )}

            <Campo>
              <Rotulo htmlFor={idEmail}>Email</Rotulo>
              <Input
                id={idEmail}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                required
                autoFocus
                value={email}
                disabled={enviando}
                aria-describedby={erro ? idErro : undefined}
                onChange={(evento) => setEmail(evento.target.value)}
              />
            </Campo>

            <Campo>
              <Rotulo htmlFor={idSenha}>Senha</Rotulo>
              <Input
                id={idSenha}
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                disabled={enviando}
                aria-describedby={erro ? idErro : undefined}
                onChange={(evento) => setSenha(evento.target.value)}
              />
            </Campo>

            <Botao
              type="submit"
              disabled={enviando || !email || !senha || !firebaseConfigurado}
            >
              {enviando ? "Entrando…" : "Entrar"}
            </Botao>
          </form>
        </Cartao>
      </Conteudo>
    </Pagina>
  );
}
