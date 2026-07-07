"use client";

import Image from "next/image";
import Link from "next/link";
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

  useEffect(() => {
    if (safeSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % safeSlides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  return (
    <section className="relative min-h-[430px] overflow-hidden bg-sky-100">
      {safeSlides.map((item, index) => (
        <Image
          key={item.imageUrl}
          src={item.imageUrl}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`z-0 object-cover object-[64%_center] transition-opacity duration-700 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/94 via-white/72 to-white/12" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/72 via-transparent to-white/5" />
      <div className="container-shell relative z-20 grid min-h-[430px] items-center gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          {offer ? (
            <p className="inline-flex rounded-full bg-petal px-4 py-2 text-sm font-black text-brand-dark">
              Use code {offer.code} and get {offer.discountValue}
              {offer.discountType === "PERCENTAGE" ? "% OFF" : " KES OFF"}
            </p>
          ) : null}
          <p className="mt-4 text-xs font-black uppercase tracking-wide text-brand-dark">{slide.eyebrow}</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-4 line-clamp-2 max-w-xl text-base leading-7 text-slate-700">{slide.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={slide.href}
              className="rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:bg-brand-dark"
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
          <div className="mt-6 flex gap-2">
            {safeSlides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show ${item.eyebrow}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${index === active ? "w-10 bg-brand-dark" : "w-2.5 bg-sky-200"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative overflow-hidden rounded-lg soft-card">
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              width={900}
              height={680}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
