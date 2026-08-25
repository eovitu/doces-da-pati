# Especificação técnica — Os Doces da Pati

Documento derivado do briefing respondido pela cliente (25/08/2026). É a
fonte de verdade sobre modelo de dados, escopo e direção visual. Regras de
processo e git flow continuam no [`CLAUDE.md`](../CLAUDE.md).

---

## 1. Dados reais da loja

Substituem os dados de exemplo de `src/data/produtos-mock.ts`.

| Campo | Valor |
|---|---|
| Nome da loja | Os Doces da Pati |
| Responsável | Patricia |
| WhatsApp | `5511986092770` (Business) |
| Instagram | https://www.instagram.com/osdocesdapati |
| Região | São Paulo — zona sul |
| Retirada | Parque Regina |
| Horário | 12h às 22h, todos os dias |
| Entrega | 18h às 22h |
| Bairros atendidos | Campo Limpo, Vila Andrade, Parque Araribá, Jardim Inga, Jardim Olinda |
| Taxa de entrega | Varia por região — **valores pendentes** |
| Pagamentos aceitos | Pix, Cartão (maquininha) |
| Produtos | Pão de mel, Bombom no pote, Espetinho de morango |
| Preços | **Pendentes** — ela não informou nenhum |
| Cores da marca | Rosa e branco |
| Estilo | Moderno |
| Referência dela | https://linklist.ai/juduarteconfeitaria ("catálogo simples e direto") |

**Pendências com a Patricia:** preços dos produtos, valores de frete por
bairro, fotos dos produtos, descrições, texto sobre a loja, informações de
conservação, CNPJ/nome da empresa.

Enquanto não chegam, esses campos ficam vazios/zerados no banco e a
interface trata a ausência com elegância (ver §6).

---

## 2. Escopo

### Dentro do MVP

- Catálogo de produtos com fotos, descrição, sabores e preço
- Carrinho client-side (sem login, sem persistência entre sessões)
- Finalização: cliente informa dados → pedido é salvo → abre WhatsApp com
  mensagem pronta
- Cálculo de frete por bairro (tabela fixa, sem API de mapas)
- Área administrativa completa para a Patricia (§5)
- Aviso temporário no topo do site (único recurso de "promoção" que ela quis)

### Fora do MVP — decidido conscientemente

- **Pagamento online.** Ela pediu, mas exige gateway + backend server-side, o
  que quebra a régua de custo zero e multiplica o escopo. Fica para uma v2.
  O Victor explica a ela.
- **Login/cadastro de cliente.** Sem pagamento no site, uma conta de cliente
  não entrega nada — só adiciona atrito antes do pedido. A confirmação
  acontece na conversa do WhatsApp, como já é hoje.
- Busca, filtros, galeria da loja, cupons, avaliações, newsletter — ela
  marcou explicitamente "não preciso".
- Domínio próprio: ela escolheu o endereço gratuito.

---

## 3. Modelo de dados (Firestore)

Convenção: valores monetários em **centavos** (`number` inteiro). Evita erro
de ponto flutuante e formatação inconsistente. `1450` = R$ 14,00.

### `loja/info` — documento único

```ts
{
  nome: string;                 // "Os Doces da Pati"
  responsavel: string;          // "Patricia"
  whatsapp: string;             // "5511986092770" — só dígitos, com DDI
  instagram: string;
  cidade: string;
  horarios: string;
  descricaoCurta: string;       // frase do topo do site
  sobre: string;                // história da loja
  infoConservacao: string;      // ela pediu isso explicitamente
  identificacaoEmpresa: string; // CNPJ ou nome — ela pediu
  pagamentosAceitos: string[];  // ["pix", "cartao"]
  avisoTemporario: {
    ativo: boolean;
    texto: string;              // ex: "Fechado nesta semana"
  };
  atualizadoEm: Timestamp;
}
```

### `categorias/{categoriaId}`

