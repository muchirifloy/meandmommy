import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">Shipping Policy</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Shipping rules, delivery zones, and fees are managed by the store team and can be customized before launch.
        </p>
      </main>
      <Footer />
    </>
  );
}

