"use client";

export type CommerceEventName =
  | "view_product"
  | "search_product"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

export type CommerceProductPayload = {
  id: string;
  name: string;
  price: number;
  category: string;
  stockStatus: "in_stock" | "out_of_stock";
  url: string;
  description?: string;
};

type CommerceEventPayload = {
  event: CommerceEventName;
  product?: CommerceProductPayload;
  products?: CommerceProductPayload[];
  query?: string;
  value?: number;
  currency?: "KES";
  orderNumber?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function productPayload(product: {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  categoryName: string;
  shortDescription?: string;
}) {
  return {
    id: product.id,
    name: product.name,
    price: product.salePrice || product.price,
    category: product.categoryName,
    stockStatus: product.stock > 0 ? "in_stock" : "out_of_stock",
    url: `${window.location.origin}/product/${product.slug}`,
    description: product.shortDescription,
  } satisfies CommerceProductPayload;
}

export function trackCommerceEvent(payload: CommerceEventPayload) {
  if (typeof window === "undefined") return;
  const eventMap: Record<CommerceEventName, { ga: string; meta: string }> = {
    view_product: { ga: "view_item", meta: "ViewContent" },
    search_product: { ga: "search", meta: "Search" },
    add_to_cart: { ga: "add_to_cart", meta: "AddToCart" },
    begin_checkout: { ga: "begin_checkout", meta: "InitiateCheckout" },
    purchase: { ga: "purchase", meta: "Purchase" },
  };

  const ecommerce = {
    currency: payload.currency || "KES",
    value: payload.value,
    search_term: payload.query,
    transaction_id: payload.orderNumber,
    items: (payload.products || (payload.product ? [payload.product] : [])).map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      stock_status: item.stockStatus,
      item_url: item.url,
      description: item.description,
    })),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: payload.event, ecommerce });
  window.dataLayer.push({ event: eventMap[payload.event].ga, ecommerce });
  window.gtag?.("event", eventMap[payload.event].ga, ecommerce);
  window.fbq?.("track", eventMap[payload.event].meta, {
    content_ids: ecommerce.items.map((item) => item.item_id),
    content_name: ecommerce.items[0]?.item_name,
    content_category: ecommerce.items[0]?.item_category,
    content_type: "product",
    currency: ecommerce.currency,
    value: ecommerce.value,
    search_string: ecommerce.search_term,
  });

  window
    .fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, path: window.location.pathname }),
      keepalive: true,
    })
    .catch(() => {});
}
