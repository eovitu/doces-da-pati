# CLAUDE.md

Contexto do projeto pra qualquer assistente de IA (Claude Code, Cowork, ou
outro) que for trabalhar neste repositório. Leia isto antes de mexer em
qualquer coisa.

## O que é o projeto

Vitrine digital de uma pequena doceria (loja da tia do Victor). Objetivo:
mostrar produtos com fotos e preços, e receber pedidos pelo WhatsApp. Simples,
bonito, rápido, e com custo zero de infraestrutura.

**Dono do projeto:** Victor (github.com/eovitu). Ele é quem aprova decisões
de produto e escopo — nenhuma feature entra sem passar por ele.

**Cliente final:** a tia dele, dona da loja. Ela não é técnica. O formulário
de briefing (Google Forms) já foi enviado pra ela; **nenhum trabalho de
conteúdo, produto ou identidade visual avança até essas respostas voltarem.**
Enquanto isso, só segue trabalho de fundação técnica (infra, arquitetura,
processo).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Firebase** (plano Spark/gratuito): Firestore (produtos), Storage (fotos),
  Analytics. Projeto: `vitrine-doceria`.
- **Vercel** (plano Hobby/gratuito): hospedagem, deploy automático por push.
- Pedido = link `wa.me` com mensagem pronta. Sem checkout, sem gateway de
  pagamento, sem carrinho — a não ser que o briefing da cliente mude isso.
- Sem custo de infraestrutura. Único custo eventual é domínio próprio
  (opcional, decisão da cliente).

Detalhes de setup (variáveis de ambiente, comandos, Firebase CLI) estão no
`README.md`. Este arquivo é sobre **processo e regras**, não sobre "como
rodar o projeto".

## Ferramentas envolvidas — quem cuida do quê

| Área | Ferramenta |
|---|---|
| Planejamento inicial, briefing, arquitetura de alto nível | Cowork (Claude) |
| Escrita de código do dia a dia, execução no repo | Claude Code |
| Firebase (console, Gemini in Firebase) | Console do Firebase |
| Deploy / hospedagem | Vercel (via Claude Code + integração com o repo) |
| Controle de versão | GitHub — **conta é do Victor, só ele tem push real** |
| Gestão de sprints/tarefas | ClickUp |

## Regras de autoria — importante

- **Todo commit é autorado pelo Victor.** Nunca incluir `Co-Authored-By`,
  assinatura de IA, ou qualquer menção a Claude/Claude Code no commit,
  mensagem, PR ou CHANGELOG.
- Antes de commitar, confirmar que `git config user.name` / `user.email`
  estão configurados como os dele (não como um usuário de bot/CI).
- Histórico antigo com autoria errada deve ser reescrito, não deixado pra
  trás — ver seção Git Flow.

## Git Flow

Modelo padrão de mercado (Gitflow simplificado):

```
main        → sempre igual ao que está em produção (Vercel). Só recebe merge
              de release/hotfix, nunca commit direto.
develop     → integração. Toda feature termina aqui antes de ir pra main.
feature/*   → uma branch por funcionalidade/tarefa, sai de develop, volta
              pra develop via PR. Ex: feature/catalogo-produtos,
              feature/botao-whatsapp
release/*   → só quando acumular features suficientes pra uma versão nova
              em produção. Sai de develop, vira PR pra main (e volta pra
              develop). Ex: release/1.0.0
hotfix/*    → correção urgente direto em produção. Sai de main, PR pra main
              E pra develop. Ex: hotfix/link-whatsapp-quebrado
```

Regras:

- Nenhum commit direto em `main` ou `develop` — sempre via Pull Request,
  mesmo sendo só o Victor no repo (mantém histórico limpo e permite revisão
  antes de subir pra produção).
- Nome de branch: `tipo/descricao-curta-em-kebab-case`.
- PR pequeno > PR grande. Uma feature = um PR.
- Squash merge ao integrar `feature/*` em `develop` (mantém `develop` com
  histórico linear e legível).
- `main` só recebe merge de `release/*` ou `hotfix/*`, nunca de `feature/*`
  diretamente. Essa regra é de processo, não técnica — o GitHub (plano
  gratuito) não suporta restringir merge por branch de origem via proteção
  de branch, só via revisão manual antes de aprovar o PR.

`main` e `develop` estão protegidas no GitHub (PR obrigatório,
`enforce_admins` ativo, sem push direto — nem admin escapa).

### Conventional Commits

Toda mensagem de commit segue `tipo(escopo opcional): descrição curta`:

```
feat(produtos): adiciona filtro por categoria
fix(whatsapp): corrige número sem DDI no link de pedido
chore(firebase): atualiza regras do Storage
docs(readme): explica setup do Firebase CLI
refactor(produtos): extrai lógica de preço pro helper
```

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `perf`.

## ClickUp

Workspace único, espaço **Pod B** (compartilhado com outro projeto do
Victor — cuidado ao filtrar/relatar, sempre escopar por pasta/lista).

- Pasta **🧁 Doceria — Vitrine de Doces** → 3 listas de sprint (Sprint 0, 1,
  2 — datas no nome de cada lista).
- Espaço **Coordenação** → listas transversais: 🎯 Marcos & Fases,
  ⚠️ Riscos & Impedimentos, 🔄 Cerimônias & Retros.
- Fluxo de status de cada task: `backlog → scoping → ready for development →
  in design → in development → in review → testing → shipped` (ou
  `cancelled` a qualquer momento).
- Sprint 0 = fundação técnica (infra, git flow, Firebase, ClickUp, Vercel) —
  não depende do briefing da cliente.
- Sprint 1 e 2 estão com placeholder "[Bloqueado] Escopo depende do
  briefing" — só quebrar em tasks reais depois que o formulário voltar.
- Toda task nova de código deve corresponder a uma branch `feature/*` com
  nome parecido (facilita rastrear task ↔ código).

## Estado atual (25/08/2026)

- [x] Scaffold Next.js + Tailwind + TypeScript
- [x] Tipos, produtos mock, componente de card, botão de pedido via WhatsApp
- [x] `firestore.rules` / `storage.rules` escritas
- [x] Firebase CLI configurado (`.firebaserc`, `firebase.json`, script de seed)
- [x] Projeto Firebase criado no console (`vitrine-doceria`, Analytics ativo)
- [x] ClickUp configurado (sprints, workflow, coordenação)
- [ ] Ativar Firestore Database + Storage no console e rodar
      `scripts/firebase-setup.sh`
- [ ] Git flow aplicado no repositório real (reescrever histórico, criar
      `develop`, proteger `main`)
- [ ] Deploy inicial na Vercel
- [ ] Briefing da cliente respondido — **bloqueia tudo de conteúdo/produto/
      visual a partir daqui**

## O que NÃO fazer

- Não inventar produtos, preços, textos ou paleta de cores "pra ter algo" —
  espera o briefing.
- Não adicionar dependência paga ou serviço com custo sem aprovação
  explícita do Victor (a régua é R$0, salvo domínio próprio).
- Não commitar `.env.local` nem `service-account.json` — ambos no
  `.gitignore`, nunca devem ir pro git.
- Não commitar direto em `main`/`develop`.
- Não incluir menção a IA/Claude em commits, PRs ou mensagens do projeto.