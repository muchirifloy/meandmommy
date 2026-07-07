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
    <div className="container-shell pb-3 lg:hidden">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setSearchOpen((value) => !value);
            setMenuOpen(false);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sun text-slate-950 shadow-sm"
          aria-label="Open categories"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <form
        action="/search"
        className={`${searchOpen ? "mt-3 flex" : "hidden"} items-center rounded-full border border-white/20 bg-white px-4 py-2 text-slate-950`}
      >
        <Search className="h-4 w-4 text-brand-dark" />
        <input
          name="q"
          placeholder="Search diapers, bottles..."
          className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
        />
      </form>

      <nav
        className={`${menuOpen ? "mt-3 grid" : "hidden"} gap-2 rounded-lg bg-white p-3 text-sm font-black text-slate-950 shadow-xl ring-1 ring-sky-100`}
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
    </div>
  );
}
