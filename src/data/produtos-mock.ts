import { Produto, LojaInfo } from "@/types/produto";

// Dados de exemplo — trocar pelos produtos reais assim que o briefing voltar
// preenchido. Serve pra já ver o layout funcionando com conteúdo real de doces.
export const produtosMock: Produto[] = [
  {
    id: "brigadeiro-gourmet",
    nome: "Brigadeiro Gourmet",
    categoria: "Doces finos",
    descricao: "Brigadeiro artesanal enrolado na hora, casquinha crocante de granulado belga.",
    preco: 4.5,
    imagemUrl: "/produtos/brigadeiro.jpg",
    disponivel: true,
    sabores: ["Tradicional", "Ninho", "Pistache"],
    destaque: true,
  },
  {
    id: "bolo-pote-choc",
    nome: "Bolo de Pote — Chocolate",
    categoria: "Bolos de pote",
    descricao: "Camadas de bolo de chocolate, brigadeiro e morango fresco.",
    preco: 14,
    imagemUrl: "/produtos/bolo-pote.jpg",
    disponivel: true,
    tamanhos: ["200ml"],
  },
  {
    id: "torta-limao",
    nome: "Torta de Limão",
    categoria: "Tortas",
    descricao: "Base amanteigada, creme de limão e merengue maçaricado. Feita sob encomenda.",
    preco: 65,
    precoVariavel: true,
    imagemUrl: "/produtos/torta-limao.jpg",
    disponivel: true,
    tamanhos: ["15cm (6 fatias)", "20cm (10 fatias)"],
    prazoProducaoDias: 2,
  },
];

export const lojaInfoMock: LojaInfo = {
  nome: "Doces da [Nome]",
  whatsapp: "5599999999999",
  instagram: "https://instagram.com/",
  cidade: "Sua cidade",
  horarios: "Terça a sábado, 9h às 18h",
  descricaoCurta: "Doces artesanais feitos com carinho, direto pro seu pedido.",
};
