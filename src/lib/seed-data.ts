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
    "Me & Mommy Breastmilk Storage Bags help breastfeeding and pumping mums store expressed milk with confidence. Each bag is made for breast milk storage, freezer organisation, daycare labelling, and easy portion control, so parents can build a practical milk stash without messy containers. Use after expressing by pouring cooled milk into the bag, leaving space for expansion before freezing, sealing securely, and writing the date and amount on the label area. Store bags flat to save freezer space, thaw the oldest milk first, and follow your healthcare provider or recognised breast milk storage guidance for safe timing. These bags are ideal for working mums, exclusive pumpers, occasional expressers, night feeds, travel, and families who want clean, organised milk storage in Nairobi and across Kenya.",
  "me-and-mommy-sterilising-tablets":
    "Me & Mommy Sterilising Tablets are made for parents who want a simple cold-water sterilising routine for baby bottles, teats, breast pump parts, pacifiers, cups, and feeding accessories. After feeds, wash items in warm soapy water, brush bottle and teat areas, rinse well, then prepare the sterilising solution according to the pack instructions and fully immerse clean feeding items for the recommended contact time. Cold-water sterilising is useful at home, during travel, at night, and anywhere steam sterilising is inconvenient. These tablets support hygienic feeding routines for newborns and infants, especially when bottles and pump parts are used every day.",
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
    "Pre-sterilised milk storage bags for expressing mums: leak-resistant, freezer-friendly, easy to label, and made for organised breast milk storage.",
    650,
    599,
    "BEST SELLER",
    120,
    true,
  ],
  [
    "sterilising-tablets",
    "Me & Mommy Sterilising Tablets",
    "Cold-water baby bottle sterilising tablets for bottles, teats, pump parts, and feeding accessories after washing and rinsing.",
    450,
    399,
    "HYGIENE ESSENTIAL",
    140,
    true,
  ],
];

const imageFor = (slug: string) =>
  seedCategories.find((category) => category.slug === slug)?.imageUrl ||
  "/images/me-and-mommy-logo.png";

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
    imageUrl: imageFor(categorySlug),
  };
});