Ela não usa categorias hoje, mas marcou como "gostaria de ter". O modelo já
suporta; a vitrine só exibe a divisão quando existir mais de uma categoria
ativa — com 3 produtos, nada muda visualmente.

```ts
{
  nome: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}
```

### `produtos/{produtoId}`

```ts
{
  nome: string;
  slug: string;                 // único — usado na URL /produto/[slug]
  descricao: string;
  categoriaId: string | null;
  preco: number;                // centavos. 0 = preço ainda não definido
  precoVariavel: boolean;       // exibe "a partir de"
  sabores: string[];            // vazio se não aplica
  imagens: Array<{
    url: string;
    path: string;               // caminho no Storage, para poder deletar
    alt: string;
    largura: number;
    altura: number;
  }>;                           // ordem do array = ordem de exibição, [0] = capa
  disponivel: boolean;          // toggle manual — "acabou hoje"
  controlaEstoque: boolean;
  estoque: number | null;       // só relevante se controlaEstoque
  destaque: boolean;
  ordem: number;                // ordenação manual na vitrine
  ativo: boolean;               // soft delete — nada é apagado de verdade
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}
```

**Sobre estoque — importante ser honesto:** o pedido acontece no WhatsApp, não
no site. Então o site **não tem como decrementar estoque sozinho** — não existe
confirmação de compra dentro dele. `estoque` é um contador manual que a
Patricia ajusta no admin. O que o site faz é: quando `estoque` chega a 0,
marcar o produto como indisponível automaticamente na vitrine. Não prometer
"controle de estoque automático" pra ela.

### `pedidos/{pedidoId}`

```ts
{
  itens: Array<{
    produtoId: string;
    nome: string;               // snapshot — preço/nome podem mudar depois
    precoUnitario: number;      // centavos, no momento do pedido
    quantidade: number;
    sabor: string | null;
  }>;
  subtotal: number;             // centavos
  taxaEntrega: number;          // centavos, 0 se retirada
  total: number;                // centavos
  cliente: {
    nome: string;
    telefone: string;
  };
  entrega: {
    tipo: "retirada" | "entrega";
    bairro: string | null;
    endereco: string | null;
  };
  formaPagamento: "pix" | "dinheiro" | "cartao";
  observacoes: string;
  status: "novo" | "confirmado" | "entregue" | "cancelado";
  criadoEm: Timestamp;
}
```

O pedido é gravado **antes** de abrir o WhatsApp. Assim ela vê no admin tudo
que foi montado no site, mesmo que o cliente feche a janela sem enviar a
mensagem.

### `admins/{uid}` — controle de acesso

```ts
{ nome: string; email: string; criadoEm: Timestamp; }
```

Existir um documento aqui = pode escrever. Mais correto do que confiar só em
`request.auth != null`, e não custa nada.

### `entrega/config` — documento único

```ts
{
  bairros: Array<{ nome: string; taxa: number }>;  // taxa em centavos
  horarioEntrega: string;                          // "18h às 22h"
  retirada: {
    disponivel: boolean;
    endereco: string;                              // "Parque Regina"
    horario: string;
  };
  atualizadoEm: Timestamp;
}
```

### Índices

Nada composto por enquanto — o catálogo é pequeno e as consultas são simples
(`where ativo == true`, `orderBy ordem`). Se o Firestore reclamar de índice em
alguma query, criar sob demanda pelo link que ele mesmo fornece no erro.

---

## 4. Segurança

### Firestore Rules

```
- loja, categorias, produtos, entrega  → leitura pública, escrita só admin
- pedidos                              → CREATE público (com validação
                                          rígida), leitura/edição só admin
- admins                               → leitura só do próprio doc, escrita
                                          nunca pelo cliente (só pelo console)
```

**Atenção ao `create` público em `pedidos`.** É necessário (o cliente não está
autenticado), mas uma regra permissiva demais deixa qualquer um escrever
documentos arbitrários no banco. Mitigações obrigatórias:

