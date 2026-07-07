"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { BrandLoader } from "@/components/store/BrandLoader";
import { addGuestCartItem } from "@/lib/guest-cart";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    price: number;
    salePrice: number | null;
    discountLabel: string | null;
    stock: number;
    imageUrl: string;
    categoryName: string;
  };
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCard({ product }: ProductCardProps) {
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
      return;
    }

    addGuestCartItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      unitPrice: activePrice,
    });
    setState("added");
  }

  return (
    <article className="group overflow-hidden rounded-lg soft-card">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {product.discountLabel ? (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-brand-dark shadow">
              {product.discountLabel}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">{product.categoryName}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-2 min-h-12 text-base font-black leading-snug text-slate-950 hover:text-brand-dark">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{product.shortDescription}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-brand-dark">{formatPrice(activePrice)}</p>
            {product.salePrice ? (
              <p className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</p>
            ) : null}
          </div>
          <button
            onClick={addToCart}
            disabled={state === "adding" || product.stock < 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-sky-100 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            title="Add to cart"
          >
            {state === "adding" ? <BrandLoader label="" compact /> : <ShoppingCart className="h-5 w-5" />}
          </button>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-500">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        {state === "added" ? <p className="mt-2 text-sm font-bold text-brand-dark">Added to cart</p> : null}
      </div>
    </article>
  );
}
