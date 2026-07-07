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
    <Link href={`/category/${category.slug}`} className="group relative overflow-hidden rounded-lg soft-card">
      <div className="relative aspect-[5/4] bg-brand-soft">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="text-xl font-black">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/86">{category.description}</p>
      </div>
    </Link>
  );
}

