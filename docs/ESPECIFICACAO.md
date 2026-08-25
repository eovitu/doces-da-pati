# Especificação de dados

Modelo de dados do Firestore para a vitrine da **Os Doces da Pati**. Referido
pelo `CLAUDE.md` — qualquer mudança de schema deve atualizar este arquivo
junto.

Preços sempre em **centavos** (`number` inteiro). `1500` = R$ 15,00.

---

## Coleção `produtos`

```ts
interface Produto {
  slug: string;              // id do documento, também usado na URL da imagem
  nome: string;
  descricao?: string;        // vazio até a Patricia escrever — card não renderiza parágrafo vazio
  preco: number;              // centavos. 0 = "sob consulta" (ex.: festinha), nunca exibir R$ 0,00
  categoriaId?: string;        // vazio enquanto não houver categorias
  imagens: { url: string; alt?: string }[]; // caminho relativo (/produtos/<slug>.webp) ou URL absoluta
  ativo: boolean;              // false = não aparece na vitrine
  ordem: number;                // ordenação manual na grade
  controlaEstoque: boolean;     // true = contador manual decrementa e zera disponibilidade
  estoque?: number;             // só relevante quando controlaEstoque = true
  sabores?: string[];           // só pão de mel e suco natural têm hoje
  destaque?: boolean;
}
```

Regras de exibição:

- `preco === 0` → mostrar "Consulte o preço" (ou "Sob consulta"), nunca "R$ 0,00".
- `controlaEstoque && estoque === 0` → produto marcado indisponível na vitrine.
- Sem imagem → placeholder no estilo do site, nunca ícone quebrado.

## Coleção `categorias`

```ts
interface Categoria {
  slug: string;   // id do documento
  nome: string;
  ordem: number;
}
```

Vazia por enquanto — a vitrine não agrupa produtos por categoria até existir
ao menos uma. Quando a Patricia criar uma pelo admin, a vitrine passa a
agrupar sozinha.

## Documento `loja/info`

```ts
interface LojaInfo {
  nome: string;
  responsavel: string;
  whatsapp: string;          // só dígitos, com DDI: 5511986092770
  instagram?: string;
  regiao: string;
  retirada: string;           // local de retirada
  horarioAtendimento: string; // ex.: "12h às 22h, todos os dias"
  horarioEntrega: string;     // ex.: "18h às 22h"
  formasPagamento: string[];  // ex.: ["pix", "cartao"]
  chavePix?: string;           // pendente
  sobre?: string;               // texto sobre a loja — pendente
  conservacao?: string;         // informações de conservação — pendente
  cnpjOuNome?: string;           // pendente
  avisoTemporario?: {
    ativo: boolean;
    mensagem: string;
  };
}
```

## Documento `entrega/config`

```ts
interface EntregaConfig {
  bairros: {
    nome: string;
    taxa: number; // centavos. 0 = "a combinar", valores reais pendentes
  }[];
}
```

Os 5 bairros atendidos (Campo Limpo, Vila Andrade, Parque Araribá, Jardim
Inga, Jardim Olinda) entram com `taxa: 0` até a Patricia informar os valores
reais — tratar como "a combinar" na interface, nunca como frete grátis.

## Coleção `admins`

```ts
interface Admin {
  // id do documento = uid do Firebase Auth
  email: string;
}
```

Sem um documento em `admins/{uid}`, as regras do Firestore bloqueiam
qualquer escrita — mesmo de um usuário autenticado. É o que autoriza a
Patricia a usar a área administrativa (etapa futura, ainda não construída).

## Coleção `pedidos`

Gravado pelo cliente (não autenticado) ao finalizar o carrinho, antes de
abrir o WhatsApp. As regras do Firestore validam a forma do documento — não
afrouxar essas regras para o código caber; ajustar o código.

```ts
interface Pedido {
  itens: {
    produtoSlug: string;
    nome: string;
    quantidade: number;
    precoUnitario: number; // centavos, snapshot no momento do pedido
    sabor?: string;
  }[];
  cliente: {
    nome: string;
    telefone: string;
  };
  entrega: {
    tipo: "retirada" | "entrega";
    bairro?: string; // obrigatório quando tipo = "entrega"
    taxa?: number;    // centavos, snapshot da taxa do bairro no momento do pedido
  };
  formaPagamento: "pix" | "dinheiro" | "cartao";
  observacoes?: string;
  total: number;      // centavos, soma dos itens + taxa
  criadoEm: Timestamp; // server timestamp
  status: "novo";       // único valor possível na criação pelo cliente
}
```

Nenhum campo de pagamento processado é gravado — é geração de mensagem para
o WhatsApp, não checkout.
