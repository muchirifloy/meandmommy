import Link from "next/link";
import { getServerSession } from "next-auth";
import { Footer } from "@/components/store/Footer";
import { GuestCart } from "@/components/store/GuestCart";
import { Header } from "@/components/store/Header";
import { SignedInCart } from "@/components/store/SignedInCart";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { getStoreSettings } from "@/lib/settings";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  const cart = session?.user?.id ? await getCart(session.user.id) : null;
  const settings = await getStoreSettings();

  return (
    <>
      <Header />
      <main className="container-shell py-8 pb-24 lg:py-12">
        <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">Shopping Cart</h1>
        {!session ? (
          <GuestCart />
        ) : cart && cart.items.length ? (
          <SignedInCart
            initialItems={cart.items}
            taxEnabled={settings.taxEnabled}
            taxPercentage={Number(settings.taxPercentage)}
          />
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
