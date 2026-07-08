"use client";

import { useEffect } from "react";
import { productPayload, trackCommerceEvent } from "@/lib/tracking";

type ProductViewTrackerProps = {
  product: Parameters<typeof productPayload>[0];
};

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    trackCommerceEvent({ event: "view_product", product: productPayload(product) });
  }, [product]);

  return null;
}

