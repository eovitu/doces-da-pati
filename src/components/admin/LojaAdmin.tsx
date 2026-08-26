"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { salvarEntregaConfig, salvarLojaInfo } from "@/lib/admin-loja";
import { EntregaConfig, LojaInfo } from "@/types/produto";
import { lojaInfoSeed, entregaConfigSeed } from "@/data/produtos-seed";
import { theme } from "@/styles/theme";
import {
  Botao,
  Campo,
  Cartao,
  Input,
  LinhaCheckbox,
  Mensagem,
  Rotulo,
  Textarea,
} from "./ui";

const FORMAS_PAGAMENTO = [
  { valor: "pix", rotulo: "Pix" },
  { valor: "dinheiro", rotulo: "Dinheiro" },
  { valor: "cartao", rotulo: "Cartão" },
];

export function LojaAdmin() {
  const [info, setInfo] = useState<LojaInfo | null>(null);
  const [bairros, setBairros] = useState<string>("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    Promise.all([
      getDoc(doc(db, "loja", "info")),
      getDoc(doc(db, "entrega", "config")),
    ])
      .then(([snapLoja, snapEntrega]) => {
        if (cancelado) return;
        setInfo(snapLoja.exists() ? (snapLoja.data() as LojaInfo) : lojaInfoSeed);
        const entrega = snapEntrega.exists()
          ? (snapEntrega.data() as EntregaConfig)
          : entregaConfigSeed;
        setBairros(entrega.bairros.map((b) => b.nome).join(", "));
      })
      .catch(() => {
        if (!cancelado) setErro("Não foi possível carregar os dados da loja.");
      });
    return () => {
      cancelado = true;
    };
  }, []);

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!info) return;
    setErro(null);
    setMensagem(null);
    setSalvando(true);
    try {
      await salvarLojaInfo(info);
      await salvarEntregaConfig({
        bairros: bairros
          .split(",")
          .map((nome) => nome.trim())
          .filter(Boolean)
          .map((nome) => ({ nome, taxa: 0 })),
      });
      setMensagem("Informações da loja atualizadas.");
    } catch {
      setErro("Não foi possível salvar. Tente de novo em instantes.");
    } finally {
      setSalvando(false);
    }
  }

  function alternarPagamento(valor: string, marcado: boolean) {
    if (!info) return;
    const atual = new Set(info.formasPagamento);
    if (marcado) atual.add(valor);
    else atual.delete(valor);
    setInfo({ ...info, formasPagamento: [...atual] });
  }

  if (!info) {
    return (
      <Cartao>
        <p>Carregando…</p>
      </Cartao>
    );
  }

  return (
    <Cartao>
      <h2>Informações da loja</h2>

      {erro && <Mensagem role="alert">{erro}</Mensagem>}
      {mensagem && <Mensagem role="status">{mensagem}</Mensagem>}

      <form onSubmit={salvar}>
        <Campo>
          <Rotulo htmlFor="loja-nome">Nome da loja</Rotulo>
          <Input
            id="loja-nome"
            required
            value={info.nome}
            onChange={(e) => setInfo({ ...info, nome: e.target.value })}
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-sobre">Texto institucional</Rotulo>
          <Textarea
            id="loja-sobre"
            value={info.sobre ?? ""}
            onChange={(e) => setInfo({ ...info, sobre: e.target.value })}
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-regiao">Cidade/região</Rotulo>
          <Input
            id="loja-regiao"
            value={info.regiao}
            onChange={(e) => setInfo({ ...info, regiao: e.target.value })}
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-horario-atendimento">
            Horário e dias de atendimento
          </Rotulo>
          <Input
            id="loja-horario-atendimento"
            placeholder="12h às 22h, de terça a domingo"
            value={info.horarioAtendimento}
            onChange={(e) =>
              setInfo({ ...info, horarioAtendimento: e.target.value })
            }
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-horario-entrega">Horário de entrega</Rotulo>
          <Input
            id="loja-horario-entrega"
            value={info.horarioEntrega}
            onChange={(e) =>
              setInfo({ ...info, horarioEntrega: e.target.value })
            }
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-retirada">Endereço de retirada</Rotulo>
          <Input
            id="loja-retirada"
            value={info.retirada}
            onChange={(e) => setInfo({ ...info, retirada: e.target.value })}
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-bairros">Bairros atendidos (separados por vírgula)</Rotulo>
          <Input
            id="loja-bairros"
            value={bairros}
            onChange={(e) => setBairros(e.target.value)}
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-whatsapp">WhatsApp (com DDI, só dígitos)</Rotulo>
          <Input
            id="loja-whatsapp"
            inputMode="numeric"
            value={info.whatsapp}
            onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
          />
        </Campo>

        <Campo>
          <Rotulo htmlFor="loja-instagram">Instagram</Rotulo>
          <Input
            id="loja-instagram"
            value={info.instagram ?? ""}
            onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
          />
        </Campo>

        <Campo>
          <Rotulo>Formas de pagamento</Rotulo>
          {FORMAS_PAGAMENTO.map((forma) => (
            <LinhaCheckbox key={forma.valor}>
              <input
                type="checkbox"
                checked={info.formasPagamento.includes(forma.valor)}
                onChange={(e) => alternarPagamento(forma.valor, e.target.checked)}
              />
              {forma.rotulo}
            </LinhaCheckbox>
          ))}
        </Campo>

        <Campo>
          <LinhaCheckbox>
            <input
              type="checkbox"
              checked={info.avisoTemporario?.ativo ?? false}
              onChange={(e) =>
                setInfo({
                  ...info,
                  avisoTemporario: {
                    ativo: e.target.checked,
                    mensagem: info.avisoTemporario?.mensagem ?? "",
                  },
                })
              }
            />
            Mostrar aviso temporário no topo do site
          </LinhaCheckbox>
        </Campo>

        {info.avisoTemporario?.ativo && (
          <Campo>
            <Rotulo htmlFor="loja-aviso">Texto do aviso</Rotulo>
            <Input
              id="loja-aviso"
              placeholder="Ex.: Fechado nesta semana"
              value={info.avisoTemporario?.mensagem ?? ""}
              onChange={(e) =>
                setInfo({
                  ...info,
                  avisoTemporario: { ativo: true, mensagem: e.target.value },
                })
              }
            />
          </Campo>
        )}

        <Botao type="submit" disabled={salvando} style={{ marginTop: theme.spacing.sm }}>
          {salvando ? "Salvando…" : "Salvar informações"}
        </Botao>
      </form>
    </Cartao>
  );
}
