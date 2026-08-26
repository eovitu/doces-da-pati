export interface ProdutoImagem {
  url: string; // caminho relativo (/produtos/<slug>.webp) ou URL absoluta
  alt?: string;
  path?: string; // caminho no Storage, só quando veio de upload pelo admin
}

export interface Produto {
  slug: string;
  nome: string;
  descricao?: string;
  preco: number; // centavos. 0 = sob consulta, nunca exibir como R$ 0,00
  categoriaId?: string;
  imagens: ProdutoImagem[];
  ativo: boolean;
  ordem: number;
  controlaEstoque: boolean;
  estoque?: number; // usado quando o produto não tem sabores
  sabores?: string[];
  // Presente só quando controlaEstoque && sabores.length > 0. Sabor ausente
  // do mapa = sem controle individual, tratado como disponível.
  estoquePorSabor?: Record<string, number>;
  destaque?: boolean;
}

/** Produto sem sabores: se esgotou o único estoque, some da vitrine. */
export function produtoDisponivel(produto: Produto): boolean {
  if (!produto.controlaEstoque) return true;
  if (produto.sabores && produto.sabores.length > 0) {
    return produto.sabores.some((sabor) => {
      const quantidade = produto.estoquePorSabor?.[sabor];
      return quantidade === undefined || quantidade > 0;
    });
  }
  return (produto.estoque ?? 0) > 0;
}

/** Um sabor específico esgotou, mas outros do mesmo produto podem seguir à venda. */
export function saborEsgotado(produto: Produto, sabor: string): boolean {
  if (!produto.controlaEstoque) return false;
  const quantidade = produto.estoquePorSabor?.[sabor];
  return quantidade !== undefined && quantidade <= 0;
}

export interface Categoria {
  slug: string;
  nome: string;
  ordem: number;
}

export interface LojaInfo {
  nome: string;
  responsavel: string;
  whatsapp: string; // formato: 5599999999999 (DDI+DDD+numero, só dígitos)
  instagram?: string;
  regiao: string;
  retirada: string;
  horarioAtendimento: string;
  horarioEntrega: string;
  formasPagamento: string[];
  chavePix?: string;
  sobre?: string;
  conservacao?: string;
  cnpjOuNome?: string;
  avisoTemporario?: {
    ativo: boolean;
    mensagem: string;
  };
}

export interface BairroEntrega {
  nome: string;
  taxa: number; // centavos. 0 = a combinar
}

export interface EntregaConfig {
  bairros: BairroEntrega[];
}
