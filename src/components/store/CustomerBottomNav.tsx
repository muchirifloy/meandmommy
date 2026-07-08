import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";

export function CustomerBottomNav() {
  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/account#shop", icon: ShoppingBag },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Account", href: "/account", icon: UserRound },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="grid place-items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-black text-slate-600 transition hover:bg-sky-50 hover:text-brand-dark"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
