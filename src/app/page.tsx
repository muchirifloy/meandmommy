import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { CategoryCard } from "@/components/store/CategoryCard";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
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
  const [{ categories }, featuredProducts, homeOffer] = await Promise.all([getCatalog(), getFeaturedProducts(), getHomeOffer()]);

  return (
    <>
      <Header />
      <PromoStrip />
      <main>
        <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-sky-50">
          <Image
            src="/images/mother-child-hero.png"
            alt="Mother lifting a smiling baby"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="hero-background-drift z-0 object-cover object-[62%_center] opacity-90"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/88 via-white/52 to-white/5" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/62 via-transparent to-white/5" />
          <div className="container-shell relative z-20 grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            {homeOffer ? (
              <p className="inline-flex rounded-full bg-petal px-4 py-2 text-sm font-black text-brand-dark">
                Use code {homeOffer.code} and get {homeOffer.discountValue}
                {homeOffer.discountType === "PERCENTAGE" ? "% OFF" : " KES OFF"}
              </p>
            ) : null}
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 md:text-7xl">
              Safer milk storage and cleaner feeding routines.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Shop breastmilk storage bags and sterilising tablets selected for expressing mums, bottle-feeding
              families, pump-part care, daycare, travel, and everyday Kenyan parenting routines.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#shop"
                className="rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:bg-brand-dark"
              >
                Shop Essentials
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-brand-dark transition hover:bg-sky-50"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-brand-soft via-petal to-mint blur-2xl" />
            <div className="relative overflow-hidden rounded-lg soft-card">
              <Image
                src={categories[0]?.imageUrl || "/images/me-and-mommy-logo.png"}
                alt="Me & Mommy breastmilk storage and sterilising essentials"
                width={900}
                height={680}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur">
                <Image
                  src="/images/me-and-mommy-logo.png"
                  alt="Me & Mommy"
                  width={210}
                  height={64}
                  className="h-12 w-auto"
                />
                <p className="mt-2 text-sm font-medium text-slate-600">Store. Sterilise. Feed with confidence.</p>
              </div>
            </div>
          </div>
          </div>
        </section>

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
              <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Two essentials. Cleaner, calmer feeding.</h2>
            </div>
            <Link href="/category/breastmilk-storage-bags" className="font-black text-brand-dark hover:underline">
              Browse all products
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        <section className="bg-sky-50/70 py-16">
          <div className="container-shell">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Hot sale & featured products</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Milk storage and bottle care, ready for checkout.</h2>
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
              bags for organised expressing, and sterilising tablets for cleaner feeding accessories.
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
