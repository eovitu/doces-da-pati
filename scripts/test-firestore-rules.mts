import { readFileSync } from "node:fs";
import { assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

const PROJECT_ID = "demo-pati-rules";
const testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: { rules: readFileSync("firestore.rules", "utf8") },
});

type Pedido = {
  itens: Array<{
    produtoId: string;
    nome: string;
    precoUnitario: number;
    quantidade: number;
    sabor: string | null;
  }>;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  cliente: { nome: string; telefone: string };
  entrega: { tipo: "retirada" | "entrega"; bairro: string | null; endereco: string | null };
  formaPagamento: "pix" | "dinheiro" | "cartao";
  observacoes: string;
  status: "novo";
  criadoEm: Date | string;
};

function pedidoValido(quantidadeItens = 1): Pedido {
  const itens = Array.from({ length: quantidadeItens }, (_, indice) => ({
    produtoId: `produto-${indice}`,
    nome: `Produto ${indice}`,
    precoUnitario: 1000,
    quantidade: 1,
    sabor: null,
  }));
  const subtotal = quantidadeItens * 1000;
  return {
    itens,
    subtotal,
    taxaEntrega: 0,
    total: subtotal,
    cliente: { nome: "Cliente Teste", telefone: "5511999999999" },
    entrega: { tipo: "retirada", bairro: null, endereco: null },
    formaPagamento: "pix",
    observacoes: "",
    status: "novo",
    criadoEm: new Date("2026-10-07T12:00:00.000Z"),
  };
}

const anonimo = testEnv.unauthenticatedContext().firestore();
const cliente = testEnv.authenticatedContext("uid-cliente-comum").firestore();
const admin = testEnv.authenticatedContext("uid-patricia").firestore();
const resultados: { nome: string; passou: boolean; detalhe?: string }[] = [];
let numeroCaso = 0;

async function verificar(
  nome: string,
  esperado: "permitir" | "negar",
  acao: () => Promise<unknown>,
) {
  try {
    if (esperado === "permitir") await assertSucceeds(acao());
    else {
      let erro: unknown;
      try {
        await acao();
      } catch (falha) {
        erro = falha;
      }
      if (!erro) throw new Error("A operação foi permitida, mas deveria ser negada.");
      const mensagem = String(erro);
      if (mensagem.includes("maximum of 1000 expressions")) {
        throw new Error("A regra excedeu o limite de 1000 expressões; esse resultado não comprova a validação esperada.");
      }
      if ((erro as { code?: string }).code !== "permission-denied") {
        throw new Error(`A operação falhou por motivo diferente de permission-denied: ${mensagem}`);
      }
    }
    resultados.push({ nome, passou: true });
  } catch (erro) {
    resultados.push({
      nome,
      passou: false,
      detalhe: erro instanceof Error ? erro.message : String(erro),
    });
  }
}

async function criarPedido(
  db: typeof anonimo,
  pedido: unknown,
  esperado: "permitir" | "negar",
  nome: string,
) {
  numeroCaso++;
  await verificar(nome, esperado, () =>
    db.collection("pedidos").doc(`caso-${numeroCaso}`).set(pedido),
  );
}

