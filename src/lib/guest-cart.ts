"use client";

export type GuestCartProduct = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  unitPrice: number;
};

export type GuestCartItem = GuestCartProduct & {
  quantity: number;
};

const key = "me-and-mommy-guest-cart";

export function getGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    return (JSON.parse(window.localStorage.getItem(key) || "[]") as GuestCartItem[]).filter(
      (item) => item.id && item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function saveGuestCart(items: GuestCartItem[]) {
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("guest-cart-updated"));
}

export function addGuestCartItem(product: GuestCartProduct, quantity = 1) {
  const items = getGuestCart();
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...product, quantity });
  }

  saveGuestCart(items);
}

export function clearGuestCart() {
  window.localStorage.removeItem(key);
  window.dispatchEvent(new Event("guest-cart-updated"));
}

export async function mergeGuestCart() {
  const items = getGuestCart();
  if (!items.length) return;

  const response = await fetch("/api/cart/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    }),
  });

  if (response.ok) clearGuestCart();
}
