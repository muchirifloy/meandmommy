import { AdminProductManager, type AdminProductRow } from "@/components/admin/AdminProductManager";
import { getOptionalDb } from "@/lib/db";

export default async function AdminProductsPage() {
  const db = getOptionalDb();
  const [categories, products] = db
    ? await Promise.all([
        db.category.findMany({ orderBy: { name: "asc" } }).catch(() => []),
        db.product
          .findMany({
            include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
            orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
            take: 100,
          })
          .catch(() => []),
      ])
    : [[], []];

  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    discountLabel: product.discountLabel,
    stock: product.stock,
    featured: product.featured,
    isActive: product.isActive,
    images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
  }));

  return (
    <AdminProductManager
      categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      products={rows}
    />
  );
}
