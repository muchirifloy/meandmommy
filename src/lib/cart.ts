import { getDb } from "@/lib/db";

export async function getCart(userId: string) {
  const db = getDb();
  const cart = await db.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const items = cart.items.map((item) => {
    const unitPrice = Number(item.product.salePrice || item.product.price);
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      imageUrl: item.product.images[0]?.url || item.product.category.imageUrl || "/images/me-and-mommy-logo.png",
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });

  return {
    id: cart.id,
    items,
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

