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

export default async function AdminPage() {
  const stats = {
    products: 0,
    categories: 0,
    orders: 0,
    lowStock: 0,
    currentMonthSales: 0,
    previousMonthSales: 0,
    openTickets: 0,
    closedTickets: 0,
    bestSellers: [] as Array<{ name: string; quantity: number; revenue: number }>,
    lowStockProducts: [] as Array<{ name: string; stock: number }>,
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
      orders,
      lowStock,
      currentOrders,
      previousOrders,
      openTickets,
      closedTickets,
      orderItems,
      lowStockProducts,
    ] = await Promise.all([
      db.product.count(),
      db.category.count(),
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
      db.orderItem.findMany({ take: 500, orderBy: { order: { createdAt: "desc" } } }),
      db.product.findMany({ where: { stock: { lte: 10 } }, select: { name: true, stock: true }, orderBy: { stock: "asc" }, take: 8 }),
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
      orders,
      lowStock,
      currentMonthSales: currentOrders.reduce((sum, order) => sum + Number(order.total), 0),
      previousMonthSales: previousOrders.reduce((sum, order) => sum + Number(order.total), 0),
      openTickets,
      closedTickets,
      bestSellers: Array.from(sellerMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      lowStockProducts,
    });
  } catch {
    // Admin pages need a configured database; keep the shell renderable during first build.
  }

  const delta = stats.previousMonthSales
    ? ((stats.currentMonthSales - stats.previousMonthSales) / stats.previousMonthSales) * 100
    : stats.currentMonthSales > 0
      ? 100
      : 0;

  return (
    <section>
      <h1 className="text-3xl font-black">Admin Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["Products", stats.products],
          ["Categories", stats.categories],
          ["Orders", stats.orders],
          ["Low stock", stats.lowStock],
          ["Open tickets", stats.openTickets],
          ["Closed tickets", stats.closedTickets],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white/10 p-5 ring-1 ring-white/10">
            <p className="text-sm font-bold text-slate-300">{label}</p>
            <p className="mt-3 text-4xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white/10 p-5 ring-1 ring-white/10">
          <h2 className="text-xl font-black">Monthly Sales</h2>
          <p className="mt-4 text-4xl font-black text-brand">{money(stats.currentMonthSales)}</p>
          <p className="mt-2 text-sm text-slate-300">
            Previous month: {money(stats.previousMonthSales)} · {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg bg-white/10 p-5 ring-1 ring-white/10">
          <h2 className="text-xl font-black">Stock At A Glance</h2>
          <div className="mt-4 grid gap-2">
            {stats.lowStockProducts.map((product) => (
              <div key={product.name} className="flex justify-between rounded-lg bg-slate-900 px-3 py-2 text-sm">
                <span>{product.name}</span>
                <strong>{product.stock}</strong>
              </div>
            ))}
            {!stats.lowStockProducts.length ? <p className="text-sm text-slate-300">No low-stock products.</p> : null}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white/10 p-5 ring-1 ring-white/10">
        <h2 className="text-xl font-black">Best Selling Products</h2>
        <div className="mt-4 grid gap-2">
          {stats.bestSellers.map((product) => (
            <div key={product.name} className="grid gap-2 rounded-lg bg-slate-900 px-3 py-3 text-sm md:grid-cols-[1fr_120px_160px]">
              <span>{product.name}</span>
              <strong>{product.quantity} sold</strong>
              <strong>{money(product.revenue)}</strong>
            </div>
          ))}
          {!stats.bestSellers.length ? <p className="text-sm text-slate-300">Sales will appear after orders are placed.</p> : null}
        </div>
      </div>
    </section>
  );
}
