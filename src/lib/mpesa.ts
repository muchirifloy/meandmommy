import { z } from "zod";

const mpesaEnvSchema = z.object({
  MPESA_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  MPESA_CONSUMER_KEY: z.string().min(1),
  MPESA_CONSUMER_SECRET: z.string().min(1),
  MPESA_SHORTCODE: z.string().min(1),
  MPESA_PASSKEY: z.string().min(1),
  MPESA_CALLBACK_URL: z.string().url(),
});

function getMpesaConfig() {
  return mpesaEnvSchema.parse({
    MPESA_ENV: process.env.MPESA_ENV || "sandbox",
    MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
    MPESA_SHORTCODE: process.env.MPESA_SHORTCODE,
    MPESA_PASSKEY: process.env.MPESA_PASSKEY,
    MPESA_CALLBACK_URL: process.env.MPESA_CALLBACK_URL,
  });
}

function baseUrl(env: "sandbox" | "production") {
  return env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
}

export function normalizeMpesaPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;
  throw new Error("Use a valid Kenyan M-Pesa phone number.");
}

async function getAccessToken() {
  const config = getMpesaConfig();
  const credentials = Buffer.from(`${config.MPESA_CONSUMER_KEY}:${config.MPESA_CONSUMER_SECRET}`).toString("base64");
  const response = await fetch(`${baseUrl(config.MPESA_ENV)}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to authenticate with M-Pesa.");
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function requestStkPush({
  amount,
  phone,
  orderNumber,
}: {
  amount: number;
  phone: string;
  orderNumber: string;
}) {
  const config = getMpesaConfig();
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${config.MPESA_SHORTCODE}${config.MPESA_PASSKEY}${timestamp}`).toString("base64");
  const token = await getAccessToken();
  const normalizedPhone = normalizeMpesaPhone(phone);

  const response = await fetch(`${baseUrl(config.MPESA_ENV)}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: config.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: normalizedPhone,
      PartyB: config.MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: config.MPESA_CALLBACK_URL,
      AccountReference: orderNumber,
      TransactionDesc: `Me & Mommy order ${orderNumber}`,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.errorMessage || "M-Pesa STK request failed.");
  return data as {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
  };
}

