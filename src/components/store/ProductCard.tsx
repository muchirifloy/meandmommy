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
    <article className="group min-w-[185px] overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-sky-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 240px"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized={product.imageUrl.startsWith("data:")}
          />
          {product.discountLabel ? (
            <span className="absolute left-2 top-2 rounded bg-white px-2 py-1 text-[11px] font-black text-brand-dark shadow">
              {product.discountLabel}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-slate-950 hover:text-brand-dark">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-black text-brand-dark">{formatPrice(activePrice)}</p>
            {product.salePrice ? (
              <p className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</p>
            ) : null}
          </div>
          <button
            onClick={addToCart}
            disabled={state === "adding" || product.stock < 1}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            title="Add to cart"
          >
            {state === "adding" ? <BrandLoader label="" compact /> : <ShoppingCart className="h-5 w-5" />}
          </button>
        </div>
        {state === "added" ? <p className="mt-2 text-xs font-bold text-brand-dark">Added</p> : null}
      </div>
    </article>
  );
}
