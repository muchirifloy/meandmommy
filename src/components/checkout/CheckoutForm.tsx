"use client";

import { useState } from "react";
import { BrandLoader } from "@/components/store/BrandLoader";
import { trackCommerceEvent, type CommerceProductPayload } from "@/lib/tracking";

export function CheckoutForm({
  email,
  name,
  products,
  total,
}: {
  email?: string | null;
  name?: string | null;
  products: CommerceProductPayload[];
  total: number;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<"mpesa" | "whatsapp" | "">("");

  async function submit(formData: FormData) {
    const method = formData.get("checkoutMethod") === "whatsapp" ? "whatsapp" : "mpesa";
    setLoading(method);
    setMessage("");
    const response = await fetch(`/api/checkout/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        notes: formData.get("notes"),
        voucherCode: formData.get("voucherCode"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading("");

    if (!response.ok) {
      setMessage(data.error || "Checkout failed.");
      return;
    }

    if (method === "whatsapp") {
      setMessage(`Order ${data.orderNumber} recorded. WhatsApp is opening so you can complete it with support.`);
      trackCommerceEvent({ event: "purchase", products, value: total, currency: "KES", orderNumber: data.orderNumber });
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }

    trackCommerceEvent({ event: "purchase", products, value: total, currency: "KES", orderNumber: data.orderNumber });
    setMessage(`M-Pesa prompt sent. Complete payment for order ${data.orderNumber}.`);
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <input name="fullName" defaultValue={name || ""} required placeholder="Full name" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="email" type="email" defaultValue={email || ""} required placeholder="Email" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="phone" required placeholder="M-Pesa phone e.g. 0712345678" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="address" required placeholder="Delivery address" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="city" required placeholder="City" className="rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <input name="voucherCode" placeholder="Voucher code e.g. ME&MOMMY" className="rounded-lg border border-sky-100 px-4 py-3 uppercase outline-none focus:border-brand" />
      <textarea name="notes" placeholder="Delivery notes" className="min-h-24 rounded-lg border border-sky-100 px-4 py-3 outline-none focus:border-brand" />
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          name="checkoutMethod"
          value="mpesa"
          disabled={Boolean(loading)}
          className="rounded-full bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading === "mpesa" ? <BrandLoader label="Sending STK..." /> : "Pay with M-Pesa Express"}
        </button>
        <button
          name="checkoutMethod"
          value="whatsapp"
          disabled={Boolean(loading)}
          className="rounded-full bg-emerald-600 px-6 py-3 font-black text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading === "whatsapp" ? <BrandLoader label="Preparing WhatsApp..." /> : "Order through WhatsApp"}
        </button>
      </div>
      {message ? <p className="text-sm font-bold text-brand-dark">{message}</p> : null}
    </form>
  );
}
