import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function auditLog({
  actorId,
  action,
  entity,
  entityId,
  metadata,
}: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await getDb().auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch {
    // Auditing should not break the customer-facing request path.
  }
}
