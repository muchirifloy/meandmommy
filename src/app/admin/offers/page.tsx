import { DiscountType, OfferAudience, type Offer } from "@prisma/client";
import { upsertOffer } from "@/app/admin/actions";
import { getOptionalDb } from "@/lib/db";

function OfferForm({ offer }: { offer?: Offer }) {
  return (
    <form action={upsertOffer} className="grid gap-3 md:grid-cols-2">
      <input type="hidden" name="id" value={offer?.id || ""} />
      <input name="name" defaultValue={offer?.name || ""} required placeholder="Offer name" className="rounded-md border border-slate-200 px-3 py-2" />
      <input name="code" defaultValue={offer?.code || ""} required placeholder="Code" className="rounded-md border border-slate-200 px-3 py-2 uppercase" />
      <select name="discountType" defaultValue={offer?.discountType || DiscountType.PERCENTAGE} className="rounded-md border border-slate-200 px-3 py-2">
        {Object.values(DiscountType).map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <input name="discountValue" type="number" step="0.01" defaultValue={offer ? Number(offer.discountValue) : 5} className="rounded-md border border-slate-200 px-3 py-2" />
      <select name="audience" defaultValue={offer?.audience || OfferAudience.FIRST_ORDER} className="rounded-md border border-slate-200 px-3 py-2">
        {Object.values(OfferAudience).map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <textarea name="description" defaultValue={offer?.description || ""} required placeholder="Description" className="min-h-20 rounded-md border border-slate-200 px-3 py-2 md:col-span-2" />
      <label className="flex items-center gap-2 text-sm font-bold"><input name="isActive" type="checkbox" value="true" defaultChecked={offer?.isActive ?? true} /> Active</label>
      <label className="flex items-center gap-2 text-sm font-bold"><input name="showOnHome" type="checkbox" value="true" defaultChecked={offer?.showOnHome ?? true} /> Show on homepage</label>
      <button className="justify-self-start rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white">Save offer</button>
    </form>
  );
}

export default async function AdminOffersPage() {
  const db = getOptionalDb();
  const offers = db ? await db.offer.findMany({ orderBy: { updatedAt: "desc" } }).catch(() => []) : [];

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Offers</p>
        <h1 className="text-2xl font-black text-slate-950">Offers & vouchers</h1>
      </div>
      <details className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <summary className="cursor-pointer px-4 py-3 text-sm font-black">Create offer</summary>
        <div className="border-t border-slate-100 p-4"><OfferForm /></div>
      </details>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {offers.map((offer) => (
          <details key={offer.id} className="border-b border-slate-100 last:border-0">
            <summary className="grid cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 md:grid-cols-[1fr_120px_150px_120px_80px]">
              <strong className="text-slate-950">{offer.name}</strong>
              <span className="font-black text-[#4285f4]">{offer.code}</span>
              <span>{String(offer.discountValue)} {offer.discountType}</span>
              <span className={offer.isActive ? "font-bold text-emerald-600" : "font-bold text-slate-400"}>{offer.isActive ? "Active" : "Inactive"}</span>
              <span className="text-xs font-black text-[#4285f4]">Edit</span>
            </summary>
            <div className="border-t border-slate-100 bg-slate-50 p-4"><OfferForm offer={offer} /></div>
          </details>
        ))}
        {!offers.length ? <p className="p-5 text-sm text-slate-500">No offers yet.</p> : null}
      </div>
    </section>
  );
}
