"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: { url: string; alt: string }[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const safeImages = images.length ? images : [{ url: "/images/me-and-mommy-logo.png", alt: name }];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = safeImages[activeIndex] || safeImages[0];

  useEffect(() => {
    if (safeImages.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % safeImages.length);
    }, 3500);
    return () => window.clearInterval(interval);
  }, [safeImages.length]);

  return (
    <div className="overflow-hidden rounded-lg bg-brand-soft">
      <div className="relative">
        <Image
          src={active.url}
          alt={active.alt || name}
          width={900}
          height={760}
          priority
          className="aspect-[4/3] w-full object-cover"
          unoptimized={active.url.startsWith("data:")}
        />
      </div>
      {safeImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto bg-white p-2">
          {safeImages.map((image, index) => (
            <button
              key={`${image.url.slice(0, 32)}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-sky-50 ring-2 transition ${
                index === activeIndex ? "ring-brand" : "ring-transparent hover:ring-sky-200"
              }`}
              aria-label={`View ${image.alt || name}`}
            >
              <Image
                src={image.url}
                alt={image.alt || name}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={image.url.startsWith("data:")}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
