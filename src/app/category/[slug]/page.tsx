import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategory } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategory(slug);
  if (!result) return {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";

  return {
    title: `Shop ${result.category.name} in Kenya`,
    description: result.category.description,
    keywords: [
      result.category.name,
      `${result.category.name} Kenya`,
      `${result.category.name} Nairobi`,
      "Me & Mommy",
      "baby essentials Kenya",
    ],
    alternates: { canonical: `/category/${result.category.slug}` },
    openGraph: {
      title: `${result.category.name} | Me & Mommy`,
      description: result.category.description,
      url: `${baseUrl}/category/${result.category.slug}`,
      type: "website",
      images: [{ url: result.category.imageUrl }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getCategory(slug);

  if (!result) notFound();

  return (
    <>
      <Header />
      <main className="container-shell py-8">
        <div className="rounded-lg border border-sky-100 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wide text-brand-dark">Category</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">{result.category.name}</h1>
        </div>

        <div className="shop-rail product-rail mt-6">
          {result.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
