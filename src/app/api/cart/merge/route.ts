import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { getDb, hasDatabaseUrl } from "@/lib/db";

const mergeSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(50),
    }),
  ).max(100),
});

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = mergeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });

  const db = getDb();
  const cart = await db.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  for (const item of parsed.data.items) {
    const product = await db.product.findFirst({ where: { id: item.productId, isActive: true } });
    if (!product) continue;

    await db.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
      update: { quantity: { increment: item.quantity } },
      create: { cartId: cart.id, productId: product.id, quantity: item.quantity },
    });
  }

  return NextResponse.json(await getCart(session.user.id));
}
