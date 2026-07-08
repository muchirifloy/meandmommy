import { OrderStatus, PaymentProvider } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { createCheckoutOrder } from "@/lib/checkout";
import { normalizeMpesaPhone, requestStkPush } from "@/lib/mpesa";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete all checkout details." }, { status: 400 });

  let mpesaPhone: string;
  try {
    mpesaPhone = normalizeMpesaPhone(parsed.data.phone);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid phone number." }, { status: 400 });
  }

  const db = getDb();
  const created = await createCheckoutOrder({
      userId: session.user.id,
      status: OrderStatus.PENDING_PAYMENT,
      provider: PaymentProvider.MPESA,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: mpesaPhone,
      address: parsed.data.address,
      city: parsed.data.city,
      notes: parsed.data.notes,
      voucherCode: parsed.data.voucherCode,
  });
  if ("error" in created) return NextResponse.json({ error: created.error }, { status: 400 });

  try {
    const stk = await requestStkPush({
      amount: created.total,
      phone: mpesaPhone,
      orderNumber: created.order.orderNumber,
    });

    await db.payment.update({
      where: { id: created.order.payments[0].id },
      data: {
        merchantRequestId: stk.MerchantRequestID,
        checkoutRequestId: stk.CheckoutRequestID,
        resultCode: stk.ResponseCode,
        resultDescription: stk.ResponseDescription,
      },
    });

    return NextResponse.json({ ok: true, orderNumber: created.order.orderNumber, checkoutRequestId: stk.CheckoutRequestID });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to start M-Pesa checkout.",
        orderNumber: created.order.orderNumber,
      },
      { status: 502 },
    );
  }
}
