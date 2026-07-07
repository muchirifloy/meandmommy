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
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-sky-100">
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
      <div className="container-shell relative z-20 grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          {offer ? (
            <p className="inline-flex rounded-full bg-petal px-4 py-2 text-sm font-black text-brand-dark">
              Use code {offer.code} and get {offer.discountValue}
              {offer.discountType === "PERCENTAGE" ? "% OFF" : " KES OFF"}
            </p>
          ) : null}
          <p className="mt-5 text-sm font-black uppercase tracking-wide text-brand-dark">{slide.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 md:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{slide.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
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
          <div className="mt-8 flex gap-2">
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
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-brand-soft via-petal to-mint blur-2xl" />
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
