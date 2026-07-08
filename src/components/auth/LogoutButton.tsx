"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        compact && onDark
          ? "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-black text-white transition hover:border-sun hover:bg-sun hover:text-slate-950"
          : compact
          ? "inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-brand hover:text-brand-dark"
          : "inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark"
      }
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
