import { createVideoGuide } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminVideosPage() {
  const db = getOptionalDb();
  const [products, videos] = db
    ? await Promise.all([
        db.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }).catch(() => []),
        db.videoGuide.findMany({ include: { product: true }, orderBy: { sortOrder: "asc" }, take: 50 }).catch(() => []),
      ])
    : [[], []];

  return (
    <section>
      <h1 className="text-3xl font-black">Video Guides</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
        Add short hosted videos, YouTube embeds, or future storage URLs. Posters load first so the storefront stays fast.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[460px_1fr]">
        <form action={createVideoGuide} className="grid h-fit gap-4 rounded-lg bg-white p-5 text-slate-950">
          <h2 className="text-xl font-black">Add video</h2>
          <input name="title" required placeholder="Short title" className="rounded-lg border px-4 py-3" />
          <input name="footnote" required placeholder="One-line footnote" className="rounded-lg border px-4 py-3" />
          <input name="url" required type="url" placeholder="Video URL or embed URL" className="rounded-lg border px-4 py-3" />
          <input name="posterUrl" type="url" placeholder="Poster image URL" className="rounded-lg border px-4 py-3" />
          <select name="productId" className="rounded-lg border px-4 py-3">
            <option value="">Global video</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <input name="sortOrder" type="number" placeholder="Sort order" className="rounded-lg border px-4 py-3" />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="isActive" type="checkbox" value="true" defaultChecked />
            Active
          </label>
          <button className="rounded-full bg-brand px-5 py-3 font-black text-white">Create video</button>
        </form>

        <div className="grid gap-3">
          {videos.map((video) => (
            <div key={video.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
              <h2 className="font-black">{video.title}</h2>
              <p className="mt-1 text-sm text-slate-300">{video.product?.name || "Global"} - {video.isActive ? "Active" : "Hidden"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{video.footnote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
