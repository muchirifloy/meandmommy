"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import { Archive, ImagePlus, Pencil, Plus, Star } from "lucide-react";
import { archiveProduct, createProduct, updateProduct } from "@/app/admin/actions";

type CategoryOption = {
  id: string;
  name: string;
};

export type AdminProductRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  discountLabel: string | null;
  stock: number;
  featured: boolean;
  isActive: boolean;
  images: { url: string; alt: string }[];
};

type ProductFormProps = {
  categories: CategoryOption[];
  product?: AdminProductRow;
  onDone?: () => void;
};

function money(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

async function compressImage(file: File) {
  if (file.size > 2 * 1024 * 1024) {
    throw new Error(`${file.name} is larger than 2MB.`);
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 1400;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image compression failed.");
  context.drawImage(bitmap, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function ImageUploadRibbon({
  existingImages,
  onChange,
}: {
  existingImages: { url: string; alt?: string }[];
  onChange: (value: string) => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    setError("");
    if (!files?.length) {
      setPreviews([]);
      onChange("");
      return;
    }

    try {
      const compressed = await Promise.all(Array.from(files).slice(0, 8).map(compressImage));
      setPreviews(compressed);
      onChange(compressed.join("\n"));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not compress image.");
      setPreviews([]);
      onChange("");
    }
  }

  const ribbonImages = [...existingImages, ...previews.map((url) => ({ url, alt: "New upload preview" }))].slice(0, 10);

  return (
    <div className="rounded-lg border border-dashed border-[#4285f4]/35 bg-sky-50 p-4">
      <div className="flex items-center gap-2 font-black text-slate-950">
        <ImagePlus className="h-5 w-5 text-[#4285f4]" />
        Images
      </div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        onChange={(event) => handleFiles(event.target.files)}
        className="mt-3 block w-full rounded-md bg-white px-3 py-2 text-sm"
      />
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Select images up to 2MB each. They are compressed in the browser before saving.
      </p>
      {error ? <p className="mt-2 text-xs font-black text-red-600">{error}</p> : null}
      {ribbonImages.length ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {ribbonImages.map((image, index) => (
            <div key={`${image.url.slice(0, 24)}-${index}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-slate-200">
              <Image src={image.url} alt={image.alt || "Product image"} fill sizes="64px" className="object-cover" unoptimized={image.url.startsWith("data:")} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductForm({ categories, product, onDone }: ProductFormProps) {
  const [compressedImages, setCompressedImages] = useState("");
  const [pending, startTransition] = useTransition();
  const isEditing = Boolean(product);
  const action = isEditing ? updateProduct : createProduct;
  const existingPrimary = product?.images[0]?.url || "";
  const existingRest = product?.images.slice(1).map((image) => image.url).join("\n") || "";

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await action(formData);
          onDone?.();
        });
      }}
      className="grid gap-4"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="compressedImageDataUrls" value={compressedImages} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Name
          <input name="name" required defaultValue={product?.name} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Slug
          <input name="slug" required defaultValue={product?.slug} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Category
          <select name="categoryId" required defaultValue={product?.categoryId || ""} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950">
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Stock
          <input name="stock" required type="number" defaultValue={product?.stock ?? 0} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Price
          <input name="price" required type="number" step="0.01" defaultValue={product?.price} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Sale price
          <input name="salePrice" type="number" step="0.01" defaultValue={product?.salePrice ?? undefined} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500 md:col-span-2">
          Discount label
          <input name="discountLabel" defaultValue={product?.discountLabel || ""} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
      </div>
      <label className="grid gap-1 text-xs font-black text-slate-500">
        Short description
        <input name="shortDescription" required defaultValue={product?.shortDescription} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
      </label>
      <label className="grid gap-1 text-xs font-black text-slate-500">
        Full description
        <textarea name="description" required defaultValue={product?.description} className="min-h-32 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Primary image URL
          <input name="imageUrl" defaultValue={existingPrimary} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
        <label className="grid gap-1 text-xs font-black text-slate-500">
          Extra image URLs
          <textarea name="imageUrls" defaultValue={existingRest} className="min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-950" />
        </label>
      </div>
      <ImageUploadRibbon existingImages={product?.images || []} onChange={setCompressedImages} />
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <input name="featured" type="checkbox" value="true" defaultChecked={product?.featured} />
        Featured product
      </label>
      <button disabled={pending} className="justify-self-start rounded-full bg-[#4285f4] px-5 py-2.5 text-sm font-black text-white hover:bg-[#2f6fd1] disabled:opacity-60">
        {pending ? "Saving..." : isEditing ? "Save product" : "Create product"}
      </button>
    </form>
  );
}

function ProductModal({
  categories,
  product,
  label,
}: {
  categories: CategoryOption[];
  product?: AdminProductRow;
  label: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:border-[#4285f4] hover:text-[#4285f4]"
      >
        {product ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        {label}
      </button>
      <dialog ref={dialogRef} className="w-[min(980px,calc(100%-24px))] rounded-lg p-0 shadow-2xl backdrop:bg-slate-950/60">
        <div className="max-h-[88vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Product Management</p>
              <h2 className="text-xl font-black text-slate-950">{product ? product.name : "Add product"}</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
              Close
            </button>
          </div>
          <div className="p-5">
            <ProductForm categories={categories} product={product} onDone={() => dialogRef.current?.close()} />
          </div>
        </div>
      </dialog>
    </>
  );
}

export function AdminProductManager({
  categories,
  products,
}: {
  categories: CategoryOption[];
  products: AdminProductRow[];
}) {
  const stats = useMemo(
    () => ({
      active: products.filter((product) => product.isActive).length,
      total: products.length,
      featured: products.filter((product) => product.featured).length,
      lowStock: products.filter((product) => product.stock <= 10).length,
    }),
    [products],
  );

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#4285f4]">Product Management</p>
          <h1 className="text-2xl font-black text-slate-950">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Full-width rows with modal editing, image ribbons, and compressed uploads.</p>
        </div>
        <ProductModal categories={categories} label="Add product" />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Active products", stats.active],
          ["Total products", stats.total],
          ["Featured", stats.featured],
          ["Low stock", stats.lowStock],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {products.map((product) => (
          <div key={product.id} className="grid gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-0 lg:grid-cols-[64px_1fr_130px_110px_100px_150px] lg:items-center">
            <div className="relative h-14 w-14 overflow-hidden rounded-md bg-slate-100">
              {product.images[0]?.url ? (
                <Image src={product.images[0].url} alt={product.name} fill sizes="56px" className="object-cover" unoptimized={product.images[0].url.startsWith("data:")} />
              ) : null}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-slate-950">{product.name}</strong>
                {product.featured ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" /> : null}
                {!product.isActive ? <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">Archived</span> : null}
              </div>
              <p className="mt-1 text-xs text-slate-500">{product.slug} - {product.images.length} images</p>
            </div>
            <span>{product.categoryName}</span>
            <span className={product.stock <= 10 ? "font-black text-rose-600" : "font-bold text-slate-700"}>{product.stock} stock</span>
            <span className="font-black text-[#4285f4]">{money(product.salePrice || product.price)}</span>
            <div className="flex flex-wrap gap-2">
              <ProductModal categories={categories} product={product} label="Edit" />
              <form action={archiveProduct}>
                <input type="hidden" name="id" value={product.id} />
                <button className="inline-flex items-center gap-2 rounded-full border border-red-100 px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">
                  <Archive className="h-3.5 w-3.5" />
                  Archive
                </button>
              </form>
            </div>
          </div>
        ))}
        {!products.length ? <p className="p-5 text-sm text-slate-500">No products yet.</p> : null}
      </div>
    </section>
  );
}
