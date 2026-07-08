import { OrderStatus, PaymentProvider } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createCheckoutOrder } from "@/lib/checkout";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { checkoutSchema } from "@/lib/validation";

function money(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete all checkout details." }, { status: 400 });

  const created = await createCheckoutOrder({
    userId: session.user.id,
    status: OrderStatus.INCOMPLETE,
    provider: PaymentProvider.WHATSAPP,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    city: parsed.data.city,
    notes: parsed.data.notes ? `WhatsApp order. ${parsed.data.notes}` : "WhatsApp order.",
    voucherCode: parsed.data.voucherCode,
  });

  if ("error" in created) return NextResponse.json({ error: created.error }, { status: 400 });

  const itemLines = created.order.items
    .map((item) => `- ${item.name} x ${item.quantity}: ${money(Number(item.lineTotal))}`)
    .join("\n");

  const message = [
    "Hello Me & Mommy, I would like to complete this WhatsApp order.",
    "",
    `Order: ${created.order.orderNumber}`,
    `Name: ${parsed.data.fullName}`,
    `Phone: ${parsed.data.phone}`,
    `Email: ${parsed.data.email}`,
    `Delivery: ${parsed.data.address}, ${parsed.data.city}`,
    "",
    "Items:",
    itemLines,
    "",
    `Subtotal: ${money(created.cart.subtotal)}`,
    created.voucher.discount ? `Discount: -${money(created.voucher.discount)}` : null,
    created.tax ? `Tax: ${money(created.tax)}` : null,
    `Total: ${money(created.total)}`,
    parsed.data.notes ? `Notes: ${parsed.data.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return NextResponse.json({
    ok: true,
    orderNumber: created.order.orderNumber,
    whatsappUrl: buildWhatsAppUrl(message),
  });
}
