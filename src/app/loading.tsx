import { BrandLoader } from "@/components/store/BrandLoader";

export default function Loading() {
  return (
    <main className="container-shell grid min-h-[55vh] place-items-center py-16">
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-sky-100">
        <BrandLoader label="Preparing something sweet..." />
      </div>
    </main>
  );
}
