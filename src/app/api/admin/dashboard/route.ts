import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOptionalDb } from "@/lib/db";

function startOfMonth(offset = 0) {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function analyticsStart(period: string) {
  const date = new Date();
  if (period === "day") return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (period === "week") {
    const start = new Date(date);
    start.setDate(date.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  return startOfMonth(0);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const orderPeriod = url.searchParams.get("orderPeriod") || "week";
  const productPeriod = url.searchParams.get("productPeriod") || "month";
  const orderAnalyticsStart = analyticsStart(orderPeriod);
  const productAnalyticsStart = analyticsStart(productPeriod);

  try {
    const db = getOptionalDb();
    if (!db) throw new Error("Database not configured.");

    const revenueStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] as const;
    const currentStart = startOfMonth(0);
    const nextStart = startOfMonth(1);
    const previousStart = startOfMonth(-1);

    const [
      products,
      categories,
      customers,
      orders,
      lowStock,
      currentOrders,
      previousOrders,
      openTickets,
      closedTickets,
      pendingPayments,
      pendingOrders,
      orderItems,
      lowStockProducts,
      recentOrders,
      recentLogs,
      analyticsOrders,
      analyticsItems,
    ] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.count(),
      db.product.count({ where: { stock: { lte: 5 } } }),
      db.order.findMany({
        where: { createdAt: { gte: currentStart, lt: nextStart }, status: { in: [...revenueStatuses] } },
        select: { total: true },
      }),
      db.order.findMany({
        where: { createdAt: { gte: previousStart, lt: currentStart }, status: { in: [...revenueStatuses] } },
        select: { total: true },
      }),
      db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      db.supportTicket.count({ where: { status: { in: ["RESOLVED", "CLOSED"] } } }),
      db.payment.count({ where: { status: "PENDING" } }),
      db.order.findMany({
        where: { status: { in: ["INCOMPLETE", "PENDING_PAYMENT"] } },
        select: { total: true },
      }),
      db.orderItem.findMany({ take: 500, orderBy: { order: { createdAt: "desc" } } }),
      db.product.findMany({
        where: { stock: { lte: 10 } },
        select: { name: true, stock: true },
        orderBy: { stock: "asc" },
        take: 8,
      }),
      db.order.findMany({
        select: { orderNumber: true, customerName: true, status: true, total: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.auditLog.findMany({
        select: { action: true, entity: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.order.findMany({
        where: { createdAt: { gte: orderAnalyticsStart }, status: { in: [...revenueStatuses] } },
        select: { createdAt: true, total: true },
        orderBy: { createdAt: "asc" },
      }),
      db.orderItem.findMany({
        where: { order: { createdAt: { gte: productAnalyticsStart }, status: { in: [...revenueStatuses] } } },
        include: { order: { select: { createdAt: true } } },
        take: 500,
      }),
    ]);

    const sellerMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const item of orderItems) {
      const existing = sellerMap.get(item.productId) || { name: item.name, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += Number(item.lineTotal);
      sellerMap.set(item.productId, existing);
    }

    const currentMonthSales = currentOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const previousMonthSales = previousOrders.reduce((sum, order) => sum + Number(order.total), 0);

    return NextResponse.json({
      products,
      categories,
      customers,
      orders,
      lowStock,
      currentMonthSales,
      previousMonthSales,
      pendingOrderValue: pendingOrders.reduce((sum, order) => sum + Number(order.total), 0),
      openTickets,
      closedTickets,
      pendingPayments,
      bestSellers: Array.from(sellerMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5),
      lowStockProducts,
      recentOrders: recentOrders.map((order) => ({ ...order, total: Number(order.total) })),
      recentLogs: recentLogs.map((log) => ({ ...log, createdAt: log.createdAt.toISOString() })),
      orderChart: analyticsOrders.map((order) => ({
        label: order.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric" }),
        total: Number(order.total),
      })),
      productSalesChart: Array.from(
        analyticsItems.reduce((map, item) => {
          const existing = map.get(item.name) || 0;
          map.set(item.name, existing + item.quantity);
          return map;
        }, new Map<string, number>()),
      )
        .map(([label, total]) => ({ label, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8),
    });
  } catch {
    return NextResponse.json({ error: "Dashboard data is temporarily unavailable." }, { status: 503 });
  }
}
