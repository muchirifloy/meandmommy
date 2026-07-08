import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { PackageCheck } from "lucide-react";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { authOptions } from "@/lib/auth";
import { getOptionalDb } from "@/lib/db";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function friendlyStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const db = getOptionalDb();
  const orders = db
    ? await db.order
        .findMany({
          where: { userId: session.user.id },
          include: { items: true },
          orderBy: { createdAt: "desc" },
        })
        .catch(() => [])
    : [];

  return (
    <>
      <Header />
      <main className="container-shell min-h-[70vh] py-10 pb-24 lg:pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Order history</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Your Orders</h1>
          </div>
          <Link href="/account" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:border-brand hover:text-brand-dark">
            Back to dashboard
          </Link>
        </div>

        <section className="mt-6 grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-50 text-brand-dark">
                    <PackageCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-black text-slate-950">{order.orderNumber}</h2>
                    <p className="text-sm font-semibold text-slate-500">{friendlyStatus(order.status)}</p>
                  </div>
                </div>
                <strong className="text-lg text-brand-dark">{formatPrice(Number(order.total))}</strong>
              </div>
              <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>{formatPrice(Number(item.lineTotal))}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {!orders.length ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-black text-slate-950">No orders yet</h2>
              <p className="mt-2 text-slate-600">Your order updates will appear here after checkout.</p>
              <Link href="/account#shop" className="mt-5 inline-flex rounded-full bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark">
                Start shopping
              </Link>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}
