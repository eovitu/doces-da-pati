# SEO e Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ativar medição comercial e infraestrutura técnica de descoberta no endereço `https://doces-da-pati.vercel.app`, sem criar páginas de produto.

**Architecture:** Uma fonte única concentra a URL pública e alimenta Metadata API, robots, sitemap e JSON-LD. A ponte GA4 existente continua responsável por consentimento e eventos sem PII, com semântica corrigida para vitrine e origens explícitas de WhatsApp.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Next Metadata API, Google tag/GA4, Node test runner, Vercel CLI.

**Spec:** `docs/superpowers/specs/2026-09-01-seo-analytics-infrastructure-design.md`

## Global Constraints

- A URL canônica é exatamente `https://doces-da-pati.vercel.app`.
- Não criar páginas individuais de produto, checkout ou integração com Merchant Center.
- Não enviar PII ao GA4.
- `NEXT_PUBLIC_GA_ID` e `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ficam somente em Production na Vercel.
- Analytics permanece negado até consentimento; sinais de anúncios permanecem negados.
- Não inventar endereço, coordenadas ou outros fatos comerciais ausentes.
- Não adicionar dependências.

---

### Task 1: Fonte canônica e metadados verificáveis

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/site.test.ts`
- Modify: `src/app/layout.tsx`
- Modify: `.env.example`

**Interfaces:**
- Produces: `SITE_URL: URL`, `SITE_NAME: string`, `absoluteUrl(path?: string): string`.
- Consumes: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` via Metadata API.

- [ ] **Step 1: Escrever teste que fixa URL e resolução de caminhos**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { absoluteUrl, SITE_URL } from "./site";

test("mantém a origem pública canônica", () => {
  assert.equal(SITE_URL.origin, "https://doces-da-pati.vercel.app");
  assert.equal(absoluteUrl("/sitemap.xml"), "https://doces-da-pati.vercel.app/sitemap.xml");
});
```

- [ ] **Step 2: Rodar o teste e confirmar falha por módulo ausente**

Run: `npx tsx --test src/lib/site.test.ts`
Expected: FAIL porque `./site` ainda não existe.

- [ ] **Step 3: Implementar a fonte canônica mínima**

```ts
export const SITE_NAME = "Os Doces da Pati";
export const SITE_URL = new URL("https://doces-da-pati.vercel.app");

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
```

- [ ] **Step 4: Usar a fonte no layout e publicar canonical/verificação**

Definir `metadataBase: SITE_URL`, `applicationName: SITE_NAME`, `alternates.canonical: "/"`, `openGraph.url: "/"` e, apenas se houver valor, `verification.google` com o conteúdo normalizado da variável.

- [ ] **Step 5: Documentar as duas variáveis públicas**

Adicionar em `.env.example`:

```dotenv
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

- [ ] **Step 6: Rodar teste, lint e typecheck**

Run: `npx tsx --test src/lib/site.test.ts && npm run lint && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/site.ts src/lib/site.test.ts src/app/layout.tsx .env.example
git commit -m "feat(seo): add canonical metadata and site verification"
```

### Task 2: Robots, sitemap, llms.txt e dados estruturados

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/jsonld.ts`
- Create: `src/lib/jsonld.test.ts`
- Modify: `public/llms.txt`

**Interfaces:**
- Consumes: `absoluteUrl()` e `SITE_URL` de `src/lib/site.ts`.
- Produces: JSON-LD `Bakery` com `@id`, `url`, `logo` e `image` absolutos.

- [ ] **Step 1: Escrever teste dos fatos estruturados permitidos**

O teste chama `jsonLdLoja(lojaInfoSeed, produtosSeed)`, faz `JSON.parse` e exige `@type === "Bakery"`, `@id === absoluteUrl("/#business")`, URL/logo/imagem canônicas e ausência de `streetAddress`, `geo` e `openingHoursSpecification`.

- [ ] **Step 2: Rodar o teste e confirmar falha nos campos novos**

Run: `npx tsx --test src/lib/jsonld.test.ts`
Expected: FAIL por `@id`, `url`, `logo` e `image` ausentes.

- [ ] **Step 3: Implementar JSON-LD absoluto sem inventar dados**

Adicionar:

```ts
"@id": absoluteUrl("/#business"),
url: absoluteUrl(),
logo: absoluteUrl("/produtos/logo-doces-da-pati.png"),
image: absoluteUrl("/og.jpg"),
```

- [ ] **Step 4: Substituir URLs duplicadas em robots e sitemap**

`robots.ts` bloqueia `"/admin/"` e aponta para `absoluteUrl("/sitemap.xml")`. `sitemap.ts` usa `absoluteUrl()` para home, privacidade e termos, sem páginas privadas.

- [ ] **Step 5: Atualizar llms.txt com links canônicos e escopo factual**

Adicionar site oficial, catálogo, política de privacidade, termos e sitemap; manter explícito que o pedido é confirmado fora do site pelo WhatsApp.

