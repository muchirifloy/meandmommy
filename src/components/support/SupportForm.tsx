"use client";

import { useState } from "react";
import { BrandLoader } from "@/components/store/BrandLoader";

export function SupportForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    setMessage(response.ok ? "Support request received. We will respond soon." : data.error || "Unable to send.");
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <input name="name" required placeholder="Your name" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="subject" required placeholder="Subject" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <textarea name="message" required placeholder="How can we help?" className="min-h-32 rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <button disabled={loading} className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark disabled:opacity-60">
        {loading ? <BrandLoader label="Sending..." /> : "Send support request"}
      </button>
      {message ? <p className="text-sm font-bold text-brand-dark">{message}</p> : null}
    </form>
  );
}
