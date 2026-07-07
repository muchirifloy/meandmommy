import Image from "next/image";
import Link from "next/link";
import { Heart, Search, UserRound } from "lucide-react";
import { HeaderChrome } from "@/components/store/HeaderChrome";
import { HeaderCartLink } from "@/components/store/HeaderCartLink";
import { HeaderMobileControls } from "@/components/store/HeaderMobileControls";
import { getCatalog } from "@/lib/catalog";

export async function Header() {
  const { categories } = await getCatalog();

  return (
    <HeaderChrome>
      <div className="container-shell flex min-h-16 items-center gap-3 py-2 md:min-h-20 md:gap-5">
        <Link href="/" className="relative h-10 w-28 shrink-0 sm:w-44 md:h-12 md:w-52">
          <Image
            src="/images/me-and-mommy-logo.png"
            alt="Me & Mommy"
            fill
            sizes="208px"
            priority
            className="object-contain object-left"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-2 text-sm font-bold text-white lg:flex">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="rounded-full px-3 py-2 text-white transition duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-sun hover:text-slate-950 hover:shadow-lg"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <form action="/search" className="hidden w-72 items-center rounded-full border border-white/20 bg-white px-4 py-2 text-slate-950 lg:flex">
          <Search className="h-4 w-4 text-brand-dark" />
          <input
            name="q"
            placeholder="Search storage bags"
            className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <HeaderMobileControls categories={categories} />
          <Link href="/account" className="rounded-full p-2.5 text-white transition hover:bg-sun hover:text-slate-950">
            <UserRound className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" className="hidden rounded-full p-2.5 text-white transition hover:bg-sun hover:text-slate-950 sm:inline-flex">
            <Heart className="h-5 w-5" />
          </Link>
          <HeaderCartLink />
        </div>
      </div>
    </HeaderChrome>
  );
}
