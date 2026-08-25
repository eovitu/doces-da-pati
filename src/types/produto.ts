export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  precoVariavel?: boolean;
  imagemUrl: string;
  disponivel: boolean;
  sabores?: string[];
  tamanhos?: string[];
  prazoProducaoDias?: number;
  destaque?: boolean;
}

export interface LojaInfo {
  nome: string;
  whatsapp: string; // formato: 5599999999999 (DDI+DDD+numero, só dígitos)
  instagram?: string;
  cidade: string;
  horarios: string;
  descricaoCurta: string;
}
