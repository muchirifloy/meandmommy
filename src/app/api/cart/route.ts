import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { getDb } from "@/lib/db";

const cartMutationSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50).default(1),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });

  return NextResponse.json(await getCart(session.user.id));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = cartMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });

  const db = getDb();
  const product = await db.product.findFirst({
    where: { id: parsed.data.productId, isActive: true },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const cart = await db.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  await db.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    update: { quantity: { increment: parsed.data.quantity } },
    create: { cartId: cart.id, productId: product.id, quantity: parsed.data.quantity },
  });

  return NextResponse.json(await getCart(session.user.id));
}

