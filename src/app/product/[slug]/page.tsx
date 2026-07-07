import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { ProductCard } from "@/components/store/ProductCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getCatalog, getProduct } from "@/lib/catalog";

const productEducation = {
  "me-and-mommy-sterilising-tablets": {
    eyebrow: "Safe. Convenient. Trusted by mums.",
    benefits: [
      "Kills 99.9% of common germs when used according to the pack instructions.",
      "Suitable for baby bottles, teats, breast pump parts, and feeding accessories.",
      "Ideal for breastmilk storage accessories, pacifiers, teethers, small plastic toys, and weaning utensils.",
      "No boiling needed, making it useful at home, during travel, and for busy night routines.",
      "Compact 30-tablet pack designed for everyday parent use.",
    ],
    uses: ["Baby bottles", "Bottle teats", "Breast pump parts", "Breastmilk storage accessories", "Pacifiers", "Teethers", "Small plastic baby toys", "Weaning utensils"],
    steps: [
      "Wash items thoroughly before sterilising.",
      "Fill a clean container with the recommended amount of cold water.",
      "Dissolve one Me & Mommy Sterilising Tablet.",
      "Fully submerge all items and check that no air bubbles are trapped.",
      "Leave for the recommended sterilising time on the pack.",
      "Remove with clean hands or sterilised tongs and allow items to drain before use.",
    ],
    details: ["30 tablets per pack", "Suitable for everyday use", "Compact and travel-friendly", "Designed for busy parents"],
    faqs: [
      ["Do I need to boil bottles after using the tablets?", "No. When used according to the instructions, the tablets provide an effective cold-water sterilising solution."],
      ["Can I use them for breast pump parts?", "Yes. They are suitable for breast pump components and other feeding accessories that are designed to be sterilised."],
      ["How often should I sterilise baby feeding equipment?", "Many parents sterilise bottles, teats, and pump parts before use, especially for young infants. Always follow your healthcare provider's guidance and the product instructions."],
    ],
    trustTitle: "Because Every Feed Matters",
    trustText:
      "At Me & Mommy, every bottle, every pump session, and every feed is an act of love. These tablets are made to help keep feeding essentials hygienically clean while making parenting a little easier.",
  },
  "me-and-mommy-breastmilk-storage-bags": {
    eyebrow: "Express. Label. Freeze. Feed.",
    benefits: [
      "Made for organised expressed milk storage at home, work, daycare, or while travelling.",
      "Freezer-friendly bags help save space when stored flat.",
      "Easy labelling supports first-in, first-out milk rotation.",
      "Useful for working mums, exclusive pumpers, occasional expressers, and night feeds.",
      "Pairs naturally with clean pump parts and sterilised feeding accessories.",
    ],
    uses: ["Expressed breastmilk", "Freezer milk stash", "Daycare milk portions", "Travel milk organisation", "Night-feed preparation", "Pump-session storage"],
    steps: [
      "Wash hands before handling expressed milk.",
      "Pour cooled expressed milk into the storage bag.",
      "Leave room for expansion before freezing.",
      "Seal securely and label with date and amount.",
      "Store flat in the freezer to save space.",
      "Thaw the oldest milk first and follow recognised breastmilk storage guidance.",
    ],
    details: ["30 bags per pack", "220ml capacity per bag", "Leak-resistant storage", "Easy labelling area", "Freezer-friendly", "Designed for expressing mums"],
    faqs: [
      ["Should I label every milk bag?", "Yes. Labelling with the expression date helps you use older milk first and keep your freezer organised."],
      ["Can I freeze breastmilk in the bags?", "Yes. Leave space for milk expansion, seal securely, and store bags flat where possible."],
      ["Are these useful for daycare?", "Yes. Labelled portions make it easier to prepare milk for caregivers and daily routines."],
    ],
    trustTitle: "Built For Pumping Mums",
    trustText:
      "Me & Mommy Breastmilk Storage Bags are designed for the real rhythm of expressing, storing, carrying, and feeding milk with less mess and more confidence.",
  },
} as const;

