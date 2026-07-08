import Image from "next/image";
import { Archive, Tags } from "lucide-react";
import { archiveCategory, createCategory, updateCategory } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const db = getOptionalDb();
  const categories = db
    ? await db.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } }).catch(() => [])
    : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Catalog</p>
        <h1 className="text-2xl font-black text-slate-950">Categories</h1>
      </div>

      <details className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <summary className="cursor-pointer px-4 py-3 text-sm font-black text-slate-950">Add category</summary>
        <form action={createCategory} className="grid gap-3 border-t border-slate-100 p-4 md:grid-cols-2">
          <input name="name" required placeholder="Name" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="slug" required placeholder="slug-example" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="imageUrl" placeholder="Image URL" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="sortOrder" type="number" placeholder="Sort order" className="rounded-md border border-slate-200 px-3 py-2" />
          <textarea name="description" required placeholder="Description" className="min-h-20 rounded-md border border-slate-200 px-3 py-2 md:col-span-2" />
          <label className="flex items-center gap-2 text-sm font-bold"><input name="isActive" type="checkbox" value="true" defaultChecked /> Active</label>
          <button className="justify-self-start rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Create</button>
        </form>
      </details>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {categories.map((category) => (
          <details key={category.id} className="border-b border-slate-100 last:border-0">
            <summary className="grid cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 md:grid-cols-[54px_1fr_120px_100px_80px]">
              <div className="relative h-11 w-11 overflow-hidden rounded-md bg-slate-100">
                {category.imageUrl ? <Image src={category.imageUrl} alt={category.name} fill sizes="44px" className="object-cover" unoptimized={category.imageUrl.startsWith("data:")} /> : <Tags className="m-3 h-5 w-5 text-slate-400" />}
              </div>
              <div>
                <strong className="text-slate-950">{category.name}</strong>
                <p className="text-xs text-slate-500">{category.slug}</p>
              </div>
              <span>{category._count.products} products</span>
              <span className={category.isActive ? "font-bold text-emerald-600" : "font-bold text-slate-400"}>{category.isActive ? "Active" : "Hidden"}</span>
              <span className="text-xs font-black text-[#4285f4]">Edit</span>
            </summary>
            <div className="border-t border-slate-100 bg-slate-50 p-4">
              <form action={updateCategory} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={category.id} />
                <input name="name" defaultValue={category.name} className="rounded-md border border-slate-200 px-3 py-2" />
                <input name="slug" defaultValue={category.slug} className="rounded-md border border-slate-200 px-3 py-2" />
                <input name="imageUrl" defaultValue={category.imageUrl || ""} className="rounded-md border border-slate-200 px-3 py-2" />
                <input name="sortOrder" type="number" defaultValue={category.sortOrder} className="rounded-md border border-slate-200 px-3 py-2" />
                <textarea name="description" defaultValue={category.description} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 md:col-span-2" />
                <label className="flex items-center gap-2 text-sm font-bold"><input name="isActive" type="checkbox" value="true" defaultChecked={category.isActive} /> Active</label>
                <button className="justify-self-start rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Save category</button>
              </form>
              <form action={archiveCategory} className="mt-3">
                <input type="hidden" name="id" value={category.id} />
                <button className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-black text-red-600">
                  <Archive className="h-3.5 w-3.5" /> Hide category
                </button>
              </form>
            </div>
          </details>
        ))}
        {!categories.length ? <p className="p-5 text-sm text-slate-500">No categories yet.</p> : null}
      </div>
    </section>
  );
}
