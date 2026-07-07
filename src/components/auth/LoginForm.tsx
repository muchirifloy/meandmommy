"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { mergeGuestCart } from "@/lib/guest-cart";

export function LoginForm() {
  const [error, setError] = useState("");

  function callbackUrl() {
    return new URLSearchParams(window.location.search).get("callbackUrl") || "/account";
  }

  async function submit(formData: FormData) {
    setError("");
    const nextUrl = callbackUrl();
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

    setError("Invalid email or password.");
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <form action={submit} className="grid gap-4">
        <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="password" type="password" required minLength={8} placeholder="Password" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
        <button className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark">Login</button>
      </form>
      <button
        onClick={() => signIn("google", { callbackUrl: callbackUrl() })}
        className="mt-3 w-full rounded-full border border-sky-100 px-5 py-3 font-black text-brand-dark hover:bg-sky-50"
      >
        Continue with Google
      </button>
    </div>
  );
}