- [ ] **Step 6: Executar testes e validação estática**

Run: `npx tsx --test src/lib/site.test.ts src/lib/jsonld.test.ts && npm run lint && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts src/lib/jsonld.ts src/lib/jsonld.test.ts public/llms.txt
git commit -m "feat(seo): strengthen discovery and local business data"
```

### Task 3: Semântica do funil GA4 e cliques no WhatsApp

**Files:**
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/ProdutoItem.tsx`
- Modify: `src/components/AdicionarAoCarrinho.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/Encomendas.tsx`
- Modify: `src/components/CarrinhoSheet.tsx`

**Interfaces:**
- Produces: `visualizarItemDaLista(produto, lista)`, `selecionarItem(produto, lista)` e `clicarWhatsapp(origem, produto?)`.
- Keeps: `adicionarAoCarrinho`, `removerDoCarrinho`, `iniciarCheckout`, `gerarLead`.

- [ ] **Step 1: Corrigir evento de impressão da vitrine**

Trocar `view_item` disparado por IntersectionObserver por `view_item_list` com `item_list_id: "vitrine"`, `item_list_name: "Vitrine principal"` e um item sem PII.

- [ ] **Step 2: Medir seleção real de produto**

Disparar `select_item` quando a pessoa inicia a ação de adicionar/consultar um produto, usando o mesmo identificador de lista.

- [ ] **Step 3: Adicionar evento tipado de saída para WhatsApp**

Implementar `click_whatsapp` com `link_origem` limitado a `cabecalho | rodape | encomendas | consulta_produto | pedido`, e opcionalmente `item_id`/`item_name`. Não enviar a URL completa do WhatsApp nem mensagem do pedido.

- [ ] **Step 4: Instrumentar todas as CTAs comerciais**

Adicionar `onClick` nos links do cabeçalho, rodapé, encomendas, consulta por produto e pedido final. No pedido final, registrar `click_whatsapp("pedido")` antes de `generate_lead`.

- [ ] **Step 5: Rodar lint, typecheck e build**

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: PASS sem erro de Client/Server Component ou tipo de evento.

- [ ] **Step 6: Commit**

```bash
git add src/lib/analytics.ts src/components/ProdutoItem.tsx src/components/AdicionarAoCarrinho.tsx src/components/SiteHeader.tsx src/components/SiteFooter.tsx src/components/Encomendas.tsx src/components/CarrinhoSheet.tsx
git commit -m "feat(analytics): measure storefront and WhatsApp funnel"
```

### Task 4: Configuração de produção e verificação completa

**Files:**
- No source files expected.

**Interfaces:**
- Consumes: Vercel project link and authenticated CLI.
- Produces: Production environment values and a deployment whose HTML exposes the expected metadata.

- [ ] **Step 1: Confirmar vínculo e autenticação da Vercel sem alterar estado**

Run: `npx vercel whoami` and inspect `.vercel/project.json` if present.
Expected: authenticated owner/team and linked project.

- [ ] **Step 2: Configurar valores somente em Production**

Set `NEXT_PUBLIC_GA_ID=G-3EYE4XXVK6` and the normalized Search Console token using Vercel environment commands scoped to Production. Do not print stored values after writing.

- [ ] **Step 3: Fazer verificação final local**

Run: `npx tsx --test src/lib/site.test.ts src/lib/jsonld.test.ts && npm run lint && npx tsc --noEmit && npm run build`
Expected: all commands exit 0.

- [ ] **Step 4: Servir o build e verificar endpoints**

Run the production server and request `/`, `/robots.txt`, `/sitemap.xml`, and `/llms.txt`. Expected: 200, canonical URL, meta verification, `/admin/` disallow, canonical sitemap URLs and factual llms content.

- [ ] **Step 5: Validar no navegador**

Abrir o deploy, aceitar cookies em uma sessão de teste e confirmar que `gtag/js?id=G-3EYE4XXVK6` é solicitado sem erros de console. Recusar em nova sessão e confirmar consentimento negado.

- [ ] **Step 6: Revisar diff e estado Git**

Run: `git diff origin/develop...HEAD --check && git status --short`
Expected: sem whitespace errors; apenas `.codex/` permanece como arquivo local não relacionado.

- [ ] **Step 7: Publicar branch e abrir PR para develop**

```bash
git push -u origin codex/seo-analytics-infrastructure
gh pr create --base develop --head codex/seo-analytics-infrastructure --title "feat(seo): configure analytics and search infrastructure" --body "## Resumo
- ativa GA4 e verificação do Search Console em produção
- consolida canonical, robots, sitemap, llms.txt e JSON-LD local
- mede o funil da vitrine e cliques de WhatsApp sem PII

## Verificação
- testes unitários
- ESLint
- TypeScript
- build de produção
- endpoints SEO e HTML publicado"
```

Expected: PR aberta com resumo, validações e ações manuais pendentes no Google.
