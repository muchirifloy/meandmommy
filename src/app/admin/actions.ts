"use server";

import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { escapeHtml, sendEmail } from "@/lib/email";
import { auditLog } from "@/lib/security";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login");
}

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(8),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(6),
  description: z.string().min(12),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().or(z.literal("")),
  discountLabel: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  featured: z.coerce.boolean().optional(),
});

const offerSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).transform((value) => value.trim().toUpperCase()),
  description: z.string().min(5),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().positive(),
  audience: z.enum(["FIRST_ORDER", "ONCE_PER_CUSTOMER", "EVERYONE"]),
  isActive: z.coerce.boolean().optional(),
  showOnHome: z.coerce.boolean().optional(),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  await getDb().category.create({
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse(Object.fromEntries(formData));
  await getDb().product.create({
    data: {
      name: parsed.name,
      slug: parsed.slug,
      categoryId: parsed.categoryId,
      shortDescription: parsed.shortDescription,
      description: parsed.description,
      price: parsed.price,
      salePrice: parsed.salePrice === "" ? null : parsed.salePrice,
      discountLabel: parsed.discountLabel || null,
      stock: parsed.stock,
      featured: Boolean(parsed.featured),
      images: parsed.imageUrl
        ? {
            create: [{ url: parsed.imageUrl, alt: parsed.name, sortOrder: 1 }],
          }
        : undefined,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  await getDb().order.update({
    where: { id },
    data: { status: status as never },
  });
  revalidatePath("/admin/orders");
}

export async function updateUserRole(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login");
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "CUSTOMER") as Role;
  await getDb().user.update({ where: { id }, data: { role } });
  await auditLog({ actorId: session.user.id, action: "USER_ROLE_UPDATED", entity: "User", entityId: id, metadata: { role } });
  revalidatePath("/admin/members");
}

export async function updateTicketStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "OPEN");
  await getDb().supportTicket.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/admin/support");
}

export async function updateReviewStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "PENDING");
  await getDb().review.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await getDb().review.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function verifyPayment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const receiptNumber = String(formData.get("receiptNumber") || "");
  const payment = await getDb().payment.update({
    where: { id },
    data: {
      status: "SUCCESS",
      receiptNumber,
      resultDescription: "Manually verified by admin",
    },
  });
  await getDb().order.update({ where: { id: payment.orderId }, data: { status: "PAID" } });
  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
}

export async function createCampaign(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login");
  await getDb().emailCampaign.create({
    data: {
      createdById: session.user.id,
      subject: String(formData.get("subject") || ""),
      preview: String(formData.get("preview") || ""),
      body: String(formData.get("body") || ""),
      audience: String(formData.get("audience") || "ALL_CUSTOMERS"),
      status: "DRAFT",
    },
  });
  revalidatePath("/admin/campaigns");
}

export async function sendCampaign(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login");

  const id = String(formData.get("id") || "");
  const db = getDb();
  const campaign = await db.emailCampaign.findUniqueOrThrow({ where: { id } });
  const recentDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);
  const where =
    campaign.audience === "RECENT_CUSTOMERS"
      ? { role: Role.CUSTOMER, orders: { some: { createdAt: { gte: recentDate } } } }
      : campaign.audience === "NO_ORDERS"
        ? { role: Role.CUSTOMER, orders: { none: {} } }
        : { role: Role.CUSTOMER };

  const recipients = await db.user.findMany({
    where,
    select: { email: true, name: true },
    take: 1000,
  });
  const body = escapeHtml(campaign.body).replace(/\n/g, "<br />");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";

  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      subject: campaign.subject,
      preview: campaign.preview,
      text: campaign.body,
      html: `<p>Hello <strong>${escapeHtml(recipient.name || "there")}</strong>,</p><p>${body}</p><p><a href="${escapeHtml(siteUrl)}" style="display:inline-block;background:#55aee2;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:800;">Shop Me & Mommy</a></p>`,
    });
  }

  await db.emailCampaign.update({
    where: { id },
    data: { status: "SENT", sentAt: new Date() },
  });
  await auditLog({
    actorId: session.user.id,
    action: "EMAIL_CAMPAIGN_SENT",
    entity: "EmailCampaign",
    entityId: id,
    metadata: { recipients: recipients.length, audience: campaign.audience },
  });
  revalidatePath("/admin/campaigns");
}

export async function upsertOffer(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login");
  const id = String(formData.get("id") || "");
  const parsed = offerSchema.parse(Object.fromEntries(formData));
  const data = {
    ...parsed,
    isActive: Boolean(parsed.isActive),
    showOnHome: Boolean(parsed.showOnHome),
  };

  if (id) {
    await getDb().offer.update({ where: { id }, data });
  } else {
    await getDb().offer.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/offers");
}

export async function emailTicketReport() {
  await requireAdmin();
  const db = getDb();
  const [open, inProgress, resolved, closed] = await Promise.all([
    db.supportTicket.count({ where: { status: "OPEN" } }),
    db.supportTicket.count({ where: { status: "IN_PROGRESS" } }),
    db.supportTicket.count({ where: { status: "RESOLVED" } }),
    db.supportTicket.count({ where: { status: "CLOSED" } }),
  ]);

  await sendEmail({
    to: process.env.SUPPORT_EMAIL || "info@meandmommy.co.ke",
    subject: "Me & Mommy customer support ticket report",
    preview: "Open, in-progress, resolved, and closed support ticket summary.",
    text: `Support ticket report\nOpen: ${open}\nIn progress: ${inProgress}\nResolved: ${resolved}\nClosed: ${closed}`,
    html: `<h2 style="margin:0 0 12px;">Customer Support Report</h2><p><strong>Open:</strong> ${open}</p><p><strong>In progress:</strong> ${inProgress}</p><p><strong>Resolved:</strong> ${resolved}</p><p><strong>Closed:</strong> ${closed}</p>`,
  });
}
