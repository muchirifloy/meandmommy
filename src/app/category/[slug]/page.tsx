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
    title: `${result.category.name} in Kenya | Me & Mommy`,
    description: result.category.description,
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
      <main className="container-shell py-12">
        <div className="rounded-lg bg-gradient-to-br from-brand-soft via-white to-petal p-8">
          <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Category</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">{result.category.name}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">{result.category.description}</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {result.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
