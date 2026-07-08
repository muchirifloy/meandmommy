import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getOptionalDb } from "@/lib/db";

const trackingSchema = z.object({
  event: z.enum(["view_product", "search_product", "add_to_cart", "begin_checkout", "purchase"]),
  product: z
    .object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      category: z.string(),
      stockStatus: z.string(),
      url: z.string(),
      description: z.string().optional(),
    })
    .optional(),
  products: z.array(z.unknown()).optional(),
  query: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  orderNumber: z.string().optional(),
  path: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = trackingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const db = getOptionalDb();
  if (!db) return NextResponse.json({ ok: true });

  const session = await getServerSession(authOptions).catch(() => null);
  const headers = request.headers;

  await db.marketingEvent
    .create({
      data: {
        event: parsed.data.event,
        productId: parsed.data.product?.id,
        query: parsed.data.query,
        payload: JSON.parse(JSON.stringify(parsed.data)),
        path: parsed.data.path,
        userId: session?.user?.id,
        sessionId: headers.get("x-vercel-id") || headers.get("x-request-id"),
        userAgent: headers.get("user-agent"),
      },
    })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
