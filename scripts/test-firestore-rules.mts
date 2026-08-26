/**
 * Testa firestore.rules contra o emulador (nunca contra produção).
 *
 * Uso: firebase emulators:exec --only firestore "npx tsx scripts/test-firestore-rules.mts"
 */
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

const PEDIDO_VALIDO = {
  itens: [{ produtoId: "pao-de-mel", nome: "Pão de mel", precoUnitario: 1000, quantidade: 2, sabor: "Ninho" }],
  subtotal: 2000,
  taxaEntrega: 0,
  total: 2000,
  cliente: { nome: "Cliente Teste", telefone: "5511999999999" },
  entrega: { tipo: "retirada", bairro: null, endereco: null },
  formaPagamento: "pix",
  observacoes: "",
  status: "novo",
  criadoEm: new Date(),
};

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId: "doces-da-pati-rules-test",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });

  const resultados: { teste: string; passou: boolean }[] = [];
  async function testar(nome: string, esperativa: "succeed" | "fail", acao: () => Promise<unknown>) {
    try {
      if (esperativa === "succeed") await assertSucceeds(acao());
      else await assertFails(acao());
      resultados.push({ teste: nome, passou: true });
    } catch {
      resultados.push({ teste: nome, passou: false });
    }
  }

  const anonimo = testEnv.unauthenticatedContext().firestore();
  const semAdmin = testEnv.authenticatedContext("uid-cliente-comum").firestore();
  const admin = testEnv.authenticatedContext("uid-patricia").firestore();

  // admins/uid-patricia precisa existir SEM passar pelas rules (setup de teste)
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().collection("admins").doc("uid-patricia").set({
      nome: "Patricia",
      email: "patricia@teste.com",
      criadoEm: new Date(),
    });
  });

  await testar("Anônimo escreve produtos", "fail", () =>
    anonimo.collection("produtos").doc("teste").set({ nome: "x" })
  );

  await testar("Anônimo escreve loja/info", "fail", () =>
    anonimo.collection("loja").doc("info").set({ nome: "x" })
  );

  await testar("Anônimo cria pedido válido", "succeed", () =>
    anonimo.collection("pedidos").add(PEDIDO_VALIDO)
  );

  await testar("Pedido com campo extra é rejeitado", "fail", () =>
    anonimo.collection("pedidos").add({ ...PEDIDO_VALIDO, campoInventado: "hack" })
  );

  await testar("Pedido com total negativo é rejeitado", "fail", () =>
    anonimo.collection("pedidos").add({ ...PEDIDO_VALIDO, total: -100 })
  );

  await testar("Pedido com itens vazio é rejeitado", "fail", () =>
    anonimo.collection("pedidos").add({ ...PEDIDO_VALIDO, itens: [] })
  );

  await testar("Pedido com status diferente de 'novo' é rejeitado", "fail", () =>
    anonimo.collection("pedidos").add({ ...PEDIDO_VALIDO, status: "confirmado" })
  );

  await testar("Pedido com forma de pagamento inválida é rejeitado", "fail", () =>
    anonimo.collection("pedidos").add({ ...PEDIDO_VALIDO, formaPagamento: "boleto" })
  );

  await testar("Anônimo lê pedidos (deve falhar)", "fail", () =>
    anonimo.collection("pedidos").doc("qualquer").get({ source: "server" }).then((s) => {
      if (!s.exists) throw new Error("Firestore Rules: precisa negar leitura, não so retornar vazio");
    })
  );

  await testar("Usuário autenticado sem admins/{uid} escreve produtos", "fail", () =>
    semAdmin.collection("produtos").doc("teste").set({ nome: "x" })
  );

  await testar("Usuário sem admins/{uid} lê admins/outro-uid", "fail", () =>
    semAdmin.collection("admins").doc("uid-patricia").get({ source: "server" })
  );

  await testar("Admin (admins/{uid} existe) escreve produtos", "succeed", () =>
    admin.collection("produtos").doc("teste-admin").set({ nome: "x", ativo: true, ordem: 0, controlaEstoque: false, preco: 100, imagens: [] })
  );

  await testar("Admin lê pedidos", "succeed", () => admin.collection("pedidos").limit(1).get());

  await testEnv.cleanup();

  console.log("\n=== RESULTADO DOS TESTES DE FIRESTORE RULES (emulador) ===");
  let falhas = 0;
  for (const r of resultados) {
    console.log(`${r.passou ? "PASS" : "FAIL"} — ${r.teste}`);
    if (!r.passou) falhas++;
  }
  console.log(`\n${resultados.length - falhas}/${resultados.length} passaram.`);
  if (falhas > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
