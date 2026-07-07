import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="container-shell py-12">
        <h1 className="text-4xl font-black text-slate-950">Refund Policy</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Refund and return rules can be edited before launch to match the final business policy.
        </p>
      </main>
      <Footer />
    </>
  );
}

