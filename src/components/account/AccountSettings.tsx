"use client";

import { useState } from "react";

export function AccountSettings({ email }: { email?: string | null }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  async function updateEmail(formData: FormData) {
    setLoading("email");
    setError("");
    setMessage("");
    const response = await fetch("/api/account/email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading("");
    if (!response.ok) {
      setError(data.error || "Email update failed.");
      return;
    }
    setMessage("Email updated. Please sign in again next time with the new address.");
  }

  async function updatePassword(formData: FormData) {
    setLoading("password");
    setError("");
    setMessage("");
    const response = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading("");
    if (!response.ok) {
      setError(data.error || "Password update failed.");
      return;
    }
    setMessage("Password updated successfully.");
  }

  return (
    <section className="container-shell mt-5">
      <details className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer text-lg font-black text-slate-950">Account settings</summary>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <form action={updateEmail} className="grid gap-3 rounded-lg bg-slate-50 p-3">
            <h3 className="font-black text-slate-950">Change email</h3>
            <input name="email" type="email" required defaultValue={email || ""} className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" />
            <button disabled={loading === "email"} className="justify-self-start rounded-full bg-brand px-4 py-2 text-xs font-black text-white disabled:opacity-60">
              {loading === "email" ? "Saving..." : "Save email"}
            </button>
          </form>
          <form action={updatePassword} className="grid gap-3 rounded-lg bg-slate-50 p-3">
            <h3 className="font-black text-slate-950">Change password</h3>
            <input name="currentPassword" type="password" placeholder="Current password" className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" />
            <input name="newPassword" type="password" required minLength={8} placeholder="New password" className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand" />
            <button disabled={loading === "password"} className="justify-self-start rounded-full bg-brand px-4 py-2 text-xs font-black text-white disabled:opacity-60">
              {loading === "password" ? "Saving..." : "Save password"}
            </button>
          </form>
        </div>
        {message ? <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</p> : null}
      </details>
    </section>
  );
}
