import Link from "next/link";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const links = [
  ["Dashboard", "/admin"],
  ["Categories", "/admin/categories"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Offers", "/admin/offers"],
  ["Payments", "/admin/payments"],
  ["Reviews", "/admin/reviews"],
  ["Support", "/admin/support"],
  ["Members", "/admin/members"],
  ["Emails", "/admin/campaigns"],
  ["Videos", "/admin/videos"],
  ["Security", "/admin/security"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-slate-950 p-6 lg:block">
        <Link href="/" className="text-2xl font-black text-brand">Me & Mommy</Link>
        <nav className="mt-10 grid gap-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="container-shell py-8">{children}</div>
      </main>
    </div>
  );
}
