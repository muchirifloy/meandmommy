import Link from "next/link";
import { getServerSession } from "next-auth";
import { Footer } from "@/components/store/Footer";
import { GuestCart } from "@/components/store/GuestCart";
import { Header } from "@/components/store/Header";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  const cart = session?.user?.id ? await getCart(session.user.id) : null;

  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">Shopping Cart</h1>
        {!session ? (
          <GuestCart />
        ) : cart && cart.items.length ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-4">
              {cart.items.map((item) => (
                <div key={item.id} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-sky-100">
                  <h2 className="font-black text-slate-950">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">Qty {item.quantity}</p>
                  <p className="mt-3 font-black text-brand-dark">{formatPrice(item.lineTotal)}</p>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <h2 className="text-xl font-black text-slate-950">Summary</h2>
              <div className="mt-4 flex justify-between text-slate-700">
                <span>Subtotal</span>
                <strong>{formatPrice(cart.subtotal)}</strong>
              </div>
              <Link href="/checkout" className="mt-6 flex justify-center rounded-full bg-brand px-6 py-3 font-black text-white">
                Checkout with M-Pesa
              </Link>
            </aside>
          </div>
        ) : (
          <div className="mt-8 rounded-lg bg-white p-8 shadow-sm ring-1 ring-sky-100">
            <p className="text-slate-600">Your cart is empty.</p>
            <Link href="/" className="mt-5 inline-flex rounded-full bg-brand px-6 py-3 font-black text-white">
              Continue shopping
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
