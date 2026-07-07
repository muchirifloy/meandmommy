import { getOptionalDb } from "@/lib/db";

export default async function AdminSecurityPage() {
  const db = getOptionalDb();
  const logs = db ? await db.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []) : [];

  return (
    <section>
      <h1 className="text-3xl font-black">System Security</h1>
      <div className="mt-6 rounded-lg bg-white/10 p-5 ring-1 ring-white/10">
        <h2 className="font-black">Security checklist</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-300">
          <li>Use long `NEXTAUTH_SECRET` in production.</li>
          <li>Use Google OAuth and strong admin passwords.</li>
          <li>Keep admin role limited to trusted users.</li>
          <li>Rotate M-Pesa and email provider credentials periodically.</li>
          <li>Keep database backups enabled on the host.</li>
        </ul>
      </div>
      <h2 className="mt-8 text-xl font-black">Audit Logs</h2>
      <div className="mt-4 grid gap-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
            <p className="font-black">{log.action}</p>
            <p className="text-sm text-slate-300">{log.entity} · {log.actor?.email || "System"} · {log.createdAt.toISOString()}</p>
          </div>
        ))}
        {!logs.length ? <p className="text-slate-300">No audit logs yet.</p> : null}
      </div>
    </section>
  );
}
