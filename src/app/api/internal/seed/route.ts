import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "../../../../../prisma/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim();
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

  await seedDatabase();

  return NextResponse.json({ ok: true });
}
