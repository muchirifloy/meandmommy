"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { BrandLoader } from "@/components/store/BrandLoader";
import { addGuestCartItem } from "@/lib/guest-cart";
import { productPayload, trackCommerceEvent } from "@/lib/tracking";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    salePrice: number | null;
    stock: number;
    categoryName: string;
    shortDescription?: string;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const activePrice = product.salePrice || product.price;

  async function addToCart() {
    setState("adding");
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    if (response.ok) {
      setState("added");
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { quantity: 1 } }));
      trackCommerceEvent({ event: "add_to_cart", product: productPayload(product), value: activePrice, currency: "KES" });
      return;
    }

    addGuestCartItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      unitPrice: activePrice,
    });
    trackCommerceEvent({ event: "add_to_cart", product: productPayload(product), value: activePrice, currency: "KES" });
    setState("added");
  }

  return (
    <button
      onClick={addToCart}
      disabled={state === "adding" || product.stock < 1}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-black text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {state === "adding" ? <BrandLoader label="" compact /> : <ShoppingCart className="h-5 w-5" />}
      {state === "added" ? "Added to cart" : "Add to cart"}
    </button>
  );
}
