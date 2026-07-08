import { CreditCard, Globe2, LockKeyhole, Palette, ReceiptText } from "lucide-react";
import { updateStoreSettings } from "@/app/admin/actions";
import { getStoreSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  const rows = [
    {
      title: "Store information",
      icon: Globe2,
      summary: `${settings.storeName} - ${settings.location}`,
      fields: (
        <>
          <input name="storeName" defaultValue={settings.storeName} className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="supportEmail" type="email" defaultValue={settings.supportEmail} className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="supportPhone" defaultValue={settings.supportPhone} className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="location" defaultValue={settings.location} className="rounded-md border border-slate-200 px-3 py-2" />
        </>
      ),
    },
    {
      title: "Payment method",
      icon: CreditCard,
      summary: settings.paymentMethod,
      fields: (
        <input name="paymentMethod" defaultValue={settings.paymentMethod} className="rounded-md border border-slate-200 px-3 py-2" />
      ),
    },
    {
      title: "Tax",
      icon: ReceiptText,
      summary: settings.taxEnabled ? `Active at ${settings.taxPercentage}%` : "Inactive",
      fields: (
        <>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="taxEnabled" type="checkbox" value="true" defaultChecked={settings.taxEnabled} />
            Tax active
          </label>
          <input name="taxPercentage" type="number" min="0" max="100" step="0.01" defaultValue={settings.taxPercentage} className="rounded-md border border-slate-200 px-3 py-2" />
        </>
      ),
    },
    {
      title: "Branding",
      icon: Palette,
      summary: "Logo and favicon",
      fields: (
        <>
          <input name="logoUrl" defaultValue={settings.logoUrl || ""} placeholder="Logo URL" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="faviconUrl" defaultValue={settings.faviconUrl || ""} placeholder="Favicon URL" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="faviconFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/x-icon" className="rounded-md border border-slate-200 px-3 py-2" />
        </>
      ),
    },
    {
      title: "Two-factor authentication",
      icon: LockKeyhole,
      summary: `Admin ${settings.adminTwoFactor ? "on" : "off"} - Staff ${settings.staffTwoFactor ? "on" : "off"} - Customer ${settings.customerTwoFactor ? "on" : "off"}`,
      fields: (
        <>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="adminTwoFactor" type="checkbox" value="true" defaultChecked={settings.adminTwoFactor} />
            Require 2FA for admins
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="staffTwoFactor" type="checkbox" value="true" defaultChecked={settings.staffTwoFactor} />
            Require 2FA for staff
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input name="customerTwoFactor" type="checkbox" value="true" defaultChecked={settings.customerTwoFactor} />
            Require 2FA for customers
          </label>
          <p className="text-xs font-semibold text-slate-500">These switches are stored globally. Enforcement can be connected to an OTP provider next.</p>
        </>
      ),
    },
  ];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Settings</p>
        <h1 className="text-2xl font-black text-slate-950">Store settings</h1>
      </div>

      <form action={updateStoreSettings} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <details key={row.title} className="group rounded-md border border-slate-100 bg-slate-50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-[#4285f4]/10 text-[#4285f4]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-slate-950">{row.title}</span>
                    <span className="text-xs font-semibold text-slate-500">{row.summary}</span>
                  </span>
                </span>
                <span className="text-xs font-black text-[#4285f4]">Edit</span>
              </summary>
              <div className="grid gap-3 border-t border-slate-100 bg-white p-4 sm:grid-cols-2">
                {row.fields}
              </div>
            </details>
          );
        })}
        <button className="justify-self-start rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white hover:bg-[#2f6fd1]">
          Save settings
        </button>
      </form>
    </section>
  );
}
