import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className="container-shell grid min-h-[70vh] place-items-center py-12">
        <section className="w-full max-w-md">
          <h1 className="text-3xl font-black text-slate-950">Reset your password</h1>
          <p className="mt-2 text-slate-600">Enter your email and we will create a secure reset link.</p>
          <div className="mt-6"><ForgotPasswordForm /></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

