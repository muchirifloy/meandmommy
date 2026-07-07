import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { getVideoGuides } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Baby Feeding Video Guides",
  description:
    "Watch short Me & Mommy video guides for breastmilk storage bags, sterilising tablets, feeding accessories, baby brushes, cream care, and pumping routines.",
  keywords: [
    "Me and Mommy videos",
    "baby feeding guides Kenya",
    "how to use breastmilk storage bags",
    "how to use sterilising tablets",
    "baby bottle cleaning video",
    "breast pump accessories guide",
  ],
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const guides = await getVideoGuides();

  return (
    <>
      <Header />
      <main className="container-shell py-8">
        <div className="rounded-lg border border-sky-100 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wide text-brand-dark">Videos</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">Short product guides</h1>
        </div>

        <div className="shop-rail video-rail mt-6">
          {guides.map((guide) => (
            <article key={guide.id} className="min-w-[280px] overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm">
              <a href={guide.url} target="_blank" rel="noreferrer" className="block">
                <div className="relative grid aspect-video place-items-center bg-sky-50">
                  {guide.posterUrl ? (
                    <Image src={guide.posterUrl} alt={guide.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  ) : null}
                  <span className="relative rounded-full bg-slate-950/80 px-4 py-2 text-sm font-black text-white">Play</span>
                </div>
              </a>
              <div className="p-4">
                <h2 className="font-black text-slate-950">{guide.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.footnote}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
