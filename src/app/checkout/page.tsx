import Link from "next/link";
import { getServerSession } from "next-auth";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Footer } from "@/components/store/Footer";
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

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  const cart = session?.user?.id ? await getCart(session.user.id) : null;

  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">Checkout</h1>
        {!session ? (
          <div className="mt-8 rounded-lg bg-white p-8 shadow-sm ring-1 ring-sky-100">
            <p className="text-slate-600">Sign in or create an account to complete checkout securely with your phone number and M-Pesa details.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/login?callbackUrl=/checkout" className="inline-flex rounded-full bg-brand px-6 py-3 font-black text-white">
                Login to checkout
              </Link>
              <Link href="/register?callbackUrl=/checkout" className="inline-flex rounded-full border border-sky-100 px-6 py-3 font-black text-brand-dark">
                Create account
              </Link>
            </div>
          </div>
        ) : !cart?.items.length ? (
          <p className="mt-6 text-slate-600">Your cart is empty.</p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <CheckoutForm email={session.user.email} name={session.user.name} />
            <aside className="h-fit rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <h2 className="text-xl font-black text-slate-950">Order Summary</h2>
              <div className="mt-4 grid gap-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm text-slate-600">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-sky-100 pt-4 text-lg font-black text-brand-dark">
                Total {formatPrice(cart.subtotal)}
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
