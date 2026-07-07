import Image from "next/image";

export function BrandLoader({ label = "Loading", compact = false }: { label?: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span
        className={`relative inline-flex shrink-0 animate-pulse rounded-full bg-white shadow-sm ring-1 ring-sky-100 ${
          compact ? "h-6 w-6" : "h-7 w-16 px-2 py-1"
        }`}
      >
        <Image
          src="/images/me-and-mommy-logo.png"
          alt=""
          fill
          sizes={compact ? "24px" : "64px"}
          className="object-contain p-1"
        />
      </span>
      {label ? <span>{label}</span> : null}
    </span>
  );
}
