import { Produto, produtoDisponivel } from "@/types/produto";

export function selecionarProdutosDestaque(produtos: Produto[]): Produto[] {
  return produtos.filter(
    (produto) => produto.destaque && produto.ativo && produtoDisponivel(produto)
  );
}
