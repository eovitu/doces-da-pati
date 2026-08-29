# CLAUDE.md

Contexto completo do projeto para qualquer assistente de IA que trabalhe neste
repositório. **Leia este arquivo inteiro antes de escrever qualquer código.**
O modelo de dados detalhado está em [`docs/ESPECIFICACAO.md`](docs/ESPECIFICACAO.md).

---

## 1. O que é

Vitrine digital da **Os Doces da Pati**, uma doceria de bairro na zona sul de
São Paulo. O site mostra os produtos com foto e preço, o cliente monta o
pedido e finaliza pelo WhatsApp. Sem checkout, sem pagamento online.

**Victor** (github.com/eovitu) é o dono do projeto e quem aprova qualquer
decisão de escopo. **Patricia** é a cliente, dona da loja — não é técnica.
O briefing dela já foi respondido; as respostas estão refletidas aqui.

---

## 2. Stack

- **Next.js 16** (App Router) + TypeScript
- **styled-components** (com SSR configurado via `src/lib/registry.tsx`)
- **GSAP + Lenis** para scroll suave e animações de entrada
- **Firebase** plano Spark/gratuito: Firestore (dados), Auth (só a Patricia)
- **Vercel** plano Hobby: hospedagem, deploy automático a cada push em `main`
- Projeto Firebase e repositório: `doces-da-pati`
- URL: `doces-da-pati.vercel.app`

**Não há Tailwind neste projeto** — foi removido deliberadamente na migração
para styled-components. Não reintroduzir.

**Custo é R$0.** Nenhuma dependência paga, nenhum serviço com cobrança, sem
domínio próprio (a Patricia escolheu o endereço gratuito). Qualquer coisa que
gere custo precisa de aprovação explícita do Victor.
### Firebase MCP

O servidor MCP do Firebase está instalado no Claude Code. Use-o para **ler e
verificar**: conferir se documentos foram gravados corretamente, inspecionar
o schema real, depurar regras de segurança.

**Não use MCP para mutar o banco.** Popular dados, publicar regras e alterar
estrutura continuam pelos scripts versionados (`scripts/seed-firestore.mts`,
`firebase deploy`). Não há ambiente de staging — este Firestore é produção, e
toda mudança nele precisa estar no git para ser reproduzível e revisável.

---

## 3. Dados reais da loja

| Campo | Valor |
|---|---|
| Nome | Os Doces da Pati |
| Responsável | Patricia |
| WhatsApp | `5511986092770` (Business) |
| Instagram | https://www.instagram.com/osdocesdapati |
| Região | São Paulo, zona sul |
| Retirada | Parque Regina |
| Horário de atendimento | 12h às 22h, de terça a domingo |
| Horário de entrega | 18h às 22h |
| Bairros atendidos | Campo Limpo, Vila Andrade, Parque Araribá, Jardim Inga, Jardim Olinda |
| Taxa de entrega | Varia por região — **valores ainda pendentes** |
| Pagamentos | Pix e cartão (maquininha) |

História: começou vendendo pão de mel há 9 anos como renda extra, parou, e
retomou há cerca de 2 anos. Diferencial que ela mesma aponta: qualidade dos
produtos, preço justo e atendimento humanizado. Clientes são majoritariamente
jovens, quase todos acessando pelo celular.

### Produtos

Preços em **centavos** no banco (`1500` = R$ 15,00).

| Produto | slug | Preço |
|---|---|---|
| Espetinho de morango | `espetinho-de-morango` | 1500 |
| Espetinho de bombom de morango | `espetinho-de-bombom-de-morango` | 1800 |
| Espetinho de uva | `espetinho-de-uva` | 1200 |
| Pão de mel | `pao-de-mel` | 1000 |
| Bombom de morango no pote | `bombom-de-morango-no-pote` | 1800 |
| Bombom de uva no pote | `bombom-de-uva-no-pote` | 1800 |
| Lanche natural | `lanche-natural` | 1200 |
| Suco natural 250ml | `suco-natural` | 700 |
| Morango cravejado | `morango-cravejado` | 1500 |

