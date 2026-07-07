import { DiscountType, OfferAudience } from "@prisma/client";
import { upsertOffer } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export default async function AdminOffersPage() {
  const offers = await getDb().offer.findMany({ orderBy: { updatedAt: "desc" } }).catch(() => []);
  const first = offers[0];

  return (
    <section>
      <h1 className="text-3xl font-black">Offers & Vouchers</h1>
      <p className="mt-2 text-slate-300">Control the homepage promo banner and checkout voucher rules.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[440px_1fr]">
        <form action={upsertOffer} className="grid h-fit gap-4 rounded-lg bg-white p-5 text-slate-950">
          <h2 className="text-xl font-black">{first ? "Update main offer" : "Create offer"}</h2>
          <input type="hidden" name="id" value={first?.id || ""} />
          <input name="name" defaultValue={first?.name || "First Order Welcome Offer"} required className="rounded-lg border px-4 py-3" />
          <input name="code" defaultValue={first?.code || "ME&MOMMY"} required className="rounded-lg border px-4 py-3" />
          <textarea name="description" defaultValue={first?.description || "A welcome discount for new Me & Mommy shoppers."} required className="min-h-24 rounded-lg border px-4 py-3" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="discountType" defaultValue={first?.discountType || DiscountType.PERCENTAGE} className="rounded-lg border px-4 py-3">
              {Object.values(DiscountType).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input name="discountValue" type="number" step="0.01" defaultValue={first ? Number(first.discountValue) : 5} className="rounded-lg border px-4 py-3" />
          </div>
          <select name="audience" defaultValue={first?.audience || OfferAudience.FIRST_ORDER} className="rounded-lg border px-4 py-3">
            {Object.values(OfferAudience).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm font-bold"><input name="isActive" type="checkbox" value="true" defaultChecked={first?.isActive ?? true} /> Active</label>
          <label className="flex items-center gap-2 text-sm font-bold"><input name="showOnHome" type="checkbox" value="true" defaultChecked={first?.showOnHome ?? true} /> Show on homepage</label>
          <button className="rounded-full bg-brand px-5 py-3 font-black text-white">Save offer</button>
        </form>
        <div className="grid gap-3">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
              <h2 className="font-black">{offer.name}</h2>
              <p className="text-sm text-slate-300">{offer.code} · {String(offer.discountValue)} {offer.discountType} · {offer.audience}</p>
              <p className="mt-2 text-sm text-slate-200">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
