import { createCategory } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const categories = await getDb().category.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);

  return (
    <section>
      <h1 className="text-3xl font-black">Categories</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
        <form action={createCategory} className="grid h-fit gap-4 rounded-lg bg-white p-5 text-slate-950">
          <h2 className="text-xl font-black">Add category</h2>
          <input name="name" required placeholder="Name" className="rounded-lg border px-4 py-3" />
          <input name="slug" required placeholder="slug-example" className="rounded-lg border px-4 py-3" />
          <input name="imageUrl" placeholder="Image URL" className="rounded-lg border px-4 py-3" />
          <textarea name="description" required placeholder="Description" className="min-h-24 rounded-lg border px-4 py-3" />
          <button className="rounded-full bg-brand px-5 py-3 font-black text-white">Create category</button>
        </form>
        <div className="grid gap-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
              <h2 className="font-black">{category.name}</h2>
              <p className="text-sm text-slate-300">{category.slug}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

