# Setup de infraestrutura

Passo a passo de configuração única: criar e ligar o Firebase, e publicar
o site na Vercel pela primeira vez. Depois de feito uma vez, não precisa
repetir — para o dia a dia de desenvolvimento, ver o [`README.md`](../README.md).

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
