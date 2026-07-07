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
    name: "Baby Diaper",
    slug: "baby-diaper",
    description:
      "Shop soft baby diaper pants in Kenya for newborns, crawlers, and active toddlers. Me & Mommy diapers are selected for dryness, comfort, gentle fit, and everyday value for busy parents.",
    imageUrl:
      "/images/categories/diapers.svg",
  },
  {
    name: "Feeding Bottle",
    slug: "feeding-bottle",
    description:
      "Buy BPA-free baby feeding bottles online in Nairobi, Kenya. Choose anti-colic bottles for newborn milk feeding, expressed breast milk, formula, travel, and daily mother and baby care.",
    imageUrl:
      "/images/categories/bottles.svg",
  },
  {
    name: "Steel Feeding Bottle",
    slug: "steel-feeding-bottle",
    description:
      "Premium stainless steel baby feeding bottles for parents who want durable, hygienic, easy-clean bottles for home, daycare, and travel.",
    imageUrl:
      "/images/categories/steel.svg",
  },
  {
    name: "Nipple & Soother",
    slug: "nipple-soother",
    description:
      "Soft silicone nipples, teats, pacifiers, and baby soothers for calm feeding, easier latch support, and comfort from newborn stage through early months.",
    imageUrl:
      "/images/categories/soothers.svg",
  },
  {
    name: "Feeding Cup & Sipper",
    slug: "feeding-cup-sipper",
    description:
      "Baby feeding cups and sipper cups with easy-grip handles, soft spouts, and spill-aware designs for toddlers learning to drink independently.",
    imageUrl: "/images/categories/sippers.svg",
  },
  {
    name: "Baby Teether",
    slug: "baby-teether",
    description:
      "Food-grade baby teethers for teething relief, sore gums, sensory play, and safe chewing during the 3 to 12 month teething stage.",
    imageUrl:
      "/images/categories/teethers.svg",
  },
  {
    name: "Baby Care Product",
    slug: "baby-care-product",
    description:
      "Gentle baby care products for delicate newborn skin, bath time, grooming, powder application, and daily mother and baby routines.",
    imageUrl:
      "/images/categories/care.svg",
  },
];

const imageFor = (slug: string) =>
  seedCategories.find((category) => category.slug === slug)?.imageUrl ||
  "/images/me-and-mommy-logo.png";

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
  ["baby-diaper", "Small Baby Diaper Pants", "Soft newborn diaper pants for 3 to 8 kg babies, made for dry nights, easy changes, and gentle waist comfort.", 465, 399, "14% OFF", 60, true],
  ["baby-diaper", "Medium Baby Diaper Pants", "Comfortable medium baby diaper pants for 6 to 12 kg babies who crawl, nap, feed, and play through busy days.", 465, 399, "14% OFF", 72, true],
  ["baby-diaper", "Large Baby Diaper Pants", "Large baby diaper pants for 9 to 14 kg toddlers, with a soft fit parents can trust for daytime and overnight use.", 465, 399, "14% OFF", 58, true],
  ["baby-diaper", "Xtra Large Baby Diaper Pants", "Extra large toddler diaper pants for 13 to 19 kg babies who need flexible movement, absorbency, and quick pull-up changes.", 499, 399, "20% OFF", 44, false],
  ["feeding-bottle", "DEER Anti-Colic Feeding Bottle", "125ml BPA-free anti-colic baby feeding bottle for newborn milk, formula, and expressed breast milk.", 65, undefined, undefined, 80, true],
  ["feeding-bottle", "Unicorn Anti-Colic Feeding Bottle", "Cute 125ml anti-colic feeding bottle with a slim regular neck for easy holding, cleaning, and daily baby feeding.", 80, undefined, undefined, 70, true],
  ["feeding-bottle", "ZEBRA Anti-Colic Feeding Bottle", "BPA-free 125ml baby bottle for smooth milk flow, reduced air intake, and fuss-free feeding at home or on the go.", 100, 90, "10% OFF", 45, false],
  ["feeding-bottle", "Camel Anti-Colic Feeding Bottle", "250ml transparent anti-colic baby bottle for growing babies who need a larger milk bottle for longer feeds.", 85, undefined, undefined, 40, false],
  ["steel-feeding-bottle", "Primo Stainless Steel Feeding Bottle 150ml", "150ml stainless steel baby feeding bottle with anti-colic support, BPA-free parts, and hygienic everyday performance.", 550, undefined, undefined, 28, true],
  ["steel-feeding-bottle", "Primo Stainless Steel Feeding Bottle 260ml", "Durable 260ml stainless steel feeding bottle for safe baby milk storage, travel feeding, and easy cleaning.", 650, undefined, undefined, 22, false],
  ["nipple-soother", "Baby Silicone Nipple Pack of 4", "Pack of 4 soft silicone baby bottle nipples for slim-neck bottles, easy latch, anti-colic feeding, and leak-resistant use.", 120, undefined, undefined, 55, true],
  ["nipple-soother", "Anti-Colic Essential Teat Pack of 4", "Flexible silicone teat pack for bottle feeding support, natural-feel latch, and smoother milk flow for young babies.", 180, undefined, undefined, 42, false],
  ["feeding-cup-sipper", "Ample Sipper Cup 150ml", "150ml baby sipper cup with twin handles and covered spout, ideal for toddlers learning independent drinking.", 120, undefined, undefined, 40, true],
  ["feeding-cup-sipper", "2 in 1 Convertible Soft Spout Cup", "Anti-spill 150ml soft spout cup that converts between nipple and sipper for easy feeding transitions.", 160, undefined, undefined, 36, false],
  ["baby-teether", "Silicone Baby Teether", "Food-grade silicone baby teether with textured surfaces to massage sore gums and support safe chewing.", 120, undefined, undefined, 64, true],
  ["baby-teether", "Water Teether for 6 to 12 Months", "Easy-grip water-filled teether for 6 to 12 month babies, designed to cool, soothe, and comfort tender gums.", 130, undefined, undefined, 50, false],
  ["baby-care-product", "Panda Soft-Feel Powder Puff", "Soft baby powder puff with holder for newborn grooming, bath time care, and gentle powder application.", 110, undefined, undefined, 45, true],
  ["baby-care-product", "Rabbit Musicale Baby Powder Puff", "BPA-free soft-feel baby powder puff with holder container for clean, gentle daily baby care routines.", 160, undefined, undefined, 30, false],
];

const seoDescription = (categorySlug: string, name: string, shortDescription: string) => {
  const category = seedCategories.find((item) => item.slug === categorySlug)?.name || "baby care";
  return `${shortDescription} Buy ${name} online from Me & Mommy Kenya, your Nairobi store for trusted ${category.toLowerCase()}, newborn essentials, toddler care, fast checkout, M-Pesa payment, and parent-friendly prices.`;
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
    description: seoDescription(categorySlug, name, shortDescription),
    price,
    salePrice,
    discountLabel,
    stock,
    featured,
    imageUrl: imageFor(categorySlug),
  };
});
