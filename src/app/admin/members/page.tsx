import { Role } from "@prisma/client";
import { updateUserRole } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminMembersPage() {
  const db = getOptionalDb();
  const users = db ? await db.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []) : [];

  return (
    <section>
      <h1 className="text-3xl font-black">Members & Staff</h1>
      <p className="mt-2 text-slate-300">Promote support staff or admins. Keep admin access limited and reviewed.</p>
      <div className="mt-8 grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-black">{user.name || user.email}</h2>
                <p className="text-sm text-slate-300">{user.email}</p>
              </div>
              <form action={updateUserRole} className="flex gap-2">
                <input type="hidden" name="id" value={user.id} />
                <select name="role" defaultValue={user.role} className="rounded-lg bg-white px-3 py-2 text-slate-950">
                  {Object.values(Role).map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                <button className="rounded-lg bg-brand px-4 py-2 font-black text-white">Save</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
