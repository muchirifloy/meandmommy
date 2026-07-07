"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const response = await fetch("/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: searchParams.get("token"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Password updated. You can login now." : data.error || "Reset failed.");
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <input name="password" type="password" required minLength={8} placeholder="New password" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <button className="rounded-full bg-brand px-5 py-3 font-black text-white hover:bg-brand-dark">Reset password</button>
      {message ? <p className="text-sm font-bold text-brand-dark">{message}</p> : null}
    </form>
  );
}

