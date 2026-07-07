import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  category: {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
  };
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group min-w-[150px] overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square bg-sky-50">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 42vw, 220px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-slate-950">{category.name}</h3>
      </div>
    </Link>
  );
}
