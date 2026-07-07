"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function RegisterForm() {
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
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
      return;
    }

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/account",
    });
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <form action={submit} className="grid gap-4">
        <input name="name" required placeholder="Full name" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="phone" placeholder="Phone number" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        <input name="password" type="password" required minLength={8} placeholder="Password" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
        <button className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark">Create Account</button>
      </form>
    </div>
  );
}

