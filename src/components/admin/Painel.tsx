"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  BotaoSecundario,
  Cartao,
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

const NomeSecao = styled.h2`
  font-family: ${theme.typography.body};
  font-size: ${theme.fontSize.body};
`;

const Descricao = styled.p`
  margin-top: ${theme.spacing.xxs};
  font-size: ${theme.fontSize.small};
  color: ${theme.colors.inkSoft};
`;

const EmBreve = styled.span`
  display: inline-block;
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.xxs} ${theme.spacing.xs};
  font-size: ${theme.fontSize.micro};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.inkSoft};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.line};
  border-radius: ${theme.radii.pill};
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

        <Cartao>
          <NomeSecao>Produtos</NomeSecao>
          <Descricao>
            Aqui você vai poder mudar preço, descrição, foto e tirar da vitrine
            o que acabou.
          </Descricao>
          <EmBreve>Em breve</EmBreve>
        </Cartao>

        <Cartao>
          <NomeSecao>Informações da loja</NomeSecao>
          <Descricao>
            Horários, bairros de entrega, WhatsApp e recados para os clientes.
          </Descricao>
          <EmBreve>Em breve</EmBreve>
        </Cartao>
      </Conteudo>
    </Pagina>
  );
}
