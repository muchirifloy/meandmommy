"use client";

import { useEffect } from "react";
import { trackCommerceEvent, type CommerceProductPayload } from "@/lib/tracking";

export function CheckoutTracker({
  products,
  total,
}: {
  products: CommerceProductPayload[];
  total: number;
}) {
  useEffect(() => {
    trackCommerceEvent({ event: "begin_checkout", products, value: total, currency: "KES" });
  }, [products, total]);

  return null;
}
