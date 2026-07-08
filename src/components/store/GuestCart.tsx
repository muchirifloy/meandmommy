"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getGuestCart, saveGuestCart, type GuestCartItem } from "@/lib/guest-cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function GuestCart() {
  const [items, setItems] = useState<GuestCartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getGuestCart());
    sync();
    window.addEventListener("guest-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("guest-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  function updateQuantity(id: string, quantity: number) {
    const next = items
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    setItems(next);
    saveGuestCart(next);
  }

  if (!items.length) {
    return (
      <div className="mt-8 rounded-lg bg-white p-8 shadow-sm ring-1 ring-sky-100">
        <p className="text-slate-600">Your cart is empty.</p>
        <Link href="/" className="mt-5 inline-flex rounded-full bg-brand px-6 py-3 font-black text-white">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-sky-100 sm:grid-cols-[86px_1fr_auto] sm:p-4">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={120}
              height={96}
              className="aspect-[4/3] w-full rounded-md object-cover sm:w-[86px]"
            />
            <div className="min-w-0">
              <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-black text-slate-950 hover:text-brand-dark sm:text-base">
                {item.name}
              </Link>
              <p className="mt-1 text-xs font-semibold text-slate-500">{formatPrice(item.unitPrice)} each</p>
              <div className="mt-3 inline-flex h-9 items-center rounded-full border border-sky-100">
                <button className="h-full px-3 text-base font-black" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <span className="min-w-9 text-center text-sm font-black">{item.quantity}</span>
                <button className="h-full px-3 text-base font-black" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <p className="text-sm font-black text-brand-dark sm:text-right">{formatPrice(item.unitPrice * item.quantity)}</p>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-lg bg-white p-5 shadow-sm ring-1 ring-sky-100">
        <h2 className="text-lg font-black text-slate-950">Summary</h2>
        <div className="mt-4 flex justify-between text-slate-700">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <Link
          href="/login?callbackUrl=/checkout"
          className="mt-6 flex justify-center rounded-full bg-brand px-6 py-3 text-center font-black text-white"
        >
          Sign in to checkout
        </Link>
        <Link
          href="/register?callbackUrl=/checkout"
          className="mt-3 flex justify-center rounded-full border border-sky-100 px-6 py-3 text-center font-black text-brand-dark"
        >
          Create account
        </Link>
      </aside>
    </div>
  );
}