1. Validar a forma do documento na própria rule: campos esperados presentes,
   tipos corretos, `status == "novo"`, `total` coerente com os itens, limite
   de tamanho nos textos.
2. Ativar **Firebase App Check** (gratuito, com reCAPTCHA v3) — garante que a
   escrita veio do site de verdade, não de um script.

Sem isso, o custo é abuso de cota, não vazamento de dado sensível — mas
melhor resolver de saída.

### Auth

Firebase Authentication, e-mail/senha, **um único usuário** (Patricia). Ela
respondeu "1 pessoa" na pergunta sobre quantos acessos. Sem cadastro aberto —
o usuário é criado à mão no console.

---

## 5. Área administrativa

Rota `/admin`, protegida. Pensada para alguém que se vira bem com celular mas
não é técnica — cada tela resolve uma coisa, sem jargão.

### Login
- E-mail e senha, com "esqueci minha senha"
- Redireciona para o painel; rota protegida no client e nas rules

### Painel inicial
- Quantos produtos ativos, quantos indisponíveis, quais com estoque baixo
- Últimos pedidos recebidos
- Atalho para o que ela mais usa: marcar produto como esgotado

### Produtos
- Listar, criar, editar, arquivar (soft delete via `ativo`)
- **Reordenar por arraste** — é assim que ela controla o que aparece primeiro
- Duplicar produto (útil para variações)
- Toggle rápido de disponível/esgotado direto na lista, sem abrir a edição
- Campos: nome, descrição, categoria, preço, preço variável, sabores,
  destaque, controle de estoque

### Imagens
- Upload de múltiplas imagens por produto
- Reordenar; a primeira é a capa
- Remover (apaga também do Storage, usando o `path` salvo)
- **Compressão obrigatória no navegador antes do upload** (ver §7)

### Categorias
- CRUD + ordenação. Opcional — a vitrine funciona sem nenhuma.

### Pedidos
- Lista com os detalhes de cada pedido
- Mudar status: novo → confirmado → entregue (ou cancelado)
- Sem notificação automática; ela acompanha pelo WhatsApp

### Informações da loja
- Editar tudo de `loja/info`
- Ligar/desligar o aviso temporário e escrever o texto

### Entrega
- Adicionar/remover bairro e definir a taxa de cada um
- Editar horário de entrega e endereço de retirada

---

## 6. Direção visual

Referência dada pelo Victor: **resident.co.nz** — editorial, contido, muita
respiração, fotografia dominando a página, grid assimétrico. O pedido é: essa
mesma qualidade e rigor, mas com o calor de uma doceria, não a frieza de uma
loja de mobiliário. Rosa e branco são as cores da marca dela.

### Paleta

Rosa como acento com intenção, não rosa em tudo. Fundo off-white **quente**
(não `#ffffff` puro, que endurece a página), texto em marrom bem escuro em vez
de preto puro — mais próximo de chocolate, combina com o assunto e suaviza o
contraste sem perder legibilidade.

- Fundo: off-white quente
- Superfície: branco
- Texto principal: marrom quase preto
- Texto secundário: marrom médio dessaturado
- Acento: rosa da marca (versão mais profunda e saturada para botões/links)
- Acento hover: um passo mais escuro

Manter contraste mínimo AA (4.5:1) em texto — rosa claro sobre branco não
passa, então o rosa dos botões precisa ser fechado o suficiente.

### Tipografia

Duas famílias, papéis distintos:
- **Display** (títulos, nome da loja, nome do produto): uma face com
  personalidade real — uma serifada moderna funciona bem para comida
  artesanal. Evitar Inter, Space Grotesk e afins como fonte de destaque.
- **Corpo** (descrições, informações): sans limpa e legível, tamanho
  confortável — o público é jovem, mas texto pequeno é ruim pra todo mundo
  no celular.

Escala tipográfica definida e respeitada; `text-wrap: balance` nos títulos.

### Layout

