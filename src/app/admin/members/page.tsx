import { Role } from "@prisma/client";
import { updateUserRole } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const role = params.role as Role | undefined;
  const db = getOptionalDb();
  const users = db
    ? await db.user
        .findMany({
          where: {
            ...(role ? { role } : {}),
            ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }] } : {}),
          },
          include: { orders: { orderBy: { createdAt: "desc" }, take: 5 }, addresses: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
        .catch(() => [])
    : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Users</p>
        <h1 className="text-2xl font-black text-slate-950">Admins, staff & customers</h1>
      </div>
      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_auto]">
        <input name="q" defaultValue={q || ""} placeholder="Search name, email, phone..." className="rounded-md border border-slate-200 px-3 py-2" />
        <select name="role" defaultValue={role || ""} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="">All roles</option>
          {Object.values(Role).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Filter</button>
      </form>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {users.map((user) => (
          <details key={user.id} className="border-b border-slate-100 last:border-0">
            <summary className="grid cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 md:grid-cols-[1fr_150px_120px_120px_60px]">
              <span><strong className="text-slate-950">{user.name || "No name"}</strong><span className="block text-xs text-slate-500">{user.email}</span></span>
              <span>{user.phone || "-"}</span>
              <span className="font-bold text-[#4285f4]">{user.role}</span>
              <span>{user.orders.length} orders</span>
              <span className="text-xs font-black text-[#4285f4]">View</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 bg-slate-50 p-4 lg:grid-cols-[1fr_280px]">
              <div className="text-sm">
                <p className="font-black text-slate-950">Recent purchases</p>
                {user.orders.map((order) => (
                  <p key={order.id} className="mt-2 rounded-md bg-white px-3 py-2">{order.orderNumber} - {order.status} - KES {Number(order.total).toLocaleString()}</p>
                ))}
                {!user.orders.length ? <p className="mt-2 text-slate-500">No purchases yet.</p> : null}
              </div>
              <form action={updateUserRole} className="grid h-fit gap-3 rounded-md bg-white p-3">
                <input type="hidden" name="id" value={user.id} />
                <select name="role" defaultValue={user.role} className="rounded-md border border-slate-200 px-3 py-2">
                  {Object.values(Role).map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <button className="rounded-full bg-[#4285f4] px-4 py-2 text-sm font-black text-white">Save role</button>
              </form>
            </div>
          </details>
        ))}
        {!users.length ? <p className="p-5 text-sm text-slate-500">No users found.</p> : null}
      </div>
    </section>
  );
}
