"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

type HeaderMobileControlsProps = {
  categories: Array<{
    name: string;
    slug: string;
  }>;
};

export function HeaderMobileControls({ categories }: HeaderMobileControlsProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1 lg:hidden">
        <button
          type="button"
          onClick={() => {
            setSearchOpen((value) => !value);
            setMenuOpen(false);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-sun hover:text-slate-950"
          aria-label="Search products"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setMenuOpen((value) => !value);
            setSearchOpen(false);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-sun hover:text-slate-950"
          aria-label="Open categories"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <form
        action="/search"
        className={`${searchOpen ? "fixed left-3 right-3 top-[72px] z-50 flex md:top-[88px]" : "hidden"} items-center rounded-full border border-white/20 bg-white px-4 py-2 text-slate-950 shadow-xl`}
      >
        <Search className="h-4 w-4 text-brand-dark" />
        <input
          name="q"
          placeholder="Search diapers, bottles..."
          className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
        />
      </form>

      <nav
        className={`${menuOpen ? "fixed left-3 right-3 top-[72px] z-50 grid md:top-[88px]" : "hidden"} gap-2 rounded-lg bg-slate-950 p-3 text-sm font-black text-white shadow-xl ring-1 ring-slate-700`}
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-lg px-3 py-2 transition hover:bg-sun hover:text-slate-950"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
