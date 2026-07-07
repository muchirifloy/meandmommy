"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { BrandLoader } from "@/components/store/BrandLoader";
import { mergeGuestCart } from "@/lib/guest-cart";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function callbackUrl() {
    return new URLSearchParams(window.location.search).get("callbackUrl") || "/account";
  }

  async function submit(formData: FormData) {
    setError("");
    setLoading(true);
    const nextUrl = callbackUrl();
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Registration failed.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: nextUrl,
    });

    if (result?.ok) {
      await mergeGuestCart();
      window.location.href = result.url || nextUrl;
      return;
    }

    setLoading(false);
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <form action={submit} className="grid gap-4">
        <input name="name" required placeholder="Full name" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="phone" placeholder="Phone number" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="password" type="password" required minLength={8} placeholder="Password" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
        <button disabled={loading} className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark disabled:opacity-60">
          {loading ? <BrandLoader label="Creating account..." /> : "Create Account"}
        </button>
      </form>
    </div>
  );
}
