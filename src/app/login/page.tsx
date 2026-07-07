import Link from "next/link";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="container-shell grid min-h-[70vh] place-items-center py-12">
        <section className="w-full max-w-md">
          <h1 className="text-3xl font-black text-slate-950">Welcome back</h1>
          <p className="mt-2 text-slate-600">Login to manage your cart, checkout, and orders.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            New here? <Link href="/register" className="font-black text-brand-dark">Create an account</Link>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Forgot password? <Link href="/forgot-password" className="font-black text-brand-dark">Reset it securely</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
