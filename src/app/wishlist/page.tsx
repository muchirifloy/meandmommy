import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">Wishlist</h1>
        <p className="mt-3 text-slate-600">Wishlist saving will be connected after the core order flow is complete.</p>
      </main>
      <Footer />
    </>
  );
}

