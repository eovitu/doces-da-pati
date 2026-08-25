# Vitrine de doces

Site simples pra mostrar os produtos da loja e receber pedidos pelo WhatsApp.
Feito em Next.js, hospedado grátis na Vercel, com Firebase como backend
(opcional no começo — o site já funciona com dados de exemplo).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Firebase**: Firestore (produtos) + Storage (fotos) — plano gratuito (Spark)
- **Vercel**: hospedagem e deploy automático a cada push
- Pedido = link `wa.me` com mensagem pronta, sem checkout nem gateway de pagamento

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # já vem pronto pra rodar sem Firebase
npm run dev
```

Abre em `http://localhost:3000`. Com `NEXT_PUBLIC_USA_FIREBASE=false` (padrão),
o site usa os produtos de exemplo em `src/data/produtos-mock.ts` — dá pra
mexer no layout sem precisar configurar nada externo ainda.

## Estrutura

```
src/
  app/            páginas (App Router)
  components/     componentes de UI (ProdutoCard, etc.)
  data/           dados de exemplo (produtos-mock.ts)
  lib/            firebase.ts, produtos.ts (busca de dados), whatsapp.ts
  types/          tipos TypeScript (Produto, LojaInfo)
firestore.rules    regras de segurança do Firestore
storage.rules       regras de segurança do Storage (fotos)
```

## Colocando o Firebase pra valer

1. Criar o projeto em https://console.firebase.google.com (plano Spark, gratuito).
2. Ativar **Firestore Database** (modo produção) e **Storage**.
3. Em *Configurações do projeto > Geral > Seus apps*, criar um app Web e copiar
   as chaves para `.env.local` (usar `.env.example` como base).
4. Trocar `NEXT_PUBLIC_USA_FIREBASE` para `true`.
5. Publicar as regras (`firestore.rules` e `storage.rules`) pelo Console ou via
   Firebase CLI (`firebase deploy --only firestore:rules,storage:rules`).
6. Criar a coleção `produtos` no Firestore com os campos do tipo `Produto`
   (ver `src/types/produto.ts`).
7. (Opcional, área administrativa) Ativar **Authentication > Email/senha** e
   criar um usuário pra sua tia logar e editar os produtos.

## Deploy na Vercel

1. Subir este repositório pro GitHub (ver seção abaixo).
2. Em https://vercel.com, "Add New Project" → importar o repositório.
3. Adicionar as mesmas variáveis de `.env.local` em
   *Project Settings > Environment Variables*.
4. Deploy. A cada push na branch principal, a Vercel publica automaticamente.
5. (Opcional) Domínio próprio em *Project Settings > Domains* — tem custo
   anual de registro, mas o *.vercel.app* já vem incluso de graça.

## Subindo pro GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/doce-vitrine.git
git branch -M main
git push -u origin main
```

## Custos

Tudo isso roda no plano gratuito: Vercel Hobby, Firebase Spark, `*.vercel.app`.
O único custo eventual é um domínio próprio (`www.suamarca.com.br`), se a
loja quiser um endereço personalizado — e isso é opcional.
