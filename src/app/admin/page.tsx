import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  Clock3,
  DollarSign,
  Headphones,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { getOptionalDb } from "@/lib/db";

function startOfMonth(offset = 0) {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function money(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function miniBars(values: number[], color: string) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-12 items-end gap-1">
      {values.map((value, index) => (
        <span key={index} className={`w-2 rounded-t ${color}`} style={{ height: `${Math.max(18, (value / max) * 48)}px` }} />
      ))}
    </div>
  );
}

export default async function AdminPage() {
  const stats = {
    products: 0,
    categories: 0,
    customers: 0,
    orders: 0,
    lowStock: 0,
    currentMonthSales: 0,
    previousMonthSales: 0,
    openTickets: 0,
    closedTickets: 0,
    pendingPayments: 0,
    bestSellers: [] as Array<{ name: string; quantity: number; revenue: number }>,
    lowStockProducts: [] as Array<{ name: string; stock: number }>,
    recentOrders: [] as Array<{ orderNumber: string; customerName: string; status: string; total: unknown }>,
    recentLogs: [] as Array<{ action: string; entity: string; createdAt: Date }>,
  };

  try {
    const db = getOptionalDb();
    if (!db) throw new Error("Database not configured.");
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
      orderItems,
      lowStockProducts,
      recentOrders,
      recentLogs,
    ] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.count(),
      db.product.count({ where: { stock: { lte: 5 } } }),
      db.order.findMany({
        where: { createdAt: { gte: currentStart, lt: nextStart }, status: { not: "CANCELLED" } },
        select: { total: true },
      }),
      db.order.findMany({
        where: { createdAt: { gte: previousStart, lt: currentStart }, status: { not: "CANCELLED" } },
        select: { total: true },
      }),
      db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      db.supportTicket.count({ where: { status: { in: ["RESOLVED", "CLOSED"] } } }),
      db.payment.count({ where: { status: "PENDING" } }),
      db.orderItem.findMany({ take: 500, orderBy: { order: { createdAt: "desc" } } }),
      db.product.findMany({ where: { stock: { lte: 10 } }, select: { name: true, stock: true }, orderBy: { stock: "asc" }, take: 8 }),
      db.order.findMany({ select: { orderNumber: true, customerName: true, status: true, total: true }, orderBy: { createdAt: "desc" }, take: 5 }),
      db.auditLog.findMany({ select: { action: true, entity: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    const sellerMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const item of orderItems) {
      const existing = sellerMap.get(item.productId) || { name: item.name, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += Number(item.lineTotal);
      sellerMap.set(item.productId, existing);
    }

    Object.assign(stats, {
      products,
      categories,
      customers,
      orders,
      lowStock,
      currentMonthSales: currentOrders.reduce((sum, order) => sum + Number(order.total), 0),
      previousMonthSales: previousOrders.reduce((sum, order) => sum + Number(order.total), 0),
      openTickets,
      closedTickets,
      pendingPayments,
      bestSellers: Array.from(sellerMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5),
      lowStockProducts,
      recentOrders,
      recentLogs,
    });
  } catch {
    // Keep dashboard renderable during first deployment or database maintenance.
  }

  const delta = stats.previousMonthSales
    ? ((stats.currentMonthSales - stats.previousMonthSales) / stats.previousMonthSales) * 100
    : stats.currentMonthSales > 0
      ? 100
      : 0;

  const cards = [
    { label: "All Earnings", value: money(stats.currentMonthSales), note: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% vs last month`, icon: DollarSign, color: "bg-amber-400", bars: [6, 9, 5, 12, 8, 13, 10] },
    { label: "Orders", value: stats.orders, note: "Track purchase to delivery", icon: ShoppingCart, color: "bg-[#4285f4]", bars: [3, 7, 4, 8, 9, 5, 10] },
    { label: "Customers", value: stats.customers, note: "Profiles and purchase history", icon: Users, color: "bg-emerald-500", bars: [5, 5, 7, 6, 9, 10, 8] },
    { label: "Low Stock", value: stats.lowStock, note: "Needs attention", icon: AlertTriangle, color: "bg-rose-500", bars: [9, 7, 8, 4, 5, 3, 2] },
  ];

  const capabilityGroups = [
    ["Product Management", "Add/edit/archive products, upload multiple images, feature items, schedule sale pricing, manage stock and category assignment."],
    ["Order Management", "Update delivery status, verify payments, process cancellations, and prepare invoice/packing slip workflows."],
    ["Customer Management", "Review customer profiles, addresses, order history, coupons, support tickets, and promotional targeting."],
    ["Inventory Management", "Monitor low stock, stock-on-hand, adjustments, automatic sales deductions, and future warehouse controls."],
    ["User & Staff Management", "Create staff through members, assign roles, control admin access, and review activity logs."],
    ["Content & Settings", "Manage offers, videos, homepage content, email campaigns, branding, payment, security, backups, and audit controls."],
  ];

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#4285f4]">Default</p>
          <h1 className="text-3xl font-black text-slate-950">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="rounded-full bg-[#4285f4] px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-[#2f6fd1]">
            Add product
          </Link>
          <Link href="/admin/orders" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:border-[#4285f4] hover:text-[#4285f4]">
            Manage orders
          </Link>
        </div>
      </div>

      <div id="analytics" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="text-sm font-bold text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{card.value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{card.note}</p>
                </div>
                <span className={`grid h-11 w-11 place-items-center rounded-lg text-white ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className={`flex items-end justify-between gap-3 px-5 py-3 text-white ${card.color}`}>
                {miniBars(card.bars, "bg-white/70")}
                <TrendingUp className="h-5 w-5" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">Latest Orders</h2>
            <Link href="/admin/orders" className="text-sm font-black text-[#4285f4]">View all</Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
            {stats.recentOrders.map((order) => (
              <div key={order.orderNumber} className="grid gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-0 md:grid-cols-[1fr_1fr_120px_120px]">
                <strong>{order.orderNumber}</strong>
                <span className="text-slate-500">{order.customerName}</span>
                <span className="font-bold text-[#4285f4]">{order.status}</span>
                <strong>{money(Number(order.total))}</strong>
              </div>
            ))}
            {!stats.recentOrders.length ? <p className="p-5 text-sm text-slate-500">Orders will appear here after checkout.</p> : null}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-black text-slate-950">Latest Updates</h2>
          <div className="mt-4 grid gap-4">
            {[
              [`${stats.openTickets} support tickets open`, Headphones, "bg-[#4285f4]"],
              [`${stats.pendingPayments} payments pending verification`, Clock3, "bg-amber-400"],
              [`${stats.closedTickets} support tickets closed`, CheckCircle2, "bg-emerald-500"],
            ].map(([label, Icon, color]) => (
              <div key={String(label)} className="flex items-center gap-3 text-sm">
                <span className={`grid h-9 w-9 place-items-center rounded-full text-white ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <strong>{String(label)}</strong>
              </div>
            ))}
            {stats.recentLogs.map((log) => (
              <div key={`${log.action}-${log.createdAt.toISOString()}`} className="text-sm">
                <strong>{log.action}</strong>
                <p className="text-xs text-slate-500">{log.entity} - {log.createdAt.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="inventory" className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-[#4285f4]" />
            <h2 className="text-lg font-black text-slate-950">Stock At A Glance</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {stats.lowStockProducts.map((product) => (
              <div key={product.name} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span>{product.name}</span>
                <strong className={product.stock <= 5 ? "text-rose-600" : "text-slate-950"}>{product.stock}</strong>
              </div>
            ))}
            {!stats.lowStockProducts.length ? <p className="text-sm text-slate-500">No low-stock products.</p> : null}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#4285f4]" />
            <h2 className="text-lg font-black text-slate-950">Best Selling Products</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {stats.bestSellers.map((product) => (
              <div key={product.name} className="grid gap-2 rounded-lg bg-slate-50 px-3 py-3 text-sm md:grid-cols-[1fr_90px_120px]">
                <span>{product.name}</span>
                <strong>{product.quantity} sold</strong>
                <strong>{money(product.revenue)}</strong>
              </div>
            ))}
            {!stats.bestSellers.length ? <p className="text-sm text-slate-500">Sales will appear after orders are placed.</p> : null}
          </div>
        </div>
      </div>

      <div id="content" className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#4285f4]" />
          <h2 className="text-lg font-black text-slate-950">Management Coverage</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {capabilityGroups.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <h3 className="font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
