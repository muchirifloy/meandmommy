import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { escapeHtml, sendEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all support fields." }, { status: 400 });
  }

  const ticket = await getDb().supportTicket.create({
    data: {
      userId: session?.user?.id,
      ...parsed.data,
    },
  });

  await sendEmail({
    to: parsed.data.email,
    subject: `We received your Me & Mommy support request: ${parsed.data.subject}`,
    text: `Hello ${parsed.data.name}, we received your support request and will respond soon. Ticket ID: ${ticket.id}`,
    preview: "Your Me & Mommy support request has been received.",
    html: `<p>Hello <strong>${escapeHtml(parsed.data.name)}</strong>,</p><p>We received your support request and will respond soon.</p><p><strong>Ticket ID:</strong> ${escapeHtml(ticket.id)}</p><p>Subject: ${escapeHtml(parsed.data.subject)}</p>`,
  });

  if (process.env.SUPPORT_EMAIL) {
    await sendEmail({
      to: process.env.SUPPORT_EMAIL,
      subject: `New support ticket: ${parsed.data.subject}`,
      text: `${parsed.data.name} <${parsed.data.email}> wrote:\n\n${parsed.data.message}`,
      preview: "A new customer support ticket was submitted.",
      html: `<p><strong>${escapeHtml(parsed.data.name)}</strong> &lt;${escapeHtml(parsed.data.email)}&gt; wrote:</p><p>${escapeHtml(parsed.data.message).replace(/\n/g, "<br />")}</p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
