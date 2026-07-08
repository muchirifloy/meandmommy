import Image from "next/image";
import { Archive, ImagePlus, Pencil, Plus, Star } from "lucide-react";
import { archiveProduct, createProduct, updateProduct } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

function money(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

type CategoryOption = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: CategoryOption[];
  product?: {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: unknown;
    salePrice: unknown;
    discountLabel: string | null;
    stock: number;
    featured: boolean;
    images: { url: string }[];
  };
};

function ProductForm({ categories, product }: ProductFormProps) {
  const isEditing = Boolean(product);
  const action = isEditing ? updateProduct : createProduct;

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
      <div className="flex items-center gap-2">
        {isEditing ? <Pencil className="h-5 w-5 text-brand-dark" /> : <Plus className="h-5 w-5 text-brand-dark" />}
        <h2 className="text-lg font-black">{isEditing ? "Edit product" : "Add product"}</h2>
      </div>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <select name="categoryId" required defaultValue={product?.categoryId || ""} className="rounded-lg border border-slate-200 px-4 py-3">
        <option value="">Choose category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required defaultValue={product?.name} placeholder="Name" className="rounded-lg border border-slate-200 px-4 py-3" />
        <input name="slug" required defaultValue={product?.slug} placeholder="product-slug" className="rounded-lg border border-slate-200 px-4 py-3" />
      </div>
      <input name="shortDescription" required defaultValue={product?.shortDescription} placeholder="Short selling description" className="rounded-lg border border-slate-200 px-4 py-3" />
      <textarea
        name="description"
        required
        defaultValue={product?.description}
        placeholder="Full SEO product description, benefits, how to use, care notes, and parent-focused selling points."
        className="min-h-32 rounded-lg border border-slate-200 px-4 py-3"
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <input name="price" required type="number" step="0.01" defaultValue={product ? Number(product.price) : undefined} placeholder="Price" className="rounded-lg border border-slate-200 px-4 py-3" />
        <input name="salePrice" type="number" step="0.01" defaultValue={product?.salePrice ? Number(product.salePrice) : undefined} placeholder="Sale price" className="rounded-lg border border-slate-200 px-4 py-3" />
        <input name="discountLabel" defaultValue={product?.discountLabel || ""} placeholder="Discount label" className="rounded-lg border border-slate-200 px-4 py-3" />
        <input name="stock" required type="number" defaultValue={product?.stock ?? 0} placeholder="Stock" className="rounded-lg border border-slate-200 px-4 py-3" />
      </div>
      <div className="rounded-lg border border-dashed border-brand/40 bg-sky-50 p-4">
        <div className="flex items-center gap-2 font-black text-slate-950">
          <ImagePlus className="h-5 w-5 text-brand-dark" />
          Product images
        </div>
        <input name="imageUrl" defaultValue={product?.images[0]?.url || ""} placeholder="Primary image URL or leave blank if uploading" className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3" />
        <textarea
          name="imageUrls"
          defaultValue={product?.images.slice(1).map((image) => image.url).join("\n") || ""}
          placeholder="Extra image URLs, one per line."
          className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 bg-white px-4 py-3"
        />
        <input name="images" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="mt-3 block w-full rounded-lg bg-white px-4 py-3 text-sm" />
        <p className="mt-2 text-xs font-semibold text-slate-500">Uploads are saved into the database as product gallery images. Use compressed images under 1MB each.</p>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input name="featured" type="checkbox" value="true" defaultChecked={product?.featured} />
        Featured product
      </label>
      <button className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark">
        {isEditing ? "Save product" : "Create product"}
      </button>
    </form>
  );
}

export default async function AdminProductsPage() {
  const db = getOptionalDb();
  const [categories, products] = db
    ? await Promise.all([
        db.category.findMany({ orderBy: { name: "asc" } }).catch(() => []),
        db.product
          .findMany({
            include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
            orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
            take: 80,
          })
          .catch(() => []),
      ])
    : [[], []];

  const lowStock = products.filter((product) => product.stock <= 10).length;
  const active = products.filter((product) => product.isActive).length;
  const featured = products.filter((product) => product.featured).length;

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Product Management</p>
          <h1 className="text-3xl font-black text-slate-950">Products, stock, variants & images</h1>
          <p className="mt-2 text-sm text-slate-500">Add, edit, archive, feature, price, discount, and upload multiple product images.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Active products", active],
          ["Total products", products.length],
          ["Featured", featured],
          ["Low stock", lowStock],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <ProductForm categories={categories} />

        <div className="grid gap-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[96px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                  {product.images[0]?.url ? (
                    <Image src={product.images[0].url} alt={product.name} fill sizes="96px" className="object-cover" unoptimized={product.images[0].url.startsWith("data:")} />
                  ) : null}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-950">{product.name}</h2>
                    {product.featured ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" /> : null}
                    {!product.isActive ? <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500">Archived</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{product.category.name} - Stock {product.stock} - Images {product.images.length}</p>
                  <p className="mt-2 text-sm font-black text-brand-dark">
                    {money(Number(product.salePrice || product.price))}
                    {product.salePrice ? <span className="ml-2 text-xs text-slate-400 line-through">{money(Number(product.price))}</span> : null}
                  </p>
                </div>
                <form action={archiveProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:border-red-200 hover:text-red-600">
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                </form>
              </div>
              <details className="mt-4 rounded-lg bg-slate-50 p-4">
                <summary className="cursor-pointer font-black text-slate-950">Edit product details</summary>
                <div className="mt-4">
                  <ProductForm categories={categories} product={product} />
                </div>
              </details>
            </article>
          ))}
          {!products.length ? <p className="rounded-lg bg-white p-6 text-slate-500 shadow-sm">No products yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
