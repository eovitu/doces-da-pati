import { getProdutos } from "@/lib/produtos";
import { lojaInfoMock } from "@/data/produtos-mock";
import { ProdutoCard } from "@/components/ProdutoCard";
import { linkContatoWhatsapp } from "@/lib/whatsapp";

export default async function Home() {
  const produtos = await getProdutos();
  const loja = lojaInfoMock; // trocar por dados vindos do Firebase quando existir a coleção "loja"

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">{loja.nome}</h1>
          <p className="max-w-md text-stone-600">{loja.descricaoCurta}</p>
          <p className="text-sm text-stone-500">{loja.cidade} · {loja.horarios}</p>
          <a
            href={linkContatoWhatsapp(loja.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">Nossos produtos</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} whatsapp={loja.whatsapp} />
          ))}
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        {loja.nome} · Pedidos pelo WhatsApp
      </footer>
    </div>
  );
}
