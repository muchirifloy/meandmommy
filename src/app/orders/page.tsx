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
          take: 50,
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

        <section className="mt-6 grid gap-2">
          {orders.map((order) => (
            <details key={order.id} className="group rounded-lg border border-slate-200 bg-white shadow-sm">
              <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-50 text-brand-dark">
                  <PackageCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-black text-slate-950">{order.orderNumber}</h2>
                  <p className="text-xs font-semibold text-slate-500">
                    {order.createdAt.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })} - {friendlyStatus(order.status)}
                  </p>
                </div>
                <strong className="text-sm text-brand-dark">{formatPrice(Number(order.total))}</strong>
              </summary>
              <div className="grid gap-2 border-t border-slate-100 px-3 pb-3 pt-3 text-sm text-slate-600">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>{formatPrice(Number(item.lineTotal))}</strong>
                  </div>
                ))}
              </div>
            </details>
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
