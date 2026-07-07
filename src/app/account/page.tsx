import Link from "next/link";
import { getServerSession } from "next-auth";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { authOptions } from "@/lib/auth";
import { getOptionalDb } from "@/lib/db";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const db = getOptionalDb();
  const orders =
    session?.user?.id && db
      ? await db.order.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } }).catch(() => [])
      : [];

  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">My Account</h1>
        {!session ? (
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-black text-white">
            Login
          </Link>
        ) : (
          <section className="mt-8 grid gap-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <h2 className="text-xl font-black text-slate-950">{session.user.name || "Customer"}</h2>
              <p className="text-slate-600">{session.user.email}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <h2 className="text-xl font-black text-slate-950">Recent Orders</h2>
              <div className="mt-4 grid gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg bg-sky-50 p-4">
                    <strong>{order.orderNumber}</strong>
                    <p className="text-sm text-slate-600">{order.status}</p>
                  </div>
                ))}
                {!orders.length ? <p className="text-slate-600">No orders yet.</p> : null}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
