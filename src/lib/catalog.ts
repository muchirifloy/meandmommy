import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { seedCategories, seedProducts, seedVideoGuides } from "@/lib/seed-data";

type ProductWithImage = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  discountLabel: string | null;
  stock: number;
  featured: boolean;
  imageUrl: string;
  images: { url: string; alt: string }[];
  categorySlug: string;
  categoryName: string;
};

export type VideoGuideItem = {
  id: string;
  title: string;
  footnote: string;
  url: string;
  posterUrl: string | null;
  productSlug: string | null;
};

function money(value: Prisma.Decimal | number | null | undefined) {
  if (value == null) return null;
  return Number(value);
}

function fallbackProducts(): ProductWithImage[] {
  return seedProducts.map((product) => {
    const category = seedCategories.find((item) => item.slug === product.categorySlug);

    return {
      ...product,
      salePrice: product.salePrice ?? null,
      discountLabel: product.discountLabel ?? null,
      categoryName: category?.name || "Me & Mommy",
    };
  });
}

async function dbProducts(): Promise<ProductWithImage[]> {
  const db = getDb();
  const products = await db.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    price: money(product.price) || 0,
    salePrice: money(product.salePrice),
    discountLabel: product.discountLabel,
    stock: product.stock,
    featured: product.featured,
    imageUrl: product.images[0]?.url || product.category.imageUrl || "/images/me-and-mommy-logo.png",
    images:
      product.images.length > 0
        ? product.images.map((image) => ({ url: image.url, alt: image.alt }))
        : [{ url: product.category.imageUrl || "/images/me-and-mommy-logo.png", alt: product.name }],
    categorySlug: product.category.slug,
    categoryName: product.category.name,
  }));
}

export async function getCatalog() {
  try {
    const db = getDb();
    const [categories, products] = await Promise.all([
      db.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      dbProducts(),
    ]);

    return {
      categories: categories.map((category) => ({
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl || "/images/me-and-mommy-logo.png",
      })),
      products: products.filter((product) => categories.some((category) => category.slug === product.categorySlug)),
    };
  } catch {
    return {
      categories: seedCategories,
      products: fallbackProducts(),
    };
  }
}

export async function getCategory(slug: string) {
  const catalog = await getCatalog();
  const category = catalog.categories.find((item) => item.slug === slug);

  if (!category) return null;

  return {
    category,
    products: catalog.products.filter((product) => product.categorySlug === slug),
  };
}

export async function getProduct(slug: string) {
  const catalog = await getCatalog();
  return catalog.products.find((product) => product.slug === slug) || null;
}

export async function getFeaturedProducts() {
  const catalog = await getCatalog();
  return catalog.products.filter((product) => product.featured).slice(0, 8);
}

export async function getVideoGuides(productSlug?: string): Promise<VideoGuideItem[]> {
  try {
    const db = getDb();
    const guides = await db.videoGuide.findMany({
      where: {
        isActive: true,
        OR: productSlug
          ? [{ product: { slug: productSlug } }, { productId: null }]
          : undefined,
      },
      include: { product: { select: { slug: true } } },
      orderBy: { sortOrder: "asc" },
      take: 10,
    });

    return guides.map((guide) => ({
      id: guide.id,
      title: guide.title,
      footnote: guide.footnote,
      url: guide.url,
      posterUrl: guide.posterUrl,
      productSlug: guide.product?.slug || null,
    }));
  } catch {
    return seedVideoGuides
      .filter((guide) => !productSlug || !guide.productSlug || guide.productSlug === productSlug)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((guide) => ({
        id: guide.title,
        title: guide.title,
        footnote: guide.footnote,
        url: guide.url,
        posterUrl: guide.posterUrl || null,
        productSlug: guide.productSlug || null,
      }));
  }
}
