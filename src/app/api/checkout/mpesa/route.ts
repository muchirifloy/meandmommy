import { OrderStatus, PaymentProvider } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { getDb } from "@/lib/db";
import { normalizeMpesaPhone, requestStkPush } from "@/lib/mpesa";
import { validateVoucher } from "@/lib/offers";
import { calculateTax, getStoreSettings } from "@/lib/settings";
import { checkoutSchema } from "@/lib/validation";

function orderNumber() {
  return `MM-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete all checkout details." }, { status: 400 });

  const cart = await getCart(session.user.id);
  if (!cart.items.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  const voucher = await validateVoucher({
    code: parsed.data.voucherCode,
    userId: session.user.id,
    subtotal: cart.subtotal,
  });

  if (parsed.data.voucherCode && !voucher.valid) {
    return NextResponse.json({ error: voucher.message }, { status: 400 });
  }

  let mpesaPhone: string;
  try {
    mpesaPhone = normalizeMpesaPhone(parsed.data.phone);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid phone number." }, { status: 400 });
  }

  const db = getDb();
  const number = orderNumber();
  const deliveryAddress = `${parsed.data.address}, ${parsed.data.city}`;
  const settings = await getStoreSettings();
  const taxableSubtotal = Math.max(0, cart.subtotal - voucher.discount);
  const tax = calculateTax(taxableSubtotal, settings);
  const total = taxableSubtotal + tax;

  const order = await db.order.create({
    data: {
      orderNumber: number,
      userId: session.user.id,
      status: OrderStatus.PENDING_PAYMENT,
      subtotal: cart.subtotal,
      shippingFee: 0,
      discountTotal: voucher.discount,
      total,
      customerName: parsed.data.fullName,
      customerEmail: parsed.data.email,
      customerPhone: mpesaPhone,
      deliveryAddress,
      notes: parsed.data.notes,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      },
      payments: {
        create: {
          provider: PaymentProvider.MPESA,
          amount: total,
          phone: mpesaPhone,
        },
      },
      voucherRedemptions: voucher.offer
        ? {
            create: {
              offerId: voucher.offer.id,
              userId: session.user.id,
              code: voucher.offer.code,
              amount: voucher.discount,
            },
          }
        : undefined,
    },
    include: { payments: true },
  });

  try {
    const stk = await requestStkPush({
      amount: total,
      phone: mpesaPhone,
      orderNumber: number,
    });

    await db.payment.update({
      where: { id: order.payments[0].id },
      data: {
        merchantRequestId: stk.MerchantRequestID,
        checkoutRequestId: stk.CheckoutRequestID,
        resultCode: stk.ResponseCode,
        resultDescription: stk.ResponseDescription,
      },
    });

    return NextResponse.json({ ok: true, orderNumber: number, checkoutRequestId: stk.CheckoutRequestID });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to start M-Pesa checkout.",
        orderNumber: number,
      },
      { status: 502 },
    );
  }
}
