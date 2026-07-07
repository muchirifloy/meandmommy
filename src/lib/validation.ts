import { z } from "zod";

const trimmed = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} is too short.`)
    .max(max, `${label} is too long.`);

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.");

export const registerSchema = z.object({
  name: trimmed(2, 80, "Name"),
  email: emailSchema,
  phone: z.string().trim().max(30, "Phone is too long.").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/[0-9]/, "Password must include a number."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Enter your password."),
});

export const contactSchema = z.object({
  name: trimmed(2, 80, "Name"),
  email: emailSchema,
  subject: trimmed(3, 120, "Subject"),
  message: trimmed(15, 1500, "Message"),
});

export const reviewSchema = z.object({
  productId: z.string().trim().optional(),
  name: trimmed(2, 80, "Name"),
  location: z.string().trim().max(80, "Location is too long.").optional(),
  rating: z.number().int().min(1).max(5),
  comment: trimmed(10, 800, "Review"),
});

export const checkoutSchema = z.object({
  fullName: trimmed(2, 80, "Full name"),
  email: emailSchema,
  phone: trimmed(9, 30, "Phone"),
  address: trimmed(8, 200, "Address"),
  city: trimmed(2, 80, "City"),
  notes: z.string().trim().max(500, "Notes are too long.").optional(),
  voucherCode: z.string().trim().max(40, "Voucher code is too long.").optional(),
});
