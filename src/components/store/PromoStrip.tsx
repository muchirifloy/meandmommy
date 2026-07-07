import { Sparkles } from "lucide-react";
import { promoMessages } from "@/lib/promotions";

export function PromoStrip() {
  return (
    <div className="overflow-hidden bg-slate-950 py-2 text-white">
      <div className="flex w-max animate-[review-marquee_28s_linear_infinite] gap-8 px-4">
        {[...promoMessages, ...promoMessages, ...promoMessages].map((message, index) => (
          <span key={`${message}-${index}`} className="inline-flex items-center gap-2 text-sm font-black">
            <Sparkles className="h-4 w-4 text-sun" />
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}

