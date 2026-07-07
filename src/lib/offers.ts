import { DiscountType, OfferAudience } from "@prisma/client";
import { getDb } from "@/lib/db";

export type PublicOffer = {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  audience: OfferAudience;
  showOnHome: boolean;
};

export const defaultOffer: PublicOffer = {
  id: "default-me-and-mommy",
  name: "First Order Welcome Offer",
  code: "ME&MOMMY",
  description: "A little welcome gift for new Me & Mommy shoppers.",
  discountType: DiscountType.PERCENTAGE,
  discountValue: 5,
  audience: OfferAudience.FIRST_ORDER,
  showOnHome: true,
};

export async function getHomeOffer() {
  try {
    const now = new Date();
    const offer = await getDb().offer.findFirst({
      where: {
        isActive: true,
        showOnHome: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!offer) return null;

    return {
      id: offer.id,
      name: offer.name,
      code: offer.code,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: Number(offer.discountValue),
      audience: offer.audience,
      showOnHome: offer.showOnHome,
    };
  } catch {
    return defaultOffer;
  }
}

export async function validateVoucher({
  code,
  userId,
  subtotal,
}: {
  code?: string | null;
  userId: string;
  subtotal: number;
}) {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) return { valid: false, discount: 0, message: "", offer: null as PublicOffer | null };

  const db = getDb();
  const now = new Date();
  const offer = await db.offer.findFirst({
    where: {
      code: normalized,
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
  });

  if (!offer) return { valid: false, discount: 0, message: "Voucher code is not active.", offer: null };

  const [paidOrders, redemptions] = await Promise.all([
    db.order.count({
      where: {
        userId,
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
    }),
    db.voucherRedemption.count({ where: { userId, code: normalized } }),
  ]);

  if (offer.audience === "FIRST_ORDER" && paidOrders > 0) {
    return { valid: false, discount: 0, message: "This voucher is for first-time customers only.", offer: null };
  }

  if (offer.audience === "ONCE_PER_CUSTOMER" && redemptions > 0) {
    return { valid: false, discount: 0, message: "This voucher has already been used on your account.", offer: null };
  }

  const rawDiscount =
    offer.discountType === "PERCENTAGE"
      ? subtotal * (Number(offer.discountValue) / 100)
      : Number(offer.discountValue);
  const discount = Math.max(0, Math.min(subtotal, Math.round(rawDiscount * 100) / 100));

  return {
    valid: true,
    discount,
    message: `${offer.name} applied.`,
    offer: {
      id: offer.id,
      name: offer.name,
      code: offer.code,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: Number(offer.discountValue),
      audience: offer.audience,
      showOnHome: offer.showOnHome,
    },
  };
}
