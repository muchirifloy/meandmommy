import { createCampaign, sendCampaign } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminCampaignsPage() {
  const db = getOptionalDb();
  const campaigns = db ? await db.emailCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []) : [];

  return (
    <section>
      <h1 className="text-3xl font-black">Promotional Emails</h1>
      <p className="mt-2 text-slate-300">Create styled campaigns and send them through the configured SMTP provider.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
        <form action={createCampaign} className="grid h-fit gap-4 rounded-lg bg-white p-5 text-slate-950">
          <h2 className="text-xl font-black">Create campaign</h2>
          <input name="subject" required placeholder="Subject" className="rounded-lg border px-4 py-3" />
          <input name="preview" required placeholder="Preview text" className="rounded-lg border px-4 py-3" />
          <select name="audience" className="rounded-lg border px-4 py-3">
            <option value="ALL_CUSTOMERS">All customers</option>
            <option value="RECENT_CUSTOMERS">Recent customers</option>
            <option value="NO_ORDERS">Registered but no orders</option>
          </select>
          <textarea name="body" required placeholder="Email content" className="min-h-40 rounded-lg border px-4 py-3" />
          <button className="rounded-full bg-brand px-5 py-3 font-black text-white">Save draft</button>
        </form>
        <div className="grid gap-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
              <h2 className="font-black">{campaign.subject}</h2>
              <p className="text-sm text-slate-300">{campaign.status} - {campaign.audience}</p>
              <p className="mt-2 text-sm text-slate-200">{campaign.preview}</p>
              {campaign.status === "DRAFT" ? (
                <form action={sendCampaign} className="mt-4">
                  <input type="hidden" name="id" value={campaign.id} />
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
                    Send campaign
                  </button>
                </form>
              ) : campaign.sentAt ? (
                <p className="mt-3 text-xs font-bold text-slate-300">Sent {campaign.sentAt.toLocaleString()}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
