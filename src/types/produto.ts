export interface ProdutoImagem {
  url: string; // caminho relativo (/produtos/<slug>.webp) ou URL absoluta
  alt?: string;
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
  estoque?: number;
  sabores?: string[];
  destaque?: boolean;
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
