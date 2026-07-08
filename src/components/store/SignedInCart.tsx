"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

type SignedInCartItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  categoryName?: string;
  stock?: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type SignedInCartProps = {
  initialItems: SignedInCartItem[];
  taxEnabled: boolean;
  taxPercentage: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SignedInCart({ initialItems, taxEnabled, taxPercentage }: SignedInCartProps) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState("");
  const [isPending, startTransition] = useTransition();

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );
  const tax = taxEnabled ? Math.round(subtotal * (taxPercentage / 100) * 100) / 100 : 0;
  const total = subtotal + tax;

  function updateQuantity(itemId: string, quantity: number) {
    setPendingId(itemId);
    startTransition(async () => {
      const previous = items;
      const optimistic = previous
        .map((item) => (item.id === itemId ? { ...item, quantity, lineTotal: item.unitPrice * quantity } : item))
        .filter((item) => item.quantity > 0);
      setItems(optimistic);

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      const cart = await response.json().catch(() => null);
      if (response.ok && cart?.items) {
        setItems(cart.items);
      } else {
        setItems(previous);
      }
      setPendingId("");
    });
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-sky-100 sm:grid-cols-[86px_1fr_auto] sm:p-4">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={112}
              height={90}
              className="aspect-[4/3] w-full rounded-md object-cover sm:w-[86px]"
              unoptimized={item.imageUrl.startsWith("data:")}
            />
            <div className="min-w-0">
              <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-black text-slate-950 hover:text-brand-dark sm:text-base">
                {item.name}
              </Link>
              <p className="mt-1 text-xs font-semibold text-slate-500">{formatPrice(item.unitPrice)} each</p>
              <div className="mt-3 inline-flex h-9 items-center rounded-full border border-sky-100 bg-white">
                <button
                  type="button"
                  className="h-full px-3 text-base font-black text-slate-700 disabled:opacity-40"
                  disabled={Boolean(pendingId) || item.quantity <= 1}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label={`Reduce ${item.name}`}
                >
                  -
                </button>
                <span className="min-w-9 text-center text-sm font-black">{item.quantity}</span>
                <button
                  type="button"
                  className="h-full px-3 text-base font-black text-slate-700 disabled:opacity-40"
                  disabled={Boolean(pendingId)}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label={`Add another ${item.name}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="ml-3 text-xs font-black text-slate-400 hover:text-rose-600 disabled:opacity-40"
                disabled={Boolean(pendingId)}
                onClick={() => updateQuantity(item.id, 0)}
              >
                Remove
              </button>
            </div>
            <p className="text-sm font-black text-brand-dark sm:text-right">{formatPrice(item.unitPrice * item.quantity)}</p>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-lg bg-white p-5 shadow-sm ring-1 ring-sky-100">
        <h2 className="text-lg font-black text-slate-950">Summary</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex justify-between text-slate-700">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          {taxEnabled ? (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({taxPercentage}%)</span>
              <strong>{formatPrice(tax)}</strong>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-sky-100 pt-3 text-base text-slate-950">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
        <Link href="/checkout" className="mt-5 flex justify-center rounded-full bg-brand px-6 py-3 text-sm font-black text-white">
          Checkout with M-Pesa
        </Link>
        {isPending ? <p className="mt-3 text-center text-xs font-bold text-slate-500">Updating cart...</p> : null}
      </aside>
    </div>
  );
}
