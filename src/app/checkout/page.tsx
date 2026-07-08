import Link from "next/link";
import { getServerSession } from "next-auth";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTracker } from "@/components/checkout/CheckoutTracker";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { calculateTax, getStoreSettings } from "@/lib/settings";

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
  const settings = await getStoreSettings();
  const tax = cart ? calculateTax(cart.subtotal, settings) : 0;
  const total = cart ? cart.subtotal + tax : 0;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const trackingProducts = cart?.items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.unitPrice,
    category: item.categoryName,
    stockStatus: item.stock > 0 ? "in_stock" as const : "out_of_stock" as const,
    url: `${baseUrl}/product/${item.slug}`,
    description: item.name,
  })) || [];

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
            <CheckoutTracker products={trackingProducts} total={total} />
            <CheckoutForm email={session.user.email} name={session.user.name} products={trackingProducts} total={total} />
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
                {settings.taxEnabled ? (
                  <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                    <span>Tax ({settings.taxPercentage}%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                ) : null}
                Total {formatPrice(total)}
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
