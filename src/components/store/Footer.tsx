import Link from "next/link";
import { Camera, Mail, MapPin, Phone, Share2, Video } from "lucide-react";
import { getCatalog } from "@/lib/catalog";

export async function Footer() {
  const { categories } = await getCatalog();

  return (
    <footer className="mt-20 border-t border-sky-100 bg-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-black text-brand-dark">Me & Mommy</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Gentle baby-care essentials for feeding, hygiene, comfort, and everyday parent confidence.
          </p>
          <div className="mt-5 flex gap-3 text-brand-dark">
            <Share2 className="h-5 w-5" />
            <Camera className="h-5 w-5" />
            <Video className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Shop</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="hover:text-brand-dark">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Support</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <Link href="/account">My account</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/policies/shipping">Shipping Policy</Link>
            <Link href="/policies/refund">Refund Policy</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Customer Care</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p className="flex gap-2">
              <MapPin className="h-5 w-5 shrink-0 text-brand" />
              Nairobi, Kenya
            </p>
            <p className="flex gap-2">
              <Mail className="h-5 w-5 text-brand" />
              info@meandmommy.co.ke
            </p>
            <p className="flex gap-2">
              <Phone className="h-5 w-5 text-brand" />
              +254 724 736495
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