Descrições e sabores completos estão em [`docs/PRODUTOS.md`](docs/PRODUTOS.md).

**Encomendas para festinha** (brigadeiros e pão de mel) existem, mas são sob
consulta, sem preço. Tratar como uma chamada à parte no fim da página levando
ao WhatsApp — nunca como um card de produto com preço zerado.

### Fotos

As 8 fotos estão em `public/produtos/<slug>.webp`, 1024×1024, ~350 KB no
total. São referenciadas por caminho relativo. O modelo de dados também aceita
URL absoluta, para quando a Patricia subir fotos próprias pelo admin.

---

## 4. Decisões de escopo — e por quê

Estas decisões foram tomadas com o Victor. **Não reabrir sem falar com ele.**

**Sem pagamento online.** A Patricia pediu, mas exige gateway e backend
server-side, o que quebra a régua de custo zero e multiplica o escopo. Fica
para uma v2. O meio-termo aprovado: mostrar a chave Pix e o QR Code no site.

**Sem login ou cadastro de cliente.** Sem pagamento no site, uma conta não
entrega nada — só cria atrito antes do pedido. A confirmação acontece na
conversa do WhatsApp.

**Carrinho no site, pedido no WhatsApp.** O cliente monta o pedido no site
(produtos, quantidades, entrega, forma de pagamento), o pedido é gravado no
Firestore, e então abre o WhatsApp com a mensagem pronta para a Patricia
confirmar.

**Sem categorias na vitrine por enquanto.** São 8 produtos; dividir só cria
cliques a mais. O modelo de dados e o admin já suportam categorias, e a
vitrine passa a exibi-las sozinha quando ela criar alguma.

**Estoque é contador manual.** O pedido acontece no WhatsApp, então o site não
tem como decrementar estoque sozinho. O que ele faz é marcar o produto como
indisponível quando o contador chega a zero. Nunca prometer "controle
automático de estoque".

**Fora do MVP porque ela marcou "não preciso":** busca, filtros, galeria da
loja, cupons, avaliações, newsletter, formulário de contato.

### Pendências com a Patricia

Preços de frete por bairro, texto sobre a loja, informações de conservação,
CNPJ ou nome da empresa. Enquanto não chegam, esses campos ficam vazios e a
interface trata a ausência com elegância — nunca exibir "R$ 0,00" ou um campo
vazio cru.

---

## 5. Direção visual

Referência dada pelo Victor: **resident.co.nz** — editorial, contido, muita
respiração, fotografia dominando a página, grid assimétrico. O pedido é essa
mesma qualidade e rigor, com o calor de uma doceria e não a frieza de uma loja
de mobiliário.

- **Cores da marca:** rosa e branco. Rosa como acento com intenção, não rosa
  em tudo. Fundo off-white **quente** (nunca `#ffffff` puro, que endurece a
  página). Texto em marrom bem escuro em vez de preto puro — combina com o
  assunto e suaviza o contraste sem perder legibilidade. Contraste mínimo AA
  (4.5:1) em texto: rosa claro sobre branco não passa, então o rosa dos botões
  precisa ser fechado o suficiente.
- **Tipografia:** duas famílias com papéis distintos. Uma display com
  personalidade real para títulos e nomes de produto — uma serifada moderna
  funciona bem para comida artesanal. Uma sans limpa para o corpo. Evitar
  Inter e Space Grotesk como fonte de destaque.
- **Layout:** mobile-first de verdade (ela confirmou que os clientes usam
  celular), mas o desktop não pode ser a versão esticada — precisa aproveitar
  o espaço com imagens maiores e grid mais generoso. Produto grande: a foto é
  o argumento de venda, não a descrição.
- **Movimento:** Lenis + GSAP já instalados e funcionando. Reveals discretos,
  micro-interação sutil no hover das imagens. `prefers-reduced-motion` já é
  respeitado — manter. Menos é mais; animação demais é o que faz um site
  parecer template.

