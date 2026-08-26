# Os Doces da Pati

Vitrine digital da Os Doces da Pati, uma doceria de bairro na zona sul de
São Paulo: mostra os produtos com fotos e preços, e transforma isso em
pedido pelo WhatsApp — sem loja física online, sem catálogo impresso, sem
depender de rede social pra vender.

## Decisões técnicas

- **Next.js na Vercel** — deploy automático a cada push, sem servidor pra
  manter, plano gratuito (Hobby) cobre a necessidade da loja.
- **Firebase (plano Spark) como backend opcional** — Firestore guarda os
  produtos e Storage as fotos, mas o site funciona com dados de exemplo
  mesmo sem Firebase configurado; isso separa "montar o layout" de
  "configurar infraestrutura".
- **Pedido via WhatsApp, não checkout** — um link `wa.me` com mensagem
  pronta resolve o problema real (fechar o pedido) sem a complexidade de
  carrinho, gateway de pagamento ou conta de cliente.
- **Tudo gratuito por design** — a régua de custo é R$0 de infraestrutura;
  o único custo eventual é domínio próprio, e é opcional.

## Estrutura do projeto

```
src/
  app/            páginas (Next.js App Router)
  components/     componentes de UI (ex.: ProdutoCard)
  lib/            firebase.ts (init do SDK), produtos.ts (busca de dados,
                  alterna seed local/Firestore), whatsapp.ts (monta o link de pedido)
  data/           produtos-seed.ts — dados reais do catálogo, também usados
                  pelo script scripts/seed-firestore.mts
  types/          tipos TypeScript (Produto, Categoria, LojaInfo, EntregaConfig)
```

## Como rodar o projeto hoje

```bash
npm install
cp .env.example .env.local   # já vem pronto pra rodar sem Firebase
npm run dev                  # http://localhost:3000
npm run build                # build de produção
npm run lint                 # lint
```

O comportamento é controlado por `NEXT_PUBLIC_USA_FIREBASE` no `.env.local`:

- `false` (padrão) — usa os produtos reais de `src/data/produtos-seed.ts`
  direto no código. Não precisa de nenhuma configuração externa.
- `true` — busca os produtos reais na coleção `produtos` do Firestore
  (exige as variáveis `NEXT_PUBLIC_FIREBASE_*` preenchidas em `.env.local`).

## Onde encontrar o resto

- **Processo, git flow, regras de autoria, estado atual do projeto** →
  [`CLAUDE.md`](./CLAUDE.md)
- **Setup único de infraestrutura** (criar o projeto no Firebase, ativar
  Firestore/Storage, deploy inicial na Vercel) → [`docs/SETUP.md`](./docs/SETUP.md)
