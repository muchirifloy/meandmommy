import { TicketStatus } from "@prisma/client";
import { emailTicketReport, updateTicketStatus } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export default async function AdminSupportPage() {
  const tickets = await getDb().supportTicket.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []);

  return (
    <section>
      <h1 className="text-3xl font-black">Customer Support</h1>
      <form action={emailTicketReport} className="mt-4">
        <button className="rounded-full bg-brand px-5 py-3 font-black text-white">Email ticket report</button>
      </form>
      <div className="mt-8 grid gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="font-black">{ticket.subject}</h2>
                <p className="text-sm text-slate-300">{ticket.name} · {ticket.email}</p>
                <p className="mt-3 max-w-2xl text-sm text-slate-200">{ticket.message}</p>
              </div>
              <form action={updateTicketStatus} className="flex h-fit gap-2">
                <input type="hidden" name="id" value={ticket.id} />
                <select name="status" defaultValue={ticket.status} className="rounded-lg bg-white px-3 py-2 text-slate-950">
                  {Object.values(TicketStatus).map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button className="rounded-lg bg-brand px-4 py-2 font-black text-white">Update</button>
              </form>
            </div>
          </div>
        ))}
        {!tickets.length ? <p className="text-slate-300">No support tickets yet.</p> : null}
      </div>
    </section>
  );
}
