import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "../../../../../prisma/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim();
}

function redactSecrets(value: string) {
  return value.replace(/mysql:\/\/[^@\s]+@/g, "mysql://***:***@");
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.SEED_RUN_TOKEN;
  const receivedToken = getBearerToken(request);

  if (!expectedToken) {
    return NextResponse.json({ error: "Seed route is disabled." }, { status: 404 });
  }

  if (!receivedToken || receivedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await seedDatabase();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown seed error.";
    return NextResponse.json(
      {
        error: "Seed failed.",
        detail: redactSecrets(message),
      },
      { status: 500 },
    );
  }
}
