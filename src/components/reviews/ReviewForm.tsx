"use client";

import { useState } from "react";
import { BrandLoader } from "@/components/store/BrandLoader";

export function ReviewForm({ productId }: { productId?: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        name: formData.get("name"),
        location: formData.get("location"),
        rating: Number(formData.get("rating")),
        comment: formData.get("comment"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    setMessage(response.ok ? "Review submitted for approval." : data.error || "Unable to submit review.");
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <h2 className="text-xl font-black text-slate-950">Add a review</h2>
      <input name="name" required placeholder="Your name" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="location" placeholder="Location" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <select name="rating" defaultValue="5" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand">
        {[5, 4, 3, 2, 1].map((rating) => (
          <option key={rating} value={rating}>{rating} stars</option>
        ))}
      </select>
      <textarea name="comment" required placeholder="Share your experience" className="min-h-28 rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <button disabled={loading} className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark disabled:opacity-60">
        {loading ? <BrandLoader label="Submitting..." /> : "Submit review"}
      </button>
      {message ? <p className="text-sm font-bold text-brand-dark">{message}</p> : null}
    </form>
  );
}
