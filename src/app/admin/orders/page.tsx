import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminOrdersPage() {
  const db = getOptionalDb();
  const orders = db ? await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []) : [];

  return (
    <section>
      <h1 className="text-3xl font-black">Orders</h1>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-black">{order.orderNumber}</h2>
                <p className="text-sm text-slate-300">{order.customerName} · {order.customerPhone}</p>
              </div>
              <form action={updateOrderStatus} className="flex gap-2">
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status} className="rounded-lg bg-white px-3 py-2 text-slate-950">
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button className="rounded-lg bg-brand px-4 py-2 font-black text-white">Update</button>
              </form>
            </div>
          </div>
        ))}
        {!orders.length ? <p className="text-slate-300">No orders yet.</p> : null}
      </div>
    </section>
  );
}
