import Link from "next/link";
import type { Metadata } from "next";
import { CategoryCard } from "@/components/store/CategoryCard";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { HeroRotator } from "@/components/store/HeroRotator";
import { ProductCard } from "@/components/store/ProductCard";
import { getCatalog, getFeaturedProducts } from "@/lib/catalog";
import { getHomeOffer } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Me & Mommy Baby Shop Kenya | Breastmilk Storage Bags, Sterilising Tablets & Care",
  description:
    "Shop Me & Mommy Kenya for breastmilk storage bags, baby bottle sterilising tablets, baby brushes, breast pump accessories, cream care products, and feeding essentials in Nairobi.",
  keywords: [
    "Me and Mommy Kenya",
    "Me & Mommy baby shop",
    "baby shop Kenya",
    "baby shop Nairobi",
    "breastmilk storage bags Kenya",
    "breast milk storage bags Nairobi",
    "milk storage bags 220ml",
    "baby bottle sterilising tablets Kenya",
    "sterilising tablets for baby bottles",
    "breast pump accessories Kenya",
    "baby bottle brush Kenya",
    "baby toothbrush Kenya",
    "baby cream Kenya",
    "M-Pesa baby shop Kenya",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Me & Mommy Baby Shop Kenya",
    description:
      "Breastmilk storage bags, sterilising tablets, brushes, breast pump accessories, and cream care products for Kenyan parents.",
    url: "/",
    type: "website",
    images: [{ url: "/images/hero/me-and-mommy-hero-products.webp", width: 1600, height: 900, alt: "Me & Mommy baby feeding and care products" }],
  },
};

export default async function Home() {
  const [{ categories, products }, featuredProducts, homeOffer] = await Promise.all([getCatalog(), getFeaturedProducts(), getHomeOffer()]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        name: "Me & Mommy",
        url: baseUrl,
        image: `${baseUrl}/images/hero/me-and-mommy-hero-products.webp`,
        email: "info@meandmommy.co.ke",
        telephone: "+254724736495",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
      },
      {
        "@type": "WebSite",
        name: "Me & Mommy",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
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
