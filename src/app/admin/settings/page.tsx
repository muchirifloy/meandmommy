import { CreditCard, Globe2, LockKeyhole, Palette, ReceiptText, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const sections = [
    {
      title: "Store Information",
      icon: Globe2,
      items: ["Store name: Me & Mommy", "Location: Nairobi, Kenya", "Support email and phone", "Business hours and delivery notes"],
    },
    {
      title: "Payments",
      icon: CreditCard,
      items: ["M-Pesa environment", "Callback URL", "Manual payment verification", "Refund and cancellation workflow"],
    },
    {
      title: "Taxes & Currency",
      icon: ReceiptText,
      items: ["KES currency", "Tax rules", "Delivery fees", "Invoice numbering"],
    },
    {
      title: "Branding",
      icon: Palette,
      items: ["Logo and favicon", "Brand colors", "Homepage banners", "Email template styling"],
    },
    {
      title: "Security",
      icon: LockKeyhole,
      items: ["Admin role review", "NEXTAUTH_SECRET", "Audit logs", "Database backup and restore process"],
    },
    {
      title: "System Preferences",
      icon: Settings,
      items: ["Low stock threshold", "Featured product rules", "Notification preferences", "Content publishing workflow"],
    },
  ];

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-[#4285f4]">Settings</p>
        <h1 className="text-3xl font-black text-slate-950">Store configuration</h1>
        <p className="mt-2 text-sm text-slate-500">
          Central place for store identity, payment, tax, branding, and security preferences. Editable forms can be connected as each setting becomes database-backed.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#4285f4]/10 text-[#4285f4]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-black text-slate-950">{section.title}</h2>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-slate-500">
                {section.items.map((item) => (
                  <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">{item}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
