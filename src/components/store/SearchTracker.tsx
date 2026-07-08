"use client";

import { useEffect } from "react";
import { trackCommerceEvent, type CommerceProductPayload } from "@/lib/tracking";

export function SearchTracker({
  query,
  products,
}: {
  query: string;
  products: CommerceProductPayload[];
}) {
  useEffect(() => {
    if (!query.trim()) return;
    trackCommerceEvent({ event: "search_product", query, products });
  }, [products, query]);

  return null;
}

