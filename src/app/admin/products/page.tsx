import { createProduct } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminProductsPage() {
  const db = getOptionalDb();
  const [categories, products] = db
    ? await Promise.all([
        db.category.findMany({ orderBy: { name: "asc" } }).catch(() => []),
        db.product.findMany({ include: { category: true, images: { orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []),
      ])
    : [[], []];

  return (
    <section>
      <h1 className="text-3xl font-black">Products</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[460px_1fr]">
        <form action={createProduct} className="grid h-fit gap-4 rounded-lg bg-white p-5 text-slate-950">
          <h2 className="text-xl font-black">Add product</h2>
          <select name="categoryId" required className="rounded-lg border px-4 py-3">
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input name="name" required placeholder="Name" className="rounded-lg border px-4 py-3" />
          <input name="slug" required placeholder="product-slug" className="rounded-lg border px-4 py-3" />
          <input name="shortDescription" required placeholder="Short description" className="rounded-lg border px-4 py-3" />
          <textarea
            name="description"
            required
            placeholder="Full SEO product description: benefits, size, use case, safety notes, and why parents should buy it."
            className="min-h-36 rounded-lg border px-4 py-3"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="price" required type="number" step="0.01" placeholder="Price" className="rounded-lg border px-4 py-3" />
            <input name="salePrice" type="number" step="0.01" placeholder="Sale price" className="rounded-lg border px-4 py-3" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="discountLabel" placeholder="Discount label" className="rounded-lg border px-4 py-3" />
            <input name="stock" required type="number" placeholder="Stock" className="rounded-lg border px-4 py-3" />
          </div>
          <input name="imageUrl" placeholder="Primary image URL" className="rounded-lg border px-4 py-3" />
          <textarea
            name="imageUrls"
            placeholder="More image URLs, one per line. These become the product gallery."
            className="min-h-24 rounded-lg border px-4 py-3"
          />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="featured" type="checkbox" value="true" />
            Featured
          </label>
          <button className="rounded-full bg-brand px-5 py-3 font-black text-white">Create product</button>
        </form>

        <div className="grid gap-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
              <h2 className="font-black">{product.name}</h2>
              <p className="text-sm text-slate-300">{product.category.name} - Stock {product.stock} - Images {product.images.length}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
