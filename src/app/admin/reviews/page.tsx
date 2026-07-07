import { ReviewStatus } from "@prisma/client";
import { deleteReview, updateReviewStatus } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export default async function AdminReviewsPage() {
  const reviews = await getDb().review.findMany({ include: { product: true }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []);

  return (
    <section>
      <h1 className="text-3xl font-black">Reviews</h1>
      <div className="mt-8 grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
            <h2 className="font-black">{review.name} · {review.rating} stars</h2>
            <p className="text-sm text-slate-300">{review.product?.name || "Store review"} · {review.status}</p>
            <p className="mt-3 max-w-2xl text-sm text-slate-200">{review.comment}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={updateReviewStatus} className="flex gap-2">
                <input type="hidden" name="id" value={review.id} />
                <select name="status" defaultValue={review.status} className="rounded-lg bg-white px-3 py-2 text-slate-950">
                  {Object.values(ReviewStatus).map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button className="rounded-lg bg-brand px-4 py-2 font-black text-white">Save</button>
              </form>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={review.id} />
                <button className="rounded-lg bg-red-500 px-4 py-2 font-black text-white">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {!reviews.length ? <p className="text-slate-300">No reviews submitted yet.</p> : null}
      </div>
    </section>
  );
}

