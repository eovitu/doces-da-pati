import { EntregaConfig, LojaInfo, Produto } from "@/types/produto";

// Dados reais da Os Doces da Pati — fonte para a vitrine (via mock local,
// quando NEXT_PUBLIC_USA_FIREBASE=false) e para scripts/seed-firestore.mts.
// Ver docs/PRODUTOS.md para a tabela de referência e pendências.
export const produtosSeed: Produto[] = [
  {
    slug: "espetinho-de-morango",
    nome: "Espetinho de morango",
    descricao: "Morango com casquinha de chocolate.",
    preco: 1500,
    imagens: [{ url: "/produtos/espetinho-de-morango.webp" }],
    ativo: true,
    ordem: 0,
    controlaEstoque: false,
  },
  {
    slug: "espetinho-de-bombom-de-morango",
    nome: "Espetinho de bombom de morango",
    descricao: "Morango recheado com brigadeiro de ninho e cobertura de chocolate.",
    preco: 1800,
    imagens: [{ url: "/produtos/espetinho-de-bombom-de-morango.webp" }],
    ativo: true,
    ordem: 1,
    controlaEstoque: false,
  },
  {
    slug: "espetinho-de-uva",
    nome: "Espetinho de uva",
    descricao: "Uva verde sem semente com cobertura de chocolate.",
    preco: 1200,
    imagens: [{ url: "/produtos/espetinho-de-uva.webp" }],
    ativo: true,
    ordem: 2,
    controlaEstoque: false,
  },
  {
    slug: "pao-de-mel",
    nome: "Pão de mel",
    preco: 1000,
    imagens: [{ url: "/produtos/pao-de-mel.webp" }],
    ativo: true,
    ordem: 3,
    controlaEstoque: false,
    sabores: ["Doce de leite", "Ninho", "Ninho com Nutella", "Brigadeiro", "Prestígio"],
  },
  {
    slug: "bombom-de-morango-no-pote",
    nome: "Bombom de morango no pote",
    descricao:
      "Morangos e uma camada de recheio de brigadeiro de ninho com uma camada de ganache de chocolate ao leite.",
    preco: 1800,
    imagens: [{ url: "/produtos/bombom-de-morango-no-pote.webp" }],
    ativo: true,
    ordem: 4,
    controlaEstoque: false,
  },
  {
    slug: "bombom-de-uva-no-pote",
    nome: "Bombom de uva no pote",
    descricao:
      "Uvas verdes sem semente e uma camada de recheio de brigadeiro de ninho com uma camada de ganache de chocolate ao leite.",
    preco: 1800,
    imagens: [{ url: "/produtos/bombom-de-uva-no-pote.webp" }],
    ativo: true,
    ordem: 5,
    controlaEstoque: false,
  },
  {
    slug: "lanche-natural",
    nome: "Lanche natural",
    descricao: "Pão de forma integral recheado com patê de frango, cenoura, tomate e alface.",
    preco: 1200,
    imagens: [{ url: "/produtos/lanche-natural.webp" }],
    ativo: true,
    ordem: 6,
    controlaEstoque: false,
  },
  {
    slug: "suco-natural",
    nome: "Suco natural 250ml",
    preco: 700,
    imagens: [{ url: "/produtos/suco-natural.webp" }],
    ativo: true,
    ordem: 7,
    controlaEstoque: false,
    sabores: ["Goiaba", "Manga", "Maracujá", "Acerola", "Morango"],
  },
];

export const lojaInfoSeed: LojaInfo = {
  nome: "Os Doces da Pati",
  responsavel: "Patricia",
  whatsapp: "5511986092770",
  instagram: "https://www.instagram.com/osdocesdapati",
  regiao: "São Paulo, zona sul",
  retirada: "Parque Regina",
  horarioAtendimento: "12h às 22h, todos os dias",
  horarioEntrega: "18h às 22h",
  formasPagamento: ["pix", "cartao"],
};

// Valores de frete ainda não informados pela Patricia.
// TODO: valores reais pendentes
export const entregaConfigSeed: EntregaConfig = {
  bairros: [
    { nome: "Campo Limpo", taxa: 0 },
    { nome: "Vila Andrade", taxa: 0 },
    { nome: "Parque Araribá", taxa: 0 },
    { nome: "Jardim Inga", taxa: 0 },
    { nome: "Jardim Olinda", taxa: 0 },
  ],
};
