import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { SupportForm } from "@/components/support/SupportForm";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">Contact Us</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
            <p className="text-slate-600">Location: Nairobi, Kenya</p>
            <p className="mt-3 text-slate-600">Email: info@meandmommy.co.ke</p>
            <p className="mt-2 text-slate-600">Customer care: +254 724 736495</p>
          </div>
          <SupportForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
