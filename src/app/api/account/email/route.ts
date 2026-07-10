import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { emailSchema } from "@/lib/validation";

const schema = z.object({
  email: emailSchema,
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const db = getDb();
  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { email: parsed.data.email, emailVerified: null },
  });

  return NextResponse.json({ ok: true });
}