const videoGuides = [
  ["How to prepare a cold-water sterilising routine", "Wash first, dissolve, submerge fully, wait, then drain with clean hands or tongs."],
  ["How to organise expressed milk bags", "Label with date and amount, store flat, and use the oldest milk first."],
  ["How to pair the essentials", "Use clean pump parts, store milk in bags, and sterilise feeding accessories before use."],
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const description = product.description || product.shortDescription;

  return {
    title: `${product.name} in Kenya | Me & Mommy`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | Me & Mommy`,
      description,
      url: `${baseUrl}/product/${product.slug}`,
      type: "website",
      images: [{ url: product.imageUrl }],
    },
  };
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const { products } = await getCatalog();
  const related = products
    .filter((item) => item.categorySlug !== product.categorySlug && item.id !== product.id)
    .slice(0, 4);
  const education = productEducation[product.slug as keyof typeof productEducation];
  const activePrice = product.salePrice || product.price;
  const descriptionParagraphs = product.description
    .split(/(?<=\.)\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${baseUrl}${product.imageUrl.startsWith("/") ? product.imageUrl : `/${product.imageUrl}`}`],
    brand: { "@type": "Brand", name: "Me & Mommy" },
    category: product.categoryName,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "KES",
      price: activePrice,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <main className="container-shell py-12">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden rounded-lg bg-brand-soft">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={900}
              height={760}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">{product.categoryName}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{product.shortDescription}</p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-black text-brand-dark">{formatPrice(activePrice)}</span>
              {product.salePrice ? <span className="text-lg text-slate-400 line-through">{formatPrice(product.price)}</span> : null}
              {product.discountLabel ? (
                <span className="rounded-full bg-petal px-3 py-1 text-xs font-black text-brand-dark">{product.discountLabel}</span>
              ) : null}
            </div>
            {education?.eyebrow ? (
              <p className="mt-4 rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-brand-dark">
                {education.eyebrow}
              </p>
            ) : null}
            <div className="mt-6">
              <ProductCard product={product} />
            </div>
          </div>
        </section>

        {education ? (
          <section className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Why choose Me & Mommy?</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                {education.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <span className="font-black text-brand-dark">OK</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <p className="text-sm font-black uppercase tracking-wide text-brand-dark">What can you use it for?</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {education.uses.map((use) => (
                  <span key={use} className="rounded-full bg-brand-soft px-3 py-2 text-sm font-bold text-slate-800">
                    {use}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-black uppercase tracking-wide text-sun">Product details</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-200">
                {education.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {education ? (
          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_.8fr]">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
              <p className="text-sm font-black uppercase tracking-wide text-brand-dark">How to use</p>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                {education.steps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[32px_1fr] gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg bg-brand-soft p-6 ring-1 ring-sky-100">
              <h2 className="text-2xl font-black text-slate-950">{education.trustTitle}</h2>
              <p className="mt-4 leading-7 text-slate-700">{education.trustText}</p>
              <a
                href="https://wa.me/254724736495?text=Hello%20Me%20%26%20Mommy%2C%20I%20would%20like%20to%20order%20sterilising%20tablets%20or%20breastmilk%20storage%20bags."
                className="mt-5 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-black text-white"
              >
                Order on WhatsApp
              </a>
            </div>
          </section>
        ) : null}

        {education ? (
          <section className="mt-10 rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Frequently asked questions</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {education.faqs.map(([question, answer]) => (
                <div key={question} className="rounded-lg bg-sky-50 p-4">
                  <h3 className="font-black text-slate-950">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 overflow-hidden rounded-lg bg-slate-950 py-6 text-white">
          <div className="px-6">
            <p className="text-sm font-black uppercase tracking-wide text-sun">Video guides</p>
            <h2 className="mt-2 text-2xl font-black">Quick routines parents can watch later</h2>
          </div>
          <div className="mt-6 flex w-max animate-[review-marquee_34s_linear_infinite] gap-4 px-6">
            {[...videoGuides, ...videoGuides].map(([title, footnote], index) => (
              <article key={`${title}-${index}`} className="w-[310px] shrink-0 rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
                <div className="grid aspect-video place-items-center rounded-lg bg-white/12 text-4xl font-black text-sun">
                  Play
                </div>
                <h3 className="mt-3 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{footnote}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Product description</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Why parents choose this item</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="rounded-lg bg-brand-soft p-6 ring-1 ring-sky-100">
            <h2 className="text-xl font-black text-slate-950">Quick product details</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="font-black uppercase tracking-wide text-brand-dark">Category</dt>
                <dd className="mt-1 text-slate-700">{product.categoryName}</dd>
              </div>
              <div>
                <dt className="font-black uppercase tracking-wide text-brand-dark">Availability</dt>
                <dd className="mt-1 text-slate-700">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</dd>
              </div>
              <div>
                <dt className="font-black uppercase tracking-wide text-brand-dark">Payment</dt>
                <dd className="mt-1 text-slate-700">Secure checkout with M-Pesa STK push.</dd>
              </div>
            </dl>
          </aside>
        </section>

        {related.length ? (
          <section className="mt-14">
            <p className="text-sm font-black uppercase tracking-wide text-brand-dark">Also sold with</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Related essentials from other categories</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
        <section className="mt-14 max-w-2xl">
          <ReviewForm productId={product.id} />
        </section>
      </main>
      <Footer />
    </>
  );
}