O que ela pediu com as próprias palavras: *"uma vitrine com os produtos, fotos
e preços, nada complicado, coisa simples e objetiva que facilite a finalização
do pedido"*. E o que faria ela achar que ficou certo: *"organização e
clareza"*.

---

## 6. Regras de autoria

- **Todo commit é autorado pelo Victor.** Nunca incluir `Co-Authored-By`,
  assinatura de IA, ou qualquer menção a Claude em commit, mensagem de PR,
  changelog ou comentário de código.
- Confirmar `git config user.name` / `user.email` antes de commitar.

---

## 7. Git flow

```
main        → igual ao que está em produção. Só recebe merge de release/hotfix.
develop     → integração. Toda feature termina aqui antes de ir pra main.
feature/*   → sai de develop, volta via PR. Ex: feature/catalogo-real
release/*   → sai de develop, PR para main. Ex: release/1.0.0
hotfix/*    → sai de main, PR para main E para develop.
```

- Nenhum commit direto em `main` ou `develop` — sempre via Pull Request.
  Ambas estão protegidas no GitHub com `enforce_admins` ativo.
- Squash merge ao integrar `feature/*` em `develop`.
- `main` só recebe `release/*` ou `hotfix/*`. Regra de processo — o GitHub no
  plano gratuito não bloqueia isso tecnicamente.
- PR pequeno é melhor que PR grande. Uma feature, um PR.
- Existe template em `.github/PULL_REQUEST_TEMPLATE.md`. Preencher.

### Conventional Commits

`tipo(escopo): descrição curta` — tipos: `feat`, `fix`, `chore`, `docs`,
`refactor`, `style`, `test`, `perf`.

```
feat(carrinho): monta mensagem de pedido para o WhatsApp
fix(whatsapp): corrige número sem DDI no link
chore(firebase): atualiza regras do Firestore
```

---

## 8. ClickUp

Workspace `90171496922`, espaço "Vitrine Doceria" (`90177083723`).

- Pasta **🧁 Doceria — Vitrine de Doces** → Sprint 0, 1 e 2
- Listas transversais: 🎯 Marcos & Fases, ⚠️ Riscos & Impedimentos,
  🔄 Cerimônias & Retros
- Status: `to do` → `in progress` → `complete`
- Toda task de código deve ter uma branch `feature/*` de nome equivalente.

---

## 9. Estado atual

- [x] Scaffold Next.js + TypeScript
- [x] styled-components com SSR, GSAP + Lenis, `prefers-reduced-motion`
- [x] Git flow aplicado: `main`/`develop` protegidas, template de PR
- [x] Deploy na Vercel funcionando
- [x] Projeto Firebase `doces-da-pati` criado (plano Spark)
- [x] Briefing da cliente respondido
- [x] Regras do Firestore e Storage escritas para o modelo completo
- [x] Fotos dos 8 produtos em `public/produtos/`
- [ ] Renomeação `vitrine-doceria` → `doces-da-pati` no código
- [ ] Dados reais no lugar dos dados de exemplo
- [ ] Firestore ativado e populado
- [x] Redesign da vitrine
- [x] Carrinho + geração da mensagem de WhatsApp
- [ ] Área administrativa

---

## 10. O que NÃO fazer

- Não inventar produtos, preços, textos ou promoções que a Patricia não
  informou. O que falta está listado como pendência — deixar vazio e tratar
  bem a ausência é melhor que inventar.
- Não reintroduzir Tailwind.
- Não adicionar dependência paga ou serviço com custo sem aprovação do Victor.
- Não commitar `.env.local` nem `service-account.json`.
- Não commitar direto em `main` ou `develop`.
- Não incluir menção a IA em commits, PRs ou mensagens do projeto.
- Não implementar pagamento online, login de cliente, busca, filtros, cupons
  ou avaliações — todos fora do escopo por decisão registrada acima.