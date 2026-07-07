import Link from "next/link";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="container-shell grid min-h-[70vh] place-items-center py-12">
        <section className="w-full max-w-md">
          <h1 className="text-3xl font-black text-slate-950">Create account</h1>
          <p className="mt-2 text-slate-600">Only essential details: name, email, password, and optional phone.</p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Already registered? <Link href="/login" className="font-black text-brand-dark">Login</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

