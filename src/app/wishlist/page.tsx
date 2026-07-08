import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Heart } from "lucide-react";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ProductCard } from "@/components/store/ProductCard";
import { authOptions } from "@/lib/auth";
import { getFeaturedProducts } from "@/lib/catalog";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/wishlist");

  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Header />
      <main className="container-shell min-h-[70vh] py-10 pb-24 lg:pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Saved picks</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Wishlist</h1>
          </div>
          <Link href="/account" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:border-brand hover:text-brand-dark">
            Back to dashboard
          </Link>
        </div>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky-50 text-brand-dark">
            <Heart className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-xl font-black text-slate-950">Wishlist saving is almost ready</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            For now, keep shopping from your dashboard and cart. Saved product persistence can be connected next without changing the customer flow.
          </p>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-950">Popular essentials</h2>
            <Link href="/account#shop" className="text-sm font-black text-brand-dark hover:text-slate-950">
              Shop dashboard
            </Link>
          </div>
          <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-3">
            {featuredProducts.map((product) => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
