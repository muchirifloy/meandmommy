"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Category = {
  name: string;
  slug: string;
  imageUrl: string;
};

export function AccountCategoryRail({ categories }: { categories: Category[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || categories.length < 2) return;

    const timer = window.setInterval(() => {
      const next = rail.scrollLeft + 170;
      rail.scrollTo({
        left: next >= rail.scrollWidth - rail.clientWidth ? 0 : next,
        behavior: "smooth",
      });
    }, 4000);

    return () => window.clearInterval(timer);
  }, [categories.length]);

  return (
    <div ref={railRef} className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className="relative min-w-[145px] snap-start overflow-hidden rounded-lg bg-slate-950 p-3 text-white sm:min-w-40 sm:p-4"
        >
          <Image src={category.imageUrl} alt={category.name} fill sizes="180px" className="object-cover opacity-35" />
          <span className="relative z-10 block min-h-10 text-xs font-black leading-5 sm:text-sm">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