try {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection("admins").doc("uid-patricia").set({
      nome: "Patricia",
      email: "patricia@example.test",
      criadoEm: new Date(),
    });
    await db.collection("pedidos").doc("pedido-existente").set(pedidoValido());
  });

  await criarPedido(anonimo, pedidoValido(), "permitir", "Anônimo cria pedido válido");
  await criarPedido(anonimo, pedidoValido(20), "permitir", "Anônimo cria pedido com 20 linhas");
  await criarPedido(anonimo, pedidoValido(21), "permitir", "Anônimo cria pedido com 21 linhas sem cota de aplicação");
  await criarPedido(anonimo, pedidoValido(100), "permitir", "Anônimo cria pedido com 100 linhas sem cota de aplicação");

  const itemInvalido = pedidoValido();
  itemInvalido.itens[0] = {} as Pedido["itens"][number];
  await criarPedido(anonimo, itemInvalido, "permitir", "Limitação: a regra não valida o schema de cada item");

  await criarPedido(anonimo, pedidoValido(0), "negar", "Rejeita lista de itens vazia");
  for (const indice of [10, 19]) {
    const pedido = pedidoValido(20);
    pedido.itens[indice].quantidade = 0;
    await criarPedido(anonimo, pedido, "permitir", `Limitação: item inválido na posição ${indice} não é inspecionado`);
  }

  const quantidadeLegitima = pedidoValido();
  quantidadeLegitima.itens[0].quantidade = 1_000_000;
  quantidadeLegitima.subtotal = 1_000_000_000;
  quantidadeLegitima.total = 1_000_000_000;
  await criarPedido(anonimo, quantidadeLegitima, "permitir", "Aceita quantidade positiva grande sem limitar unidades");

  const itemSemCampo = pedidoValido();
  delete (itemSemCampo.itens[0] as Partial<Pedido["itens"][number]>).sabor;
  await criarPedido(anonimo, itemSemCampo, "permitir", "Limitação: campo obrigatório de item não é verificado");

  const itemExtra = pedidoValido();
  (itemExtra.itens[0] as Pedido["itens"][number] & { uid: string }).uid = "uid-arbitrario";
  await criarPedido(anonimo, itemExtra, "permitir", "Limitação: campos extras de item não são verificados");

  for (const [nome, alteracao] of [
    ["Rejeita preço negativo", (p: Pedido) => (p.itens[0].precoUnitario = -1)],
    ["Rejeita preço fracionário", (p: Pedido) => (p.itens[0].precoUnitario = 1.5)],
    ["Rejeita quantidade fracionária", (p: Pedido) => (p.itens[0].quantidade = 1.5)],
    ["Rejeita produtoId vazio", (p: Pedido) => (p.itens[0].produtoId = "")],
    ["Rejeita nome de item vazio", (p: Pedido) => (p.itens[0].nome = "")],
    ["Rejeita sabor de tipo inválido", (p: Pedido) => ((p.itens[0] as { sabor: unknown }).sabor = 42)],
  ] as const) {
    const pedido = pedidoValido();
    alteracao(pedido);
    await criarPedido(anonimo, pedido, "permitir", `Limitação: ${nome.replace("Rejeita ", "")}`);
  }

  const itemTextoExcessivo = pedidoValido();
  itemTextoExcessivo.itens[0].nome = "n".repeat(1001);
  await criarPedido(anonimo, itemTextoExcessivo, "permitir", "Limitação: textos de item não são limitados");

  for (const [nome, alteracao] of [
    ["Rejeita total incoerente após alterar subtotal", (p: Pedido) => (p.subtotal += 1)],
    ["Rejeita subtotal fracionário", (p: Pedido) => (p.subtotal = 1000.5)],
    ["Rejeita taxa negativa", (p: Pedido) => (p.taxaEntrega = -1)],
    ["Rejeita taxa fracionária", (p: Pedido) => (p.taxaEntrega = 0.5)],
    ["Rejeita total incoerente", (p: Pedido) => (p.total += 1)],
    ["Rejeita total negativo", (p: Pedido) => (p.total = -1)],
  ] as const) {
    const pedido = pedidoValido();
    alteracao(pedido);
    await criarPedido(anonimo, pedido, "negar", nome);
  }

  const subtotalDivergenteDosItens = pedidoValido();
  subtotalDivergenteDosItens.subtotal += 1;
  subtotalDivergenteDosItens.total += 1;
  await criarPedido(anonimo, subtotalDivergenteDosItens, "permitir", "Limitação: subtotal não é comparado à soma dos itens");

  const pedidoEntrega = pedidoValido();
  pedidoEntrega.entrega = { tipo: "entrega", bairro: "Campo Limpo", endereco: "Rua Teste, 10" };
  pedidoEntrega.taxaEntrega = 500;
  pedidoEntrega.total = pedidoEntrega.subtotal + pedidoEntrega.taxaEntrega;
  await criarPedido(anonimo, pedidoEntrega, "permitir", "Permite entrega com taxa e endereço");

  const retiradaComTaxa = pedidoValido();
  retiradaComTaxa.taxaEntrega = 100;
  retiradaComTaxa.total += 100;
  await criarPedido(anonimo, retiradaComTaxa, "negar", "Rejeita taxa em retirada");

  const entregaSemEndereco = pedidoValido();
  entregaSemEndereco.entrega = { tipo: "entrega", bairro: null, endereco: null };
  await criarPedido(anonimo, entregaSemEndereco, "negar", "Rejeita entrega sem bairro e endereço");

  const entregaExtra = pedidoValido();
  (entregaExtra.entrega as Pedido["entrega"] & { uid: string }).uid = "outro";
  await criarPedido(anonimo, entregaExtra, "negar", "Rejeita campo extra na entrega");

  const entregaCampoAusente = pedidoValido();
  delete (entregaCampoAusente.entrega as Partial<Pedido["entrega"]>).endereco;
  (entregaCampoAusente.entrega as Pedido["entrega"] & { uid: string }).uid = "outro";
  await criarPedido(anonimo, entregaCampoAusente, "negar", "Rejeita campo obrigatório de entrega trocado por extra");

  const clienteSemTelefone = pedidoValido();
  delete (clienteSemTelefone.cliente as Partial<Pedido["cliente"]>).telefone;
  await criarPedido(anonimo, clienteSemTelefone, "negar", "Rejeita telefone obrigatório ausente");

  const clienteExtra = pedidoValido();
  (clienteExtra.cliente as Pedido["cliente"] & { admin: boolean }).admin = true;
  await criarPedido(anonimo, clienteExtra, "negar", "Rejeita campo extra no cliente");

  const clienteTextoExcessivo = pedidoValido();
  clienteTextoExcessivo.cliente.nome = "n".repeat(1001);
  await criarPedido(anonimo, clienteTextoExcessivo, "negar", "Rejeita nome do cliente acima de 1000 caracteres");

  const observacaoExcessiva = pedidoValido();
  observacaoExcessiva.observacoes = "x".repeat(5001);
  await criarPedido(anonimo, observacaoExcessiva, "negar", "Rejeita observação acima de 5000 caracteres");

  const observacaoInvalida = pedidoValido();
  (observacaoInvalida as { observacoes: unknown }).observacoes = null;
  await criarPedido(anonimo, observacaoInvalida, "negar", "Rejeita observação de tipo inválido");

  const timestampInvalido = pedidoValido();
  timestampInvalido.criadoEm = "2026-10-07T12:00:00Z";
  await criarPedido(anonimo, timestampInvalido, "negar", "Rejeita criadoEm que não é timestamp");

  for (const [nome, campo, valor] of [
    ["Rejeita forma de pagamento inválida", "formaPagamento", "boleto"],
    ["Rejeita status diferente de novo", "status", "confirmado"],
  ] as const) {
    const pedido = { ...pedidoValido(), [campo]: valor };
    await criarPedido(anonimo, pedido, "negar", nome);
  }

  const campoExtra = { ...pedidoValido(), campoInventado: "extra" };
  await criarPedido(anonimo, campoExtra, "negar", "Rejeita campo extra no pedido");
  const campoAusente = { ...pedidoValido() } as Partial<Pedido>;
  delete campoAusente.observacoes;
  await criarPedido(anonimo, campoAusente, "negar", "Rejeita campo obrigatório ausente no pedido");

  await verificar("Anônimo não lê pedido existente", "negar", () =>
    anonimo.collection("pedidos").doc("pedido-existente").get(),
  );
  await verificar("Anônimo não atualiza pedido existente", "negar", () =>
    anonimo.collection("pedidos").doc("pedido-existente").update({ status: "confirmado" }),
  );
  await verificar("Anônimo não apaga pedido existente", "negar", () =>
    anonimo.collection("pedidos").doc("pedido-existente").delete(),
  );
  await verificar("Usuário autenticado sem admin não lê pedido", "negar", () =>
    cliente.collection("pedidos").doc("pedido-existente").get(),
  );
  await verificar("Usuário não admin não escreve produto", "negar", () =>
    cliente.collection("produtos").doc("produto-nao-autorizado").set({ nome: "Teste" }),
  );
  await verificar("Admin lê pedidos", "permitir", () => admin.collection("pedidos").get());
  await verificar("Admin atualiza pedido", "permitir", () =>
    admin.collection("pedidos").doc("pedido-existente").update({ status: "confirmado" }),
  );
  await verificar("Admin apaga pedido", "permitir", () =>
    admin.collection("pedidos").doc("pedido-existente").delete(),
  );
  await verificar("Admin escreve produto", "permitir", () =>
    admin.collection("produtos").doc("produto-admin").set({ nome: "Teste" }),
  );
  await verificar("Admin escreve loja", "permitir", () =>
    admin.collection("loja").doc("info").set({ nome: "Os Doces da Pati" }),
  );
  await verificar("Admin escreve configuração de entrega", "permitir", () =>
    admin.collection("entrega").doc("config").set({ bairros: [] }),
  );
  await verificar("Cliente não lê documento admin de outra pessoa", "negar", () =>
    cliente.collection("admins").doc("uid-patricia").get(),
  );
  await verificar("Admin não pode criar documento admin pelo cliente", "negar", () =>
    admin.collection("admins").doc("uid-outro").set({ nome: "Não permitido" }),
  );
} finally {
  await testEnv.cleanup();
}

const falhas = resultados.filter((resultado) => !resultado.passou);
for (const resultado of resultados) {
  console.log(`${resultado.passou ? "PASS" : "FAIL"} — ${resultado.nome}`);
  if (resultado.detalhe) console.error(`  ${resultado.detalhe}`);
}
console.log(`\n${resultados.length - falhas.length}/${resultados.length} testes passaram.`);
if (falhas.length > 0) process.exitCode = 1;
