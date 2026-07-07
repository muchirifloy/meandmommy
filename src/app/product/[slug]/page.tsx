import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ProductCard } from "@/components/store/ProductCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getCatalog, getProduct } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const description = product.description || product.shortDescription;

  return {
    title: `${product.name} in Kenya | Me & Mommy`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | Me & Mommy`,
      description,
      url: `${baseUrl}/product/${product.slug}`,
      type: "website",
      images: [{ url: product.imageUrl }],
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
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 4);
  const activePrice = product.salePrice || product.price;
  const descriptionParagraphs = product.description
    .split(/(?<=\.)\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${baseUrl}${product.imageUrl.startsWith("/") ? product.imageUrl : `/${product.imageUrl}`}`],
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
      <main className="container-shell py-12">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden rounded-lg bg-brand-soft">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={900}
              height={760}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">{product.categoryName}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{product.shortDescription}</p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-brand-dark">{formatPrice(activePrice)}</span>
              {product.salePrice ? <span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span> : null}
              {product.discountLabel ? (
                <span className="rounded-full bg-petal px-3 py-1 text-xs font-black text-brand-dark">{product.discountLabel}</span>
              ) : null}
            </div>
            <div className="mt-6">
              <ProductCard product={product} />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Product description</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Why parents choose this item</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="rounded-lg bg-brand-soft p-6 ring-1 ring-sky-100">
            <h2 className="text-xl font-black text-slate-950">Quick product details</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="font-black uppercase tracking-wide text-brand-dark">Category</dt>
                <dd className="mt-1 text-slate-700">{product.categoryName}</dd>
              </div>
              <div>
                <dt className="font-black uppercase tracking-wide text-brand-dark">Availability</dt>
                <dd className="mt-1 text-slate-700">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</dd>
              </div>
              <div>
                <dt className="font-black uppercase tracking-wide text-brand-dark">Payment</dt>
                <dd className="mt-1 text-slate-700">Secure checkout with M-Pesa STK push.</dd>
              </div>
            </dl>
          </aside>
        </section>

        {related.length ? (
          <section className="mt-14">
            <h2 className="text-2xl font-black text-slate-950">More from {product.categoryName}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
        <section className="mt-14 max-w-2xl">
          <ReviewForm productId={product.id} />
        </section>
      </main>
      <Footer />
    </>
  );
}
