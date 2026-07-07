import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { escapeHtml, sendEmail } from "@/lib/email";
import { createSecureToken, hashToken } from "@/lib/security";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const user = await getDb().user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (user) {
    const token = createSecureToken();
    await getDb().passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your Me & Mommy password",
      text: `Reset your Me & Mommy password using this secure link: ${resetUrl}`,
      preview: "Use this secure link to reset your Me & Mommy password.",
      html: `<p>Hello <strong>${escapeHtml(user.name || "there")}</strong>,</p><p>Reset your Me & Mommy password using this secure link:</p><p><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#55aee2;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:800;">Reset password</a></p><p style="font-size:13px;color:#64748b;">This link expires in 30 minutes. If you did not request it, you can ignore this email.</p>`,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "If the email exists, a reset link will be sent.",
  });
}
