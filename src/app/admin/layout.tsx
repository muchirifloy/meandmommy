import Link from "next/link";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Boxes,
  FileText,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tags,
  Users,
  Video,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { authOptions } from "@/lib/auth";

const groups = [
  {
    label: "Navigation",
    links: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin#analytics", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Commerce",
    links: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Inventory", href: "/admin#inventory", icon: Boxes },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Payments", href: "/admin/payments", icon: Receipt },
      { label: "Offers", href: "/admin/offers", icon: Star },
    ],
  },
  {
    label: "Customers",
    links: [
      { label: "Users", href: "/admin/members", icon: Users },
      { label: "Support", href: "/admin/support", icon: Headphones },
      { label: "Reviews", href: "/admin/reviews", icon: ShieldCheck },
      { label: "Emails", href: "/admin/campaigns", icon: Mail },
    ],
  },
  {
    label: "Content & Security",
    links: [
      { label: "Videos", href: "/admin/videos", icon: Video },
      { label: "Pages", href: "/admin#content", icon: FileText },
      { label: "Security", href: "/admin/security", icon: LockKeyhole },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== Role.ADMIN) redirect("/login?callbackUrl=/admin");

  return (
    <div className="min-h-screen bg-[#eef3fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-slate-200 bg-white shadow-sm lg:block">
        <div className="flex h-14 items-center justify-between border-b border-slate-100 px-3">
          <Link href="/admin" className="text-base font-black text-[#4285f4]">Me & Mommy</Link>
          <span className="rounded-full bg-[#4285f4]/10 px-2 py-0.5 text-[10px] font-black text-[#4285f4]">Admin</span>
        </div>
        <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-wide text-slate-400">{group.label}</p>
              <div className="grid gap-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12px] font-bold text-slate-600 transition hover:bg-[#4285f4] hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-20 bg-[#4285f4] text-white shadow-sm lg:pl-56">
        <div className="flex min-h-14 items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <AdminMobileNav groups={groups} />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wide text-white/70">Admin</p>
              <h1 className="truncate text-base font-black sm:text-lg">Store command center</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" target="_blank" rel="noreferrer" className="hidden rounded-full bg-white/12 px-4 py-2 text-sm font-black hover:bg-white/20 sm:inline-flex">
              View Store
            </Link>
            <span className="hidden text-sm font-bold text-white/80 md:inline">{session.user.email}</span>
            <LogoutButton compact onDark />
          </div>
        </div>
      </header>

      <main className="lg:pl-56">
        <div className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5">{children}</div>
      </main>
    </div>
  );
}
