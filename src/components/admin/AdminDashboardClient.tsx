"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
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

type DashboardStats = {
  products: number;
  categories: number;
  customers: number;
  orders: number;
  lowStock: number;
  currentMonthSales: number;
  previousMonthSales: number;
  openTickets: number;
  closedTickets: number;
  pendingPayments: number;
  bestSellers: Array<{ name: string; quantity: number; revenue: number }>;
  lowStockProducts: Array<{ name: string; stock: number }>;
  recentOrders: Array<{ orderNumber: string; customerName: string; status: string; total: number }>;
  recentLogs: Array<{ action: string; entity: string; createdAt: string }>;
  orderChart: Array<{ label: string; total: number }>;
  productSalesChart: Array<{ label: string; total: number }>;
};

const emptyStats: DashboardStats = {
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
  bestSellers: [],
  lowStockProducts: [],
  recentOrders: [],
  recentLogs: [],
  orderChart: [],
  productSalesChart: [],
};

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
    <div className="flex h-7 items-end gap-1">
      {values.map((value, index) => (
        <span key={index} className={`w-1.5 rounded-t ${color}`} style={{ height: `${Math.max(8, (value / max) * 28)}px` }} />
      ))}
    </div>
  );
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white p-5 text-sm font-bold text-slate-400">
      {label}
    </div>
  );
}

