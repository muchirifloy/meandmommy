import Link from "next/link";
import { PaymentStatus } from "@prisma/client";
import { verifyPayment } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

function money(value: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; sort?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const status = params.status as PaymentStatus | undefined;
  const sort = params.sort === "amount-asc" ? "amount-asc" : params.sort === "amount-desc" ? "amount-desc" : "recent";
  const db = getOptionalDb();
  const payments = db
    ? await db.payment
        .findMany({
          where: {
            ...(status ? { status } : {}),
            ...(q
              ? {
                  OR: [
                    { receiptNumber: { contains: q } },
                    { phone: { contains: q } },
                    { order: { orderNumber: { contains: q } } },
                    { order: { customerName: { contains: q } } },
                  ],
                }
              : {}),
          },
          include: { order: true },
          orderBy: sort === "amount-asc" ? { amount: "asc" } : sort === "amount-desc" ? { amount: "desc" } : { createdAt: "desc" },
          take: 50,
        })
        .catch(() => [])
    : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Payments</p>
        <h1 className="text-2xl font-black text-slate-950">Payment records</h1>
      </div>
      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_auto]">
        <input name="q" defaultValue={q || ""} placeholder="Search order, receipt, phone..." className="rounded-md border border-slate-200 px-3 py-2" />
        <select name="status" defaultValue={status || ""} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="">All statuses</option>
          {Object.values(PaymentStatus).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select name="sort" defaultValue={sort} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="recent">Recent first</option>
          <option value="amount-desc">Amount high-low</option>
          <option value="amount-asc">Amount low-high</option>
        </select>
        <button className="rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Filter</button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {payments.map((payment) => (
          <details key={payment.id} className="border-b border-slate-100 last:border-0">
            <summary className="grid cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 lg:grid-cols-[150px_1fr_120px_130px_120px_60px]">
              <Link href={`/admin/orders?q=${payment.order.orderNumber}`} className="font-black text-[#4285f4]">{payment.order.orderNumber}</Link>
              <span>{payment.order.customerName}<span className="block text-xs text-slate-500">{payment.phone || payment.order.customerPhone}</span></span>
              <span className="font-bold">{payment.provider}</span>
              <span className="font-bold text-[#4285f4]">{payment.status}</span>
              <strong>{money(Number(payment.amount))}</strong>
              <span className="text-xs font-black text-[#4285f4]">Open</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-100 bg-slate-50 p-4 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-2 text-sm">
                <p><strong>Receipt:</strong> {payment.receiptNumber || "Not verified"}</p>
                <p><strong>Merchant request:</strong> {payment.merchantRequestId || "-"}</p>
                <p><strong>Checkout request:</strong> {payment.checkoutRequestId || "-"}</p>
                <p><strong>Description:</strong> {payment.resultDescription || "-"}</p>
              </div>
              <form action={verifyPayment} className="grid h-fit gap-3 rounded-md bg-white p-3">
                <input type="hidden" name="id" value={payment.id} />
                <input name="receiptNumber" placeholder="M-Pesa receipt number" className="rounded-md border border-slate-200 px-3 py-2" />
                <button className="rounded-full bg-[#4285f4] px-4 py-2 text-sm font-black text-white">Mark verified</button>
              </form>
            </div>
          </details>
        ))}
        {!payments.length ? <p className="p-5 text-sm text-slate-500">No payment records found.</p> : null}
      </div>
    </section>
  );
}
