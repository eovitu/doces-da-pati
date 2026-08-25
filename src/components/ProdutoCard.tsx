import Image from "next/image";
import { Produto } from "@/types/produto";
import { formatarPreco, linkPedidoWhatsapp } from "@/lib/whatsapp";

export function ProdutoCard({ produto, whatsapp }: { produto: Produto; whatsapp: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-square w-full bg-stone-100">
        <Image
          src={produto.imagemUrl}
          alt={produto.nome}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 300px"
        />
        {!produto.disponivel && (
          <span className="absolute left-2 top-2 rounded-full bg-stone-900/80 px-2 py-1 text-xs font-medium text-white">
            Indisponível
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-rose-700/70">
          {produto.categoria}
        </p>
        <h3 className="text-base font-semibold text-stone-900">{produto.nome}</h3>
        <p className="line-clamp-2 text-sm text-stone-600">{produto.descricao}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-stone-900">
            {produto.precoVariavel ? "a partir de " : ""}
            {formatarPreco(produto.preco)}
          </span>
        </div>

        <a
          href={linkPedidoWhatsapp(whatsapp, produto)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!produto.disponivel}
          className={`mt-1 flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
            produto.disponivel
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "pointer-events-none bg-stone-300"
          }`}
        >
          Pedir pelo WhatsApp
        </a>
      </div>
    </div>
  );
}
