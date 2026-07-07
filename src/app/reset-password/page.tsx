import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="container-shell grid min-h-[70vh] place-items-center py-12">
        <section className="w-full max-w-md">
          <h1 className="text-3xl font-black text-slate-950">Choose a new password</h1>
          <div className="mt-6">
            <Suspense fallback={<p>Loading reset form...</p>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

