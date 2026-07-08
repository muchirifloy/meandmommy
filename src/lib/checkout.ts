import { OrderStatus, PaymentProvider } from "@prisma/client";
import { getCart } from "@/lib/cart";
import { getDb } from "@/lib/db";
import { validateVoucher } from "@/lib/offers";
import { calculateTax, getStoreSettings } from "@/lib/settings";

export function orderNumber() {
  return `MM-${Date.now().toString(36).toUpperCase()}`;
}

export async function createCheckoutOrder({
  userId,
  fullName,
  email,
  phone,
  address,
  city,
  notes,
  voucherCode,
  status,
  provider,
}: {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
  voucherCode?: string | null;
  status: OrderStatus;
  provider: PaymentProvider;
}) {
  const cart = await getCart(userId);
  if (!cart.items.length) {
    return { error: "Cart is empty." as const };
  }

  const voucher = await validateVoucher({
    code: voucherCode,
    userId,
    subtotal: cart.subtotal,
  });

  if (voucherCode && !voucher.valid) {
    return { error: voucher.message || "Voucher code is not valid." };
  }

  const settings = await getStoreSettings();
  const taxableSubtotal = Math.max(0, cart.subtotal - voucher.discount);
  const tax = calculateTax(taxableSubtotal, settings);
  const total = taxableSubtotal + tax;
  const number = orderNumber();
  const deliveryAddress = `${address}, ${city}`;

  const order = await getDb().order.create({
    data: {
      orderNumber: number,
      userId,
      status,
      subtotal: cart.subtotal,
      shippingFee: tax,
      discountTotal: voucher.discount,
      total,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress,
      notes,
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
          provider,
          amount: total,
          phone,
        },
      },
      voucherRedemptions: voucher.offer
        ? {
            create: {
              offerId: voucher.offer.id,
              userId,
              code: voucher.offer.code,
              amount: voucher.discount,
            },
          }
        : undefined,
    },
    include: { items: true, payments: true },
  });

  return {
    order,
    cart,
    voucher,
    tax,
    total,
    settings,
  };
}
