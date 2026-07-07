import Link from "next/link";
import { BadgeCheck, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { CategoryCard } from "@/components/store/CategoryCard";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { HeroRotator } from "@/components/store/HeroRotator";
import { ProductCard } from "@/components/store/ProductCard";
import { PromoStrip } from "@/components/store/PromoStrip";
import { ReviewSlider } from "@/components/store/ReviewSlider";
import { getCatalog, getFeaturedProducts } from "@/lib/catalog";
import { getHomeOffer } from "@/lib/offers";

const trustBlocks = [
  { label: "Milk Storage Ready", icon: ShieldCheck },
  { label: "M-Pesa Checkout", icon: BadgeCheck },
  { label: "Fast Support", icon: Headphones },
  { label: "Hygiene Essentials", icon: RotateCcw },
  { label: "Reliable Delivery", icon: Truck },
];

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
      <PromoStrip />
      <main>
        <HeroRotator slides={heroSlides} offer={homeOffer} />

        <section className="border-y border-sky-100 bg-white/80 py-5">
          <div className="container-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {trustBlocks.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg bg-sky-50 px-4 py-3">
                <item.icon className="h-5 w-5 text-brand-dark" />
                <span className="text-sm font-black text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="shop" className="container-shell py-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Shop by category</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Feeding, hygiene, pumping, and care essentials.</h2>
            </div>
            <Link href="/category/breastmilk-storage-bags" className="font-black text-brand-dark hover:underline">
              Browse all products
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        <section className="bg-sky-50/70 py-16">
          <div className="container-shell">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Hot sale & featured products</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Milk storage, sterilising, brushes, pumps, and cream.</h2>
            {homeOffer ? (
              <div className="mt-6 rounded-lg bg-gradient-to-r from-brand via-brand-dark to-slate-950 p-6 text-white shadow-xl shadow-sky-100">
                <p className="text-sm font-black uppercase tracking-wide text-white/80">{homeOffer.name}</p>
                <h3 className="mt-2 text-3xl font-black">
                  Use {homeOffer.code} for {homeOffer.discountValue}
                  {homeOffer.discountType === "PERCENTAGE" ? "% OFF" : " KES OFF"}
                </h3>
                <p className="mt-2 max-w-2xl text-white/82">{homeOffer.description}</p>
              </div>
            ) : null}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-8 py-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Why Me & Mommy</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Thoughtful care for milk, bottles, and peace of mind.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Me & Mommy focuses on the daily hygiene essentials parents reorder again and again: breastmilk storage
              bags for organised expressing, sterilising tablets for cleaner feeding accessories, plus cream, brushes,
              and pumping add-ons the admin can grow as stock changes.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {["Ethics first", "Consumer-centric", "Sustainability", "Innovation"].map((value) => (
              <div key={value} className="rounded-lg soft-card p-5">
                <h3 className="font-black text-slate-950">{value}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Built into focused product choices, clear instructions, support, and the shopping experience.
                </p>
              </div>
            ))}
          </div>
        </section>

        <ReviewSlider />
      </main>
      <Footer />
    </>
  );
}
