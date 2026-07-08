import { TicketStatus } from "@prisma/client";
import { emailTicketReport, updateTicketStatus } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

const categories = ["GENERAL", "PAYMENTS", "SALES", "ORDERS"];

export default async function AdminSupportPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; category?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const status = params.status as TicketStatus | undefined;
  const category = params.category;
  const db = getOptionalDb();
  const tickets = db
    ? await db.supportTicket
        .findMany({
          where: {
            ...(status ? { status } : {}),
            ...(category ? { category } : {}),
            ...(q ? { OR: [{ subject: { contains: q } }, { name: { contains: q } }, { email: { contains: q } }, { message: { contains: q } }] } : {}),
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
        .catch(() => [])
    : [];

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Support</p>
          <h1 className="text-2xl font-black text-slate-950">Customer tickets</h1>
        </div>
        <form action={emailTicketReport}>
          <button className="rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Email report</button>
        </form>
      </div>
      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_160px_auto]">
        <input name="q" defaultValue={q || ""} placeholder="Search tickets..." className="rounded-md border border-slate-200 px-3 py-2" />
        <select name="category" defaultValue={category || ""} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select name="status" defaultValue={status || ""} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="">All statuses</option>
          {Object.values(TicketStatus).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Filter</button>
      </form>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {tickets.map((ticket) => (
          <details key={ticket.id} className="border-b border-slate-100 last:border-0">
            <summary className="grid cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 md:grid-cols-[1fr_120px_130px_120px_60px]">
              <span><strong className="text-slate-950">{ticket.subject}</strong><span className="block text-xs text-slate-500">{ticket.name} - {ticket.email}</span></span>
              <span>{ticket.category}</span>
              <span className="font-bold text-[#4285f4]">{ticket.status}</span>
              <span className="text-xs text-slate-500">{ticket.createdAt.toLocaleDateString()}</span>
              <span className="text-xs font-black text-[#4285f4]">View</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 bg-slate-50 p-4 lg:grid-cols-[1fr_320px]">
              <div className="text-sm">
                <p className="rounded-md bg-white p-3">{ticket.message}</p>
                {ticket.reply ? <p className="mt-3 rounded-md bg-sky-50 p-3"><strong>Reply:</strong> {ticket.reply}</p> : null}
              </div>
              <form action={updateTicketStatus} className="grid h-fit gap-3 rounded-md bg-white p-3">
                <input type="hidden" name="id" value={ticket.id} />
                <select name="category" defaultValue={ticket.category} className="rounded-md border border-slate-200 px-3 py-2">
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select name="status" defaultValue={ticket.status} className="rounded-md border border-slate-200 px-3 py-2">
                  {Object.values(TicketStatus).map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <textarea name="reply" defaultValue={ticket.reply || ""} placeholder="Support reply note" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />
                <button className="rounded-full bg-[#4285f4] px-4 py-2 text-sm font-black text-white">Save ticket</button>
              </form>
            </div>
          </details>
        ))}
        {!tickets.length ? <p className="p-5 text-sm text-slate-500">No tickets found.</p> : null}
      </div>
    </section>
  );
}
