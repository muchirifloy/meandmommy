"use client";

import { useState } from "react";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const response = await fetch("/api/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(data.message || (response.ok ? "Check your email." : "Unable to create reset link."));
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <input name="email" type="email" required placeholder="Email address" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <button className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark">Send reset link</button>
      {message ? <p className="text-sm font-bold text-brand-dark">{message}</p> : null}
    </form>
  );
}

