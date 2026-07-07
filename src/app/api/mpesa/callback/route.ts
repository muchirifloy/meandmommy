import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type MpesaCallback = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: Array<{ Name: string; Value?: string | number }>;
      };
    };
  };
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as MpesaCallback;
  const callback = body.Body?.stkCallback;

  if (!callback?.CheckoutRequestID) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const receiptNumber = callback.CallbackMetadata?.Item?.find((item) => item.Name === "MpesaReceiptNumber")?.Value?.toString();
  const success = callback.ResultCode === 0;

  const payment = await getDb().payment.updateMany({
    where: { checkoutRequestId: callback.CheckoutRequestID },
    data: {
      status: success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
      receiptNumber,
      resultCode: callback.ResultCode?.toString(),
      resultDescription: callback.ResultDesc,
      rawCallback: body,
    },
  });

  if (payment.count > 0 && success) {
    const found = await getDb().payment.findFirst({
      where: { checkoutRequestId: callback.CheckoutRequestID },
    });
    if (found) {
      await getDb().order.update({
        where: { id: found.orderId },
        data: { status: OrderStatus.PAID },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

