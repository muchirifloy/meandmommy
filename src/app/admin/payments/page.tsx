import { verifyPayment } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export default async function AdminPaymentsPage() {
  const payments = await getDb().payment.findMany({ include: { order: true }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []);

  return (
    <section>
      <h1 className="text-3xl font-black">Payment Verification</h1>
      <div className="mt-8 grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
            <h2 className="font-black">{payment.order.orderNumber}</h2>
            <p className="text-sm text-slate-300">{payment.provider} · {payment.status} · KES {Number(payment.amount).toLocaleString()}</p>
            <p className="mt-2 text-sm text-slate-300">Receipt: {payment.receiptNumber || "Not verified"}</p>
            <form action={verifyPayment} className="mt-4 flex flex-wrap gap-2">
              <input type="hidden" name="id" value={payment.id} />
              <input name="receiptNumber" placeholder="M-Pesa receipt number" className="rounded-lg bg-white px-3 py-2 text-slate-950" />
              <button className="rounded-lg bg-brand px-4 py-2 font-black text-white">Mark verified</button>
            </form>
          </div>
        ))}
        {!payments.length ? <p className="text-slate-300">No payment records yet.</p> : null}
      </div>
    </section>
  );
}

