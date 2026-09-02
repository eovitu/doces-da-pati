# SEO e Analytics — Design da infraestrutura imediata

## Contexto

Os Doces da Pati usa `https://doces-da-pati.vercel.app` como endereço público e não terá domínio próprio nesta etapa. O site já possui uma ponte de eventos GA4, Consent Mode, `robots.ts`, `sitemap.ts`, `llms.txt` e JSON-LD básico, mas o Analytics não recebe dados porque o identificador não está configurado no ambiente de produção e a propriedade do Google Search Console ainda não foi verificada.

## Objetivo

Tornar o site verificável e observável sem alterar o catálogo ou criar páginas de produto: configurar GA4 e Search Console, consolidar a URL canônica, melhorar os artefatos de descoberta e medir as ações de WhatsApp que representam intenção comercial.

## Escopo aprovado

- Usar `https://doces-da-pati.vercel.app` como URL canônica única.
- Configurar o GA4 `G-3EYE4XXVK6` somente em produção.
- Publicar a meta tag do Search Console com o token informado pelo proprietário. O conteúdo da tag usa apenas o valor após `google-site-verification=`.
- Manter o Consent Mode v2: Analytics negado até consentimento e todos os sinais de anúncios sempre negados.
- Não enviar nome, telefone, endereço, mensagem ou outro dado pessoal ao GA4.
- Medir a vitrine, o funil do carrinho e cliques de contato no WhatsApp com origem da chamada.
- Gerar metadados canônicos, Open Graph, Twitter, `robots.txt`, `sitemap.xml`, `llms.txt` e JSON-LD coerentes com os fatos existentes.
- Configurar variáveis na Vercel quando a CLI já estiver autenticada e vinculada ao projeto.
- Validar build, lint, endpoints SEO, HTML publicado e ausência de erros relevantes no navegador.

## Fora do escopo

- Domínio próprio.
- Páginas individuais de produto.
- Checkout ou pagamento online.
- Google Merchant Center e feed de produtos.
- Google Ads, remarketing e personalização de anúncios.
- Alteração visual ampla do site.
- Inventar endereço de rua, coordenadas, horários estruturados ou dados comerciais que não estejam confirmados no modelo atual.

## Arquitetura

### Fonte única da URL pública

Um módulo pequeno em `src/lib/site.ts` expõe `SITE_URL`, `SITE_NAME` e um helper para URLs absolutas. Layout, sitemap, robots, JSON-LD e documentação para crawlers consomem a mesma origem para impedir divergências.

### Metadados e verificação

O layout raiz usa a Metadata API do Next.js 16 para definir `metadataBase`, canonical, application name, Open Graph, Twitter e `verification.google`. A verificação é lida de `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`; por ser uma meta tag pública, não é um segredo, mas permanece configurável por ambiente.

### Analytics e consentimento

O carregamento atual com `next/script` é preservado. `NEXT_PUBLIC_GA_ID` habilita a coleta somente em builds de produção. A camada tipada passa a registrar:

- `view_item_list` para a exibição da vitrine, no lugar de tratar cada card como página de produto;
- `select_item` quando a pessoa interage com um produto;
- `add_to_cart`, `remove_from_cart` e `begin_checkout` para o carrinho;
- `click_whatsapp` com `link_origem` para contatos do cabeçalho, rodapé, encomendas e consultas de produto;
- `generate_lead` apenas quando a pessoa abre o WhatsApp com o pedido montado.

Os eventos continuam sem PII. `generate_lead` representa oportunidade comercial, não compra confirmada.

### Descoberta e dados estruturados

`robots.ts` libera conteúdo público, bloqueia `/admin/` e referencia o sitemap canônico. `sitemap.ts` lista somente a home e as páginas legais. O JSON-LD `Bakery` recebe `@id`, `url`, `logo` e `image` absolutos, mantendo apenas endereço amplo e área atendida já confirmados. `llms.txt` ganha URL canônica, links úteis e uma declaração clara de que pedidos são concluídos no WhatsApp.

## Configuração externa

Na Vercel, `NEXT_PUBLIC_GA_ID` e `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` serão definidas apenas em Production. Depois do deploy, o proprietário deverá concluir ações nas interfaces do Google: verificar a propriedade URL-prefix, enviar `/sitemap.xml`, solicitar indexação da home, marcar `generate_lead` como evento principal e vincular Search Console ao GA4. Essas ações dependem das permissões da conta Google e não serão simuladas por código.

## Verificação

- Testes unitários das URLs canônicas e do JSON-LD.
- ESLint e build de produção.
- Inspeção de `/`, `/robots.txt`, `/sitemap.xml` e `/llms.txt` localmente.
- Inspeção do HTML para canonical e meta de verificação.
- Validação do deploy publicado e checagem de console/network no navegador.

## Riscos e mitigação

- **Dados de teste no GA4:** variáveis apenas em Production; desenvolvimento continua sem coleta.
- **Medição bloqueada:** comportamento esperado até a pessoa aceitar cookies.
- **Verificação perdida:** a meta tag permanece no layout e a variável fica documentada.
- **Promessa de SEO indevida:** robots, sitemap e `llms.txt` facilitam descoberta, mas não garantem posição nem vendas.
- **Dados estruturados inválidos:** não serão publicados produtos individuais nem fatos comerciais ausentes.
