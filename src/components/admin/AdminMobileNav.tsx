"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";

type AdminNavGroup = {
  label: string;
  links: Array<{
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
  }>;
};

export function AdminMobileNav({ groups }: { groups: AdminNavGroup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-md bg-white/14 text-white lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-[min(82vw,300px)] overflow-y-auto bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
              <Link href="/admin" onClick={() => setOpen(false)} className="text-base font-black text-[#4285f4]">
                Me & Mommy
              </Link>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-700"
                aria-label="Close admin menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-4 px-3 py-4">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-1 px-2 text-[10px] font-black uppercase tracking-wide text-slate-400">{group.label}</p>
                  <div className="grid gap-1">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-[#4285f4] hover:text-white"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
