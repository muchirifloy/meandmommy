import Link from "next/link";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  Heart,
  PackageCheck,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import { AccountCategoryRail } from "@/components/account/AccountCategoryRail";
import { AccountSettings } from "@/components/account/AccountSettings";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ProductCard } from "@/components/store/ProductCard";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { getCatalog, getFeaturedProducts } from "@/lib/catalog";
import { getOptionalDb } from "@/lib/db";
import { getHomeOffer } from "@/lib/offers";

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

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");
  if (session.user.role === Role.ADMIN || session.user.role === Role.SUPPORT) redirect("/admin");

  const db = getOptionalDb();
  const [{ categories }, featuredProducts, homeOffer, cart, orders] = await Promise.all([
    getCatalog(),
    getFeaturedProducts(),
    getHomeOffer(),
    getCart(session.user.id).catch(() => null),
    db
      ? db.order
          .findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 4,
          })
          .catch(() => [])
      : [],
  ]);

  const firstName = session.user.name?.split(" ")[0] || "there";
  const cartCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const quickLinks = [
    { label: "Shop", href: "#shop", icon: ShoppingBag, detail: `${featuredProducts.length} featured` },
    { label: "Orders", href: "/orders", icon: PackageCheck, detail: `${orders.length} recent` },
    { label: "Wishlist", href: "/wishlist", icon: Heart, detail: "Saved picks" },
    { label: "Cart", href: "/cart", icon: ShoppingCart, detail: `${cartCount} items` },
  ];

  return (
    <>
      <Header />
      <main className="bg-slate-50 pb-24 lg:pb-12">
        <section className="border-b border-slate-200 bg-white">
          <div className="container-shell grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center md:py-6">
            <div>
              <h1 className="text-2xl font-black text-slate-950 sm:text-4xl">Welcome back, {firstName}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <Link href="/" className="inline-flex rounded-full bg-brand px-4 py-2.5 text-xs font-black text-white hover:bg-brand-dark sm:text-sm">
                Continue shopping
              </Link>
              <LogoutButton compact />
            </div>
          </div>
        </section>

        <section className="container-shell py-4 sm:py-6">
          <form action="/search" className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
            <Search className="h-4 w-4 text-brand-dark sm:h-5 sm:w-5" />
            <input
              name="q"
              placeholder="Search storage bags, sterilising tablets, cream..."
              className="w-full bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-slate-400"
            />
          </form>

          <div className="mt-4 grid grid-cols-4 gap-2 md:gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md sm:p-4 sm:text-left"
                >
                  <div className="grid justify-items-center gap-1.5 sm:flex sm:items-center sm:justify-items-start sm:gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-50 text-brand-dark sm:h-10 sm:w-10">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-black text-slate-950 sm:text-base">{item.label}</p>
                      <p className="hidden text-xs font-semibold text-slate-500 sm:block">{item.detail}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="shop" className="container-shell grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-brand-dark">Hot picks</p>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">Featured Products</h2>
              </div>
              <Link href="/" className="text-sm font-black text-brand-dark hover:text-slate-950">
                View shop
              </Link>
            </div>
            <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-3">
              {featuredProducts.map((product) => (
                <div key={product.id} className="snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            {homeOffer ? (
              <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sun">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-xs font-black uppercase tracking-wide">Special offer</p>
                  </div>
                  <h2 className="mt-2 text-lg font-black sm:text-xl">{homeOffer.name}</h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/78 sm:text-sm">{homeOffer.description}</p>
                  <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-950">
                    Use {homeOffer.code}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand-dark" />
                <h2 className="font-black text-slate-950">Shopping status</h2>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Cart subtotal</span>
                  <strong className="text-slate-950">{formatPrice(cart?.subtotal || 0)}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Items in cart</span>
                  <strong className="text-slate-950">{cartCount}</strong>
                </div>
              </div>
              <Link href="/cart" className="mt-5 flex justify-center rounded-full bg-brand px-5 py-3 text-sm font-black text-white hover:bg-brand-dark">
                Open cart
              </Link>
            </div>
          </aside>
        </section>

        <section className="container-shell mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950">Categories</h2>
              <Link href="/" className="text-sm font-black text-brand-dark hover:text-slate-950">
                Browse all
              </Link>
            </div>
            <AccountCategoryRail categories={categories} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950">Recent Orders</h2>
              <Link href="/orders" className="text-sm font-black text-brand-dark hover:text-slate-950">
                View orders
              </Link>
            </div>
            <div className="mt-3 grid gap-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
                  <div>
                    <p className="font-black text-slate-950">{order.orderNumber}</p>
                    <p className="text-xs font-semibold text-slate-500">{friendlyStatus(order.status)}</p>
                  </div>
                  <strong className="text-sm text-brand-dark">{formatPrice(Number(order.total))}</strong>
                </div>
              ))}
              {!orders.length ? (
                <div className="rounded-lg bg-slate-50 p-5 text-sm text-slate-600">
                  No orders yet. Add your essentials to cart and checkout securely with M-Pesa.
                </div>
              ) : null}
            </div>
          </div>
        </section>
        <AccountSettings email={session.user.email} />
      </main>
      <Footer />
    </>
  );
}
