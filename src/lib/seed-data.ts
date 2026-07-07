export type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

export type SeedProduct = {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  discountLabel?: string;
  stock: number;
  featured: boolean;
  imageUrl: string;
};

export const seedCategories: SeedCategory[] = [
  {
    name: "Breastmilk Storage Bags",
    slug: "breastmilk-storage-bags",
    description:
      "Leak-resistant breastmilk storage bags for expressing, freezing, labelling, and organising milk safely at home, work, daycare, or while travelling in Kenya.",
    imageUrl: "/images/categories/breastmilk-storage-bags.svg",
  },
  {
    name: "Sterilising Tablets",
    slug: "sterilising-tablets",
    description:
      "Baby bottle sterilising tablets for cold-water sterilising of bottles, teats, breast pump parts, cups, and feeding accessories after washing and rinsing.",
    imageUrl: "/images/categories/sterilising-tablets.svg",
  },
];

const productDescriptions: Record<string, string> = {
  "me-and-mommy-breastmilk-storage-bags":
    "Me & Mommy Breastmilk Storage Bags help breastfeeding and pumping mums store expressed milk with confidence. Each pack contains 30 pre-sterilised 220ml storage bags made for breast milk storage, freezer organisation, daycare labelling, and easy portion control, so parents can build a practical milk stash without messy containers. Use after expressing by pouring cooled milk into the bag, leaving space for expansion before freezing, sealing securely, and writing the date and amount on the label area. Store bags flat to save freezer space, thaw the oldest milk first, and follow your healthcare provider or recognised breast milk storage guidance for safe timing. These bags are ideal for working mums, exclusive pumpers, occasional expressers, night feeds, travel, and families who want clean, organised milk storage in Nairobi and across Kenya.",
  "me-and-mommy-sterilising-tablets":
    "Protect what matters most with Me & Mommy Sterilising Tablets. Keep your baby's feeding essentials clean and safe with a fast, effective, easy-to-use cold-water sterilising solution for bottles, teats, breast pump parts, pacifiers, toys, milk storage accessories, and weaning utensils. Each compact pack contains 30 tablets and is designed for everyday use at home, at night, at daycare, or while travelling. No boiling is needed when used according to the pack instructions. Wash items thoroughly before sterilising, dissolve one tablet in the recommended amount of cold water, fully submerge items with no trapped air bubbles, leave for the recommended sterilising time, then remove with clean hands or sterilised tongs and allow to drain before use. Made for mums, trusted by families, and created for every feed that matters.",
};

type SeedProductRow = [
  categorySlug: string,
  name: string,
  shortDescription: string,
  price: number,
  salePrice: number | undefined,
  discountLabel: string | undefined,
  stock: number,
  featured: boolean,
];

const seedProductRows: SeedProductRow[] = [
  [
    "breastmilk-storage-bags",
    "Me & Mommy Breastmilk Storage Bags",
    "30 pre-sterilised 220ml breastmilk storage bags for expressing mums: leak-resistant, freezer-friendly, easy to label, and made for organised milk storage.",
    650,
    599,
    "30 PCS - 220ML",
    120,
    true,
  ],
  [
    "sterilising-tablets",
    "Me & Mommy Sterilising Tablets",
    "30-tablet pack for cold-water sterilising of bottles, teats, breast pump parts, pacifiers, toys, and feeding accessories.",
    600,
    undefined,
    "30 TABLETS",
    140,
    true,
  ],
];

const productImages: Record<string, string> = {
  "me-and-mommy-breastmilk-storage-bags": "/images/products/breastmilk-storage-bags-pack.jpeg",
  "me-and-mommy-sterilising-tablets": "/images/products/sterilising-tablets-pack.jpeg",
};

export const seedProducts: SeedProduct[] = seedProductRows.map(([categorySlug, name, shortDescription, price, salePrice, discountLabel, stock, featured]) => {
  const slug = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id: slug,
    categorySlug,
    name,
    slug,
    shortDescription,
    description: productDescriptions[slug],
    price,
    salePrice,
    discountLabel,
    stock,
    featured,
    imageUrl: productImages[slug] || "/images/me-and-mommy-logo.png",
  };
});