- **Mobile-first de verdade** — ela confirmou que os clientes acessam pelo
  celular. Mas o desktop não pode ser só "a versão esticada": aproveitar o
  espaço com grid mais generoso e imagens maiores.
- Produto grande. A foto é o argumento de venda, não a descrição.
- Grid editorial, não uma malha uniforme de cartõezinhos: variar tamanho
  entre destaque e produtos normais.
- Whitespace generoso — é o que faz a referência parecer cara.
- Aviso temporário (quando ativo) como faixa no topo, discreta mas visível.

### Movimento

Lenis + GSAP já estão instalados e funcionando.
- Scroll suave (Lenis) sincronizado com o ticker do GSAP
- Reveals discretos ao entrar na viewport
- Micro-interação no hover das imagens de produto (escala sutil, sem exagero)
- **`prefers-reduced-motion` respeitado** — já implementado, manter
- Menos é mais: a referência é contida. Animação demais é o que faz um site
  parecer template.

### O risco real desse design

Layout editorial com foto grande **não perdoa foto ruim**. A Patricia tem
fotos de celular. Recomendação a passar pra ela: fundo liso e claro (uma
folha branca ou a própria bancada), luz de janela (nunca flash), mesma
distância e mesmo enquadramento em todos os produtos, todas na mesma
orientação. Não precisa de fotógrafo — precisa de consistência. Sem isso, o
design vai parecer pior do que é.

### Tratamento de dados ausentes

Enquanto preços e fotos não chegam:
- `preco === 0` → exibir "Consulte o preço", nunca "R$ 0,00"
- Produto sem imagem → placeholder desenhado no estilo do site (não um ícone
  de imagem quebrada, não uma foto genérica de banco de imagens)
- Descrição vazia → o card simplesmente não mostra o parágrafo

---

## 7. Considerações técnicas críticas

### Compressão de imagem — não é opcional

Foto de celular tem 3–8 MB. Subir isso cru significa:
- Consumir cota de armazenamento e, principalmente, de banda a cada visita
- Um site lento no 4G, que é como os clientes dela vão acessar

Antes de qualquer upload, comprimir **no navegador**: redimensionar para no
máximo ~1600px no lado maior, converter para WebP, mirar ~200 KB por imagem.
Bibliotecas como `browser-image-compression` resolvem isso em poucas linhas.
Guardar largura e altura no documento para reservar espaço no layout e evitar
salto de conteúdo durante o carregamento.

### Onde as imagens vão morar — verificar antes de construir

O Cloud Storage para Firebase passou a exigir o plano Blaze (com cartão
cadastrado) em projetos criados a partir de determinada data, mesmo que o uso
fique dentro da cota gratuita. **Confirmar no console do `vitrine-doceria` se
o Storage ativa no plano Spark.** Se não ativar, as alternativas mantendo
custo zero:

1. **Vercel Blob** — tem camada gratuita e já estamos na Vercel; a Patricia
   continua subindo as fotos pelo admin.
2. **Cloudinary** — camada gratuita generosa e otimização automática de
   imagem, mas é mais uma conta e mais uma dependência.
3. **Imagens versionadas no repositório** (`public/produtos/`) — grátis com
   certeza e servido pelo CDN da Vercel, mas a Patricia **perde** a
   capacidade de trocar fotos sozinha, o que ela marcou como essencial.
   Só como último recurso.

Essa decisão precisa ser tomada antes de construir a parte de upload do admin.

### Cotas do Firestore no plano Spark

20.000 escritas e 50.000 leituras por dia. Para uma loja de bairro isso é
folgadíssimo — mas evitar ler a coleção inteira a cada render. A vitrine é
conteúdo praticamente estático: usar cache/ISR do Next em vez de buscar no
Firestore a cada visita.

### SEO e compartilhamento

O link vai circular por WhatsApp. Então:
- `metadata` com título e descrição de verdade
- Imagem de Open Graph (a foto de capa de um produto serve)
- Sem isso, o link aparece cru na conversa e passa impressão de amador
