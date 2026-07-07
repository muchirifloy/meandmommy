import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { reviewSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid review." }, { status: 400 });
  }

  await getDb().review.create({
    data: {
      userId: session?.user?.id,
      productId: parsed.data.productId || null,
      name: parsed.data.name,
      location: parsed.data.location,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  return NextResponse.json({ ok: true, message: "Review submitted for approval." });
}
