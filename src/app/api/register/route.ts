import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ||
          "Please enter a valid name, email, and password.",
      },
      { status: 400 },
    );
  }

  try {
    const email = parsed.data.email;
    const db = getDb();
    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }

    await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        phone: parsed.data.phone || null,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Account creation is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}
