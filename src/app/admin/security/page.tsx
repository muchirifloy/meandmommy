import { getOptionalDb } from "@/lib/db";

export default async function AdminSecurityPage() {
  const db = getOptionalDb();
  const logs = db ? await db.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []) : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">System Security</p>
        <h1 className="text-2xl font-black text-slate-950">Audit logs</h1>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {logs.map((log) => (
          <div key={log.id} className="grid gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-0 md:grid-cols-[220px_140px_1fr_170px]">
            <strong className="text-slate-950">{log.action}</strong>
            <span>{log.entity}</span>
            <span className="text-slate-500">{log.actor?.email || "System"}</span>
            <span className="text-xs text-slate-500">{log.createdAt.toLocaleString()}</span>
          </div>
        ))}
        {!logs.length ? <p className="p-5 text-sm text-slate-500">No audit logs yet.</p> : null}
      </div>
    </section>
  );
}
