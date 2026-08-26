"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useAdminAuth } from "@/lib/admin-auth";
import { ProdutosAdmin } from "./ProdutosAdmin";
import { LojaAdmin } from "./LojaAdmin";
import {
  BotaoSecundario,
  Conteudo,
  Pagina,
  Subtitulo,
  Titulo,
} from "./ui";

const Topo = styled.header`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  align-items: flex-start;
  justify-content: space-between;
`;

export function Painel() {
  const { usuario, sair } = useAdminAuth();

  return (
    <Pagina>
      <Conteudo>
        <Topo>
          <div>
            <Titulo>Minha loja</Titulo>
            <Subtitulo>{usuario?.email}</Subtitulo>
          </div>
          <BotaoSecundario type="button" onClick={() => void sair()}>
            Sair
          </BotaoSecundario>
        </Topo>

        <ProdutosAdmin />
        <LojaAdmin />
      </Conteudo>
    </Pagina>
  );
}
