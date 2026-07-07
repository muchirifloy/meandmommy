import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ProductCard } from "@/components/store/ProductCard";
import { getCatalog } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";

export const metadata = {
  title: "Search Baby Products",
  description: "Search Me & Mommy baby diapers, feeding bottles, teethers, soothers, sippers, and baby care products.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { products } = await getCatalog();
  const results = searchProducts(products, q);

  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Search</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          {q ? `Results for "${q}"` : "Search all baby essentials"}
        </h1>
        <form action="/search" className="mt-6 flex max-w-2xl rounded-full border border-sky-100 bg-white p-2 shadow-sm">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search diapers, bottles, teethers..."
            className="min-w-0 flex-1 rounded-full px-4 outline-none"
          />
          <button className="rounded-full bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark">Search</button>
        </form>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!results.length ? (
          <div className="mt-8 rounded-lg bg-white p-8 shadow-sm ring-1 ring-sky-100">
            <p className="text-slate-600">No products matched your search. Try “diaper”, “bottle”, or “teether”.</p>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

