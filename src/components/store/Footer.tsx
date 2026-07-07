import Image from "next/image";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone, Share2, Video } from "lucide-react";
import { getCatalog } from "@/lib/catalog";

export async function Footer() {
  const { categories } = await getCatalog();
  const visibleCategories = categories.slice(0, 4);

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-white">
      <div className="container-shell grid gap-7 py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-12">
        <div>
          <Link href="/" className="relative block h-12 w-48 rounded-lg bg-white px-3 py-2">
            <Image
              src="/images/me-and-mommy-logo.png"
              alt="Me & Mommy"
              fill
              sizes="192px"
              className="object-contain p-2"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Gentle baby-care essentials for feeding, hygiene, comfort, and everyday parent confidence.
          </p>
          <div className="mt-4 flex gap-3 text-sun">
            <Share2 className="h-5 w-5" />
            <Camera className="h-5 w-5" />
            <Video className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Shop</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300 sm:grid-cols-1">
            {visibleCategories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="hover:text-sun">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Support</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300 sm:grid-cols-1">
            <Link href="/account" className="hover:text-sun">My account</Link>
            <Link href="/orders" className="hover:text-sun">Orders</Link>
            <Link href="/policies/shipping" className="hover:text-sun">Shipping</Link>
            <Link href="/policies/refund" className="hover:text-sun">Refunds</Link>
            <Link href="/contact" className="hover:text-sun">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Customer Care</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <p className="flex gap-2">
              <MapPin className="h-5 w-5 shrink-0 text-sun" />
              Nairobi, Kenya
            </p>
            <p className="flex gap-2">
              <Mail className="h-5 w-5 shrink-0 text-sun" />
              info@meandmommy.co.ke
            </p>
            <p className="flex gap-2">
              <Phone className="h-5 w-5 shrink-0 text-sun" />
              +254 724 736495
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