export function AdminDashboardClient() {
  const [orderPeriod, setOrderPeriod] = useState("week");
  const [productPeriod, setProductPeriod] = useState("month");
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ orderPeriod, productPeriod });

    fetch(`/api/admin/dashboard?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Dashboard data is temporarily unavailable.");
        return response.json() as Promise<DashboardStats>;
      })
      .then((data) => {
        setStats(data);
        setError("");
      })
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [orderPeriod, productPeriod]);

  function updateOrderPeriod(value: string) {
    setLoading(true);
    setError("");
    setOrderPeriod(value);
  }

  function updateProductPeriod(value: string) {
    setLoading(true);
    setError("");
    setProductPeriod(value);
  }

  const delta = useMemo(() => {
    if (stats.previousMonthSales) {
      return ((stats.currentMonthSales - stats.previousMonthSales) / stats.previousMonthSales) * 100;
    }
    return stats.currentMonthSales > 0 ? 100 : 0;
  }, [stats.currentMonthSales, stats.previousMonthSales]);

  const cards = [
    { label: "All Earnings", value: money(stats.currentMonthSales), note: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% vs last month`, icon: DollarSign, color: "bg-amber-400", bars: [6, 9, 5, 12, 8, 13, 10] },
    { label: "Orders", value: stats.orders, note: "Track purchase to delivery", icon: ShoppingCart, color: "bg-[#4285f4]", bars: [3, 7, 4, 8, 9, 5, 10] },
    { label: "Customers", value: stats.customers, note: "Profiles and purchase history", icon: Users, color: "bg-emerald-500", bars: [5, 5, 7, 6, 9, 10, 8] },
    { label: "Low Stock", value: stats.lowStock, note: "Needs attention", icon: AlertTriangle, color: "bg-rose-500", bars: [9, 7, 8, 4, 5, 3, 2] },
  ];

  return (
    <section className="grid gap-4 sm:gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#4285f4]">Dashboard</p>
          <h1 className="text-xl font-black text-slate-950 sm:text-2xl">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products" className="rounded-full bg-[#4285f4] px-3.5 py-2 text-xs font-black text-white shadow-sm hover:bg-[#2f6fd1]">
            Add product
          </Link>
          <Link href="/admin/orders" className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-slate-700 hover:border-[#4285f4] hover:text-[#4285f4]">
            Manage orders
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">{error}</div>
      ) : null}

      <div id="analytics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3 p-3.5 sm:p-4">
                <div>
                  <p className="text-xs font-bold text-slate-500">{card.label}</p>
                  <p className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">{loading ? "..." : card.value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{card.note}</p>
                </div>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md text-white ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className={`flex items-end justify-between gap-3 px-4 py-2 text-white ${card.color}`}>
                {miniBars(card.bars, "bg-white/70")}
                <TrendingUp className="h-4 w-4" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-black text-slate-950 sm:text-lg">Orders graph</h2>
            <div className="flex gap-2">
              <select value={orderPeriod} onChange={(event) => updateOrderPeriod(event.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex h-36 items-end gap-2 overflow-x-auto border-b border-slate-100 pb-2 sm:h-48">
            {loading ? <LoadingBlock label="Loading orders..." /> : null}
            {!loading && stats.orderChart.length ? stats.orderChart.map((item, index) => (
              <div key={`${item.label}-${index}`} className="grid min-w-10 justify-items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="w-7 rounded-t bg-[#4285f4]" style={{ height: `${Math.max(12, item.total / Math.max(stats.currentMonthSales, 1) * 160)}px` }} />
                <span>{item.label}</span>
              </div>
            )) : null}
            {!loading && !stats.orderChart.length ? <p className="text-sm text-slate-500">No orders in this period.</p> : null}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-black text-slate-950 sm:text-lg">Product sales graph</h2>
            <select value={productPeriod} onChange={(event) => updateProductPeriod(event.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="mt-5 grid gap-3">
            {loading ? <LoadingBlock label="Loading product sales..." /> : null}
            {!loading && stats.productSalesChart.map((item) => (
              <div key={item.label} className="grid grid-cols-[1fr_70px] items-center gap-3 text-sm">
                <div>
                  <p className="line-clamp-1 font-bold text-slate-700">{item.label}</p>
                  <span className="mt-1 block h-2 rounded-full bg-slate-100">
                    <span className="block h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, item.total * 12)}%` }} />
                  </span>
                </div>
                <strong>{item.total} sold</strong>
              </div>
            ))}
            {!loading && !stats.productSalesChart.length ? <p className="text-sm text-slate-500">No product sales in this period.</p> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-950 sm:text-lg">Latest Orders</h2>
            <Link href="/admin/orders" className="text-sm font-black text-[#4285f4]">View all</Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
            {loading ? <LoadingBlock label="Loading latest orders..." /> : null}
            {!loading && stats.recentOrders.map((order) => (
              <div key={order.orderNumber} className="grid gap-1 border-b border-slate-100 px-3 py-3 text-xs last:border-0 sm:text-sm md:grid-cols-[1fr_1fr_120px_120px]">
                <strong>{order.orderNumber}</strong>
                <span className="text-slate-500">{order.customerName}</span>
                <span className="font-bold text-[#4285f4]">{order.status}</span>
                <strong>{money(order.total)}</strong>
              </div>
            ))}
            {!loading && !stats.recentOrders.length ? <p className="p-5 text-sm text-slate-500">Orders will appear here after checkout.</p> : null}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <h2 className="text-base font-black text-slate-950 sm:text-lg">Latest Updates</h2>
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
                <strong>{loading ? "Loading..." : String(label)}</strong>
              </div>
            ))}
            {!loading && stats.recentLogs.map((log) => (
              <div key={`${log.action}-${log.createdAt}`} className="text-sm">
                <strong>{log.action}</strong>
                <p className="text-xs text-slate-500">{log.entity} - {new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="inventory" className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-[#4285f4]" />
            <h2 className="text-base font-black text-slate-950 sm:text-lg">Stock At A Glance</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {loading ? <LoadingBlock label="Loading stock..." /> : null}
            {!loading && stats.lowStockProducts.map((product) => (
              <div key={product.name} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span>{product.name}</span>
                <strong className={product.stock <= 5 ? "text-rose-600" : "text-slate-950"}>{product.stock}</strong>
              </div>
            ))}
            {!loading && !stats.lowStockProducts.length ? <p className="text-sm text-slate-500">No low-stock products.</p> : null}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#4285f4]" />
            <h2 className="text-base font-black text-slate-950 sm:text-lg">Best Selling Products</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {loading ? <LoadingBlock label="Loading best sellers..." /> : null}
            {!loading && stats.bestSellers.map((product) => (
              <div key={product.name} className="grid gap-1 rounded-lg bg-slate-50 px-3 py-3 text-sm md:grid-cols-[1fr_90px_120px]">
                <span>{product.name}</span>
                <strong>{product.quantity} sold</strong>
                <strong>{money(product.revenue)}</strong>
              </div>
            ))}
            {!loading && !stats.bestSellers.length ? <p className="text-sm text-slate-500">Sales will appear after orders are placed.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
