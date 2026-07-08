import { getDb } from "@/lib/db";

export type PublicStoreSettings = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  location: string;
  paymentMethod: string;
  taxEnabled: boolean;
  taxPercentage: number;
  logoUrl: string | null;
  faviconUrl: string | null;
  adminTwoFactor: boolean;
  staffTwoFactor: boolean;
  customerTwoFactor: boolean;
};

export const defaultStoreSettings: PublicStoreSettings = {
  storeName: "Me & Mommy",
  supportEmail: "info@meandmommy.co.ke",
  supportPhone: "+254 724 736495",
  location: "Nairobi, Kenya",
  paymentMethod: "M-Pesa Express",
  taxEnabled: false,
  taxPercentage: 0,
  logoUrl: null,
  faviconUrl: null,
  adminTwoFactor: false,
  staffTwoFactor: false,
  customerTwoFactor: false,
};

export async function getStoreSettings(): Promise<PublicStoreSettings> {
  try {
    const setting = await getDb().storeSetting.upsert({
      where: { id: "store" },
      update: {},
      create: {},
    });

    return {
      storeName: setting.storeName,
      supportEmail: setting.supportEmail,
      supportPhone: setting.supportPhone,
      location: setting.location,
      paymentMethod: setting.paymentMethod,
      taxEnabled: setting.taxEnabled,
      taxPercentage: Number(setting.taxPercentage),
      logoUrl: setting.logoUrl,
      faviconUrl: setting.faviconUrl,
      adminTwoFactor: setting.adminTwoFactor,
      staffTwoFactor: setting.staffTwoFactor,
      customerTwoFactor: setting.customerTwoFactor,
    };
  } catch {
    return defaultStoreSettings;
  }
}

export function calculateTax(subtotal: number, settings: Pick<PublicStoreSettings, "taxEnabled" | "taxPercentage">) {
  if (!settings.taxEnabled || settings.taxPercentage <= 0) return 0;
  return Math.round(subtotal * (settings.taxPercentage / 100) * 100) / 100;
}
