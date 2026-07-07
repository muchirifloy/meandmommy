import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { ProductCard } from "@/components/store/ProductCard";
import { getCatalog, getProduct } from "@/lib/catalog";

const productHowToUse = {
  "me-and-mommy-sterilising-tablets": {
    steps: [
      "Wash items thoroughly before sterilising.",
      "Fill a clean container with the recommended amount of cold water.",
      "Dissolve one Me & Mommy Sterilising Tablet.",
      "Fully submerge all items and check that no air bubbles are trapped.",
      "Leave for the recommended sterilising time on the pack.",
      "Remove with clean hands or sterilised tongs and allow items to drain before use.",
    ],
  },
  "me-and-mommy-breastmilk-storage-bags": {
    steps: [
      "Wash hands before handling expressed milk.",
      "Pour cooled expressed milk into the storage bag.",
      "Leave room for expansion before freezing.",
      "Seal securely and label with date and amount.",
      "Store flat in the freezer to save space.",
      "Thaw the oldest milk first and follow recognised breastmilk storage guidance.",
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const description = product.description || product.shortDescription;

  return {
    title: `Buy ${product.name} in Kenya`,
    description,
    keywords: [
      product.name,
      `${product.name} Kenya`,
      product.categoryName,
      `${product.categoryName} Kenya`,
      "Me & Mommy",
      "baby care Kenya",
      "Nairobi baby shop",
    ],
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | Me & Mommy`,
      description,
      url: `${baseUrl}/product/${product.slug}`,
      type: "website",
      images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
    },
  };
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const { products } = await getCatalog();
  const related = products
    .filter((item) => item.categorySlug !== product.categorySlug && item.id !== product.id)
    .slice(0, 4);
  const howToUse = productHowToUse[product.slug as keyof typeof productHowToUse];
  const activePrice = product.salePrice || product.price;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${baseUrl}${image.url.startsWith("/") ? image.url : `/${image.url}`}`),
    brand: { "@type": "Brand", name: "Me & Mommy" },
    category: product.categoryName,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "KES",
      price: activePrice,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <main className="container-shell py-8">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-lg bg-brand-soft">
            <Image
              src={product.imageUrl}
              alt={product.images[0]?.alt || product.name}
              width={900}
              height={760}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
            {product.images.length > 1 ? (
              <div className="grid grid-cols-3 gap-2 bg-white p-2">
                {product.images.slice(0, 3).map((image) => (
                  <div key={image.url} className="relative aspect-[4/3] overflow-hidden rounded-md bg-sky-50">
                    <Image src={image.url} alt={image.alt} fill sizes="160px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-lg border border-sky-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-brand-dark">{product.categoryName}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">{product.name}</h1>
            <p className="mt-3 leading-7 text-slate-600">{product.shortDescription}</p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-brand-dark">{formatPrice(activePrice)}</span>
              {product.salePrice ? <span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span> : null}
              {product.discountLabel ? (
                <span className="rounded-full bg-petal px-3 py-1 text-xs font-black text-brand-dark">{product.discountLabel}</span>
              ) : null}
            </div>
            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>
            <div className="mt-6 space-y-3 border-t border-sky-100 pt-5">
              <details className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
                <summary className="cursor-pointer text-sm font-black text-slate-950">Description</summary>
                <p className="mt-3 text-sm leading-7 text-slate-700">{product.description}</p>
              </details>
              {howToUse ? (
                <details className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
                  <summary className="cursor-pointer text-sm font-black text-slate-950">How to use</summary>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
                    {howToUse.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </details>
              ) : null}
            </div>
          </div>
        </section>

        {related.length ? (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-950">Related products</h2>
              <span className="text-sm font-bold text-slate-500">Swipe to browse</span>
            </div>
            <div className="shop-rail product-rail mt-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
