import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

function money(value: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const status = params.status as OrderStatus | undefined;
  const db = getOptionalDb();
  const orders = db
    ? await db.order
        .findMany({
          where: {
            ...(status ? { status } : {}),
            ...(q
              ? {
                  OR: [
                    { orderNumber: { contains: q } },
                    { customerName: { contains: q } },
                    { customerEmail: { contains: q } },
                    { customerPhone: { contains: q } },
                  ],
                }
              : {}),
          },
          include: { items: true, payments: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
        .catch(() => [])
    : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Order Management</p>
        <h1 className="text-2xl font-black text-slate-950">Orders</h1>
      </div>

      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
        <input name="q" defaultValue={q || ""} placeholder="Search order, customer, phone..." className="rounded-md border border-slate-200 px-3 py-2" />
        <select name="status" defaultValue={status || ""} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="">All statuses</option>
          {Object.values(OrderStatus).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Filter</button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {orders.map((order) => (
          <details key={order.id} className="border-b border-slate-100 last:border-0">
            <summary className="grid cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 lg:grid-cols-[150px_1fr_150px_120px_130px_60px]">
              <strong className="text-slate-950">{order.orderNumber}</strong>
              <span>{order.customerName}<span className="block text-xs text-slate-500">{order.customerPhone}</span></span>
              <span className="font-bold text-[#4285f4]">{order.status}</span>
              <span>{money(Number(order.total))}</span>
              <span className="text-xs text-slate-500">{order.createdAt.toLocaleDateString()}</span>
              <span className="text-xs font-black text-[#4285f4]">View</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 bg-slate-50 p-4 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-2 text-sm">
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>Delivery:</strong> {order.deliveryAddress}</p>
                {order.notes ? <p><strong>Notes:</strong> {order.notes}</p> : null}
                <div className="mt-2 rounded-md bg-white p-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between border-b border-slate-100 py-2 last:border-0">
                      <span>{item.name} x {item.quantity}</span>
                      <strong>{money(Number(item.lineTotal))}</strong>
                    </div>
                  ))}
                </div>
                <div className="rounded-md bg-white p-3 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Subtotal</span>
                    <strong>{money(Number(order.subtotal))}</strong>
                  </div>
                  {Number(order.discountTotal) > 0 ? (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600">Discount</span>
                      <strong>-{money(Number(order.discountTotal))}</strong>
                    </div>
                  ) : null}
                  {Number(order.shippingFee) > 0 ? (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600">Shipping</span>
                      <strong>{money(Number(order.shippingFee))}</strong>
                    </div>
                  ) : null}
                  <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-base text-slate-950">
                    <span className="font-black">Order total</span>
                    <strong>{money(Number(order.total))}</strong>
                  </div>
                </div>
              </div>
              <form action={updateOrderStatus} className="grid h-fit gap-3 rounded-md bg-white p-3">
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status} className="rounded-md border border-slate-200 px-3 py-2">
                  {Object.values(OrderStatus).map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <button className="rounded-full bg-[#4285f4] px-4 py-2 text-sm font-black text-white">Update status</button>
              </form>
            </div>
          </details>
        ))}
        {!orders.length ? <p className="p-5 text-sm text-slate-500">No orders found.</p> : null}
      </div>
    </section>
  );
}
