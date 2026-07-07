"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getGuestCart } from "@/lib/guest-cart";

export function HeaderCartLink({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const guestCount = () => getGuestCart().reduce((sum, item) => sum + item.quantity, 0);
    const syncGuest = () => setCount(Math.max(initialCount, guestCount()));
    const increment = (event: Event) => {
      const quantity = event instanceof CustomEvent ? Number(event.detail?.quantity || 1) : 1;
      setCount((value) => value + quantity);
    };

    syncGuest();
    window.addEventListener("guest-cart-updated", syncGuest);
    window.addEventListener("storage", syncGuest);
    window.addEventListener("cart-updated", increment);
    return () => {
      window.removeEventListener("guest-cart-updated", syncGuest);
      window.removeEventListener("storage", syncGuest);
      window.removeEventListener("cart-updated", increment);
    };
  }, [initialCount]);

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-sun text-slate-950 shadow-lg shadow-sky-950/10 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5"
      aria-label={`Cart${count ? `, ${count} items` : ""}`}
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="hidden text-sm font-black sm:inline">Cart</span>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-black leading-none text-white ring-2 ring-slate-950">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
