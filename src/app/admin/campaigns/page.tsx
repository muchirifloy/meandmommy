import { createCampaign, sendCampaign } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

export default async function AdminCampaignsPage() {
  const db = getOptionalDb();
  const campaigns = db ? await db.emailCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []) : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Emails</p>
        <h1 className="text-2xl font-black text-slate-950">Promotional emails</h1>
        <p className="mt-1 text-sm text-slate-500">Recent customers means customers with an order in the last 90 days.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <form action={createCampaign} className="grid h-fit gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
          <h2 className="text-lg font-black">Create campaign</h2>
          <input name="subject" required placeholder="Subject" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="preview" required placeholder="Preview text" className="rounded-md border border-slate-200 px-3 py-2" />
          <select name="audience" className="rounded-md border border-slate-200 px-3 py-2">
            <option value="ALL_CUSTOMERS">All customers</option>
            <option value="RECENT_CUSTOMERS">Recent customers - ordered in last 90 days</option>
            <option value="NO_ORDERS">Registered but no orders</option>
          </select>
          <textarea name="body" required placeholder="Email content" className="min-h-36 rounded-md border border-slate-200 px-3 py-2" />
          <button className="rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Save draft</button>
        </form>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="grid gap-3 border-b border-slate-100 p-4 text-sm last:border-0 lg:grid-cols-[1fr_140px_120px]">
              <div>
                <h2 className="font-black text-slate-950">{campaign.subject}</h2>
                <p className="mt-1 text-slate-500">{campaign.preview}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{campaign.audience}</p>
              </div>
              <span className="font-bold text-[#4285f4]">{campaign.status}</span>
              {campaign.status === "DRAFT" ? (
                <form action={sendCampaign}>
                  <input type="hidden" name="id" value={campaign.id} />
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:border-[#4285f4] hover:text-[#4285f4]">Send</button>
                </form>
              ) : campaign.sentAt ? (
                <p className="text-xs font-bold text-slate-500">Sent {campaign.sentAt.toLocaleDateString()}</p>
              ) : null}
            </div>
          ))}
          {!campaigns.length ? <p className="p-5 text-sm text-slate-500">No email campaigns yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
