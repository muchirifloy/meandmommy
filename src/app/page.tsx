import Link from "next/link";
import { CategoryCard } from "@/components/store/CategoryCard";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { HeroRotator } from "@/components/store/HeroRotator";
import { ProductCard } from "@/components/store/ProductCard";
import { getCatalog, getFeaturedProducts } from "@/lib/catalog";
import { getHomeOffer } from "@/lib/offers";

export default async function Home() {
  const [{ categories, products }, featuredProducts, homeOffer] = await Promise.all([getCatalog(), getFeaturedProducts(), getHomeOffer()]);
  const heroCopy: Record<string, { title: string; body: string; eyebrow: string }> = {
    "me-and-mommy-breastmilk-storage-bags": {
      eyebrow: "Breastmilk storage bags",
      title: "Store expressed milk with confidence.",
      body: "Pre-sterilised 220ml storage bags for expressing mums, freezer organisation, daycare portions, and clean milk routines in Kenya.",
    },
    "me-and-mommy-sterilising-tablets": {
      eyebrow: "Sterilising tablets",
      title: "Protect what matters most before every feed.",
      body: "30-tablet cold-water sterilising packs for bottles, teats, breast pump parts, pacifiers, and baby feeding accessories.",
    },
    "me-and-mommy-care-cream": {
      eyebrow: "Cream and body care",
      title: "Add everyday care to the feeding routine.",
      body: "Cream and body-care essentials stay admin-editable while the client confirms final stock, wording, images, and prices.",
    },
    "me-and-mommy-baby-brush-set": {
      eyebrow: "Brushes and toothbrushes",
      title: "Clean bottles, teats, and tiny smiles.",
      body: "Soft baby toothbrushes, gum brushes, bottle brushes, and teat brushes for cleaner feeding accessories and early oral care.",
    },
    "me-and-mommy-breast-pump-kit": {
      eyebrow: "Breast pumps and accessories",
      title: "Make expressing easier from pump to storage.",
      body: "Breast pumps, flanges, collection bottles, and pumping accessories that pair naturally with Me & Mommy storage bags.",
    },
  };
  const heroSlides = products.slice(0, 5).map((product) => ({
    title: heroCopy[product.slug]?.title || product.name,
    body: heroCopy[product.slug]?.body || product.shortDescription,
    eyebrow: heroCopy[product.slug]?.eyebrow || product.categoryName,
    href: `/product/${product.slug}`,
    imageUrl: product.images[0]?.url || product.imageUrl,
    imageAlt: product.images[0]?.alt || product.name,
  }));

  return (
    <>
      <Header />
      <main>
        <HeroRotator slides={heroSlides} offer={homeOffer} />

        <section id="shop" className="container-shell py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-brand-dark">Categories</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Shop by category</h2>
            </div>
            <span className="hidden text-sm font-bold text-slate-500 sm:block">Swipe to browse</span>
          </div>
          <div className="shop-rail category-rail mt-5">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        <section className="border-y border-sky-100 bg-sky-50/70 py-10">
          <div className="container-shell">
            {homeOffer ? (
              <div className="mb-6 rounded-lg bg-brand px-5 py-4 text-white">
                <p className="text-sm font-black">
                  Use {homeOffer.code} for {homeOffer.discountValue}
                  {homeOffer.discountType === "PERCENTAGE" ? "% OFF" : " KES OFF"}
                  <span className="ml-2 font-medium text-white/82">{homeOffer.description}</span>
                </p>
              </div>
            ) : null}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-brand-dark">Products</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Featured items</h2>
              </div>
              <Link href="/search" className="text-sm font-black text-brand-dark hover:underline">
                View all
              </Link>
            </div>
            <div className="shop-rail product-rail mt-5">
              {(featuredProducts.length ? featuredProducts : products).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
