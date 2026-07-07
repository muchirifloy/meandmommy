"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type HeroSlide = {
  title: string;
  body: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  eyebrow: string;
};

type HeroRotatorProps = {
  slides: HeroSlide[];
  offer?: {
    code: string;
    discountValue: number;
    discountType: "PERCENTAGE" | "FIXED";
  } | null;
};

export function HeroRotator({ slides, offer }: HeroRotatorProps) {
  const safeSlides = useMemo(
    () =>
      slides.length
        ? slides
        : [
            {
              title: "Safer milk storage and cleaner feeding routines.",
              body: "Shop breastmilk storage bags, sterilising tablets, creams, brushes, and pumping accessories for everyday Kenyan parenting routines.",
              href: "#shop",
              imageUrl: "/images/hero/me-and-mommy-hero-products.webp",
              imageAlt: "Me & Mommy baby feeding essentials and mother with baby",
              eyebrow: "Me & Mommy essentials",
            },
          ],
    [slides],
  );
  const [active, setActive] = useState(0);
  const slide = safeSlides[active % safeSlides.length];
  const palette = [
    "from-sky-100 via-white to-pink-100",
    "from-pink-100 via-white to-mint",
    "from-mint via-white to-sky-100",
    "from-sun via-white to-sky-100",
    "from-petal via-white to-mint",
  ];
  const cardPalette = palette[active % palette.length];

  useEffect(() => {
    if (safeSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % safeSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  function previousSlide() {
    setActive((current) => (current - 1 + safeSlides.length) % safeSlides.length);
  }

  function nextSlide() {
    setActive((current) => (current + 1) % safeSlides.length);
  }

  return (
    <section className="bg-white py-5 sm:py-7">
      <div className="container-shell">
        <article className={`relative overflow-hidden rounded-lg border border-sky-100 bg-gradient-to-br ${cardPalette} shadow-sm`}>
          <div className="grid min-h-[380px] gap-5 p-5 sm:p-7 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div className="order-2 lg:order-1">
              {offer ? (
                <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-brand-dark shadow-sm">
                  Use {offer.code} for {offer.discountValue}
                  {offer.discountType === "PERCENTAGE" ? "% OFF" : " KES OFF"}
                </p>
              ) : null}
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-brand-dark">{slide.eyebrow}</p>
              <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">{slide.body}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={slide.href}
                  className="rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-brand-dark"
                >
                  Shop This
                </Link>
                <Link
                  href="#shop"
                  className="rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-brand-dark transition hover:bg-sky-50"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-sky-100">
                <Image
                  src={slide.imageUrl}
                  alt={slide.imageAlt}
                  width={900}
                  height={680}
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous hero slide"
            onClick={previousSlide}
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-brand-dark shadow transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next hero slide"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-brand-dark shadow transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/86 px-3 py-2 shadow-sm">
            {safeSlides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show ${item.eyebrow}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${index === active ? "w-9 bg-brand-dark" : "w-2.5 bg-sky-200"}`}
              />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
