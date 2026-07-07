import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoryImages = {
  diapers: "/images/categories/diapers.svg",
  bottles: "/images/categories/bottles.svg",
  steel: "/images/categories/steel.svg",
  soothers: "/images/categories/soothers.svg",
  sippers: "/images/categories/sippers.svg",
  teethers: "/images/categories/teethers.svg",
  care: "/images/categories/care.svg",
};

const categories = [
  {
    key: "diapers",
    name: "Baby Diaper",
    slug: "baby-diaper",
    description:
      "Shop soft baby diaper pants in Kenya for newborns, crawlers, and active toddlers. Me & Mommy diapers are selected for dryness, comfort, gentle fit, and everyday value for busy parents.",
  },
  {
    key: "bottles",
    name: "Feeding Bottle",
    slug: "feeding-bottle",
    description:
      "Buy BPA-free baby feeding bottles online in Nairobi, Kenya. Choose anti-colic bottles for newborn milk feeding, expressed breast milk, formula, travel, and daily mother and baby care.",
  },
  {
    key: "steel",
    name: "Steel Feeding Bottle",
    slug: "steel-feeding-bottle",
    description:
      "Premium stainless steel baby feeding bottles for parents who want durable, hygienic, easy-clean bottles for home, daycare, and travel.",
  },
  {
    key: "soothers",
    name: "Nipple & Soother",
    slug: "nipple-soother",
    description:
      "Soft silicone nipples, teats, pacifiers, and baby soothers for calm feeding, easier latch support, and comfort from newborn stage through early months.",
  },
  {
    key: "sippers",
    name: "Feeding Cup & Sipper",
    slug: "feeding-cup-sipper",
    description:
      "Baby feeding cups and sipper cups with easy-grip handles, soft spouts, and spill-aware designs for toddlers learning to drink independently.",
  },
  {
    key: "teethers",
    name: "Baby Teether",
    slug: "baby-teether",
    description:
      "Food-grade baby teethers for teething relief, sore gums, sensory play, and safe chewing during the 3 to 12 month teething stage.",
  },
  {
    key: "care",
    name: "Baby Care Product",
    slug: "baby-care-product",
    description:
      "Gentle baby care products for delicate newborn skin, bath time, grooming, powder application, and daily mother and baby routines.",
  },
] as const;

const products = [
  ["baby-diaper", "Small Baby Diaper Pants", "Soft newborn diaper pants for 3 to 8 kg babies, made for dry nights, easy changes, and gentle waist comfort.", "399.00", "465.00", "14% OFF", 60, true],
  ["baby-diaper", "Medium Baby Diaper Pants", "Comfortable medium baby diaper pants for 6 to 12 kg babies who crawl, nap, feed, and play through busy days.", "399.00", "465.00", "14% OFF", 72, true],
  ["baby-diaper", "Large Baby Diaper Pants", "Large baby diaper pants for 9 to 14 kg toddlers, with a soft fit parents can trust for daytime and overnight use.", "399.00", "465.00", "14% OFF", 58, true],
  ["baby-diaper", "Xtra Large Baby Diaper Pants", "Extra large toddler diaper pants for 13 to 19 kg babies who need flexible movement, absorbency, and quick pull-up changes.", "399.00", "499.00", "20% OFF", 44, false],
  ["feeding-bottle", "DEER Anti-Colic Feeding Bottle", "125ml BPA-free anti-colic baby feeding bottle for newborn milk, formula, and expressed breast milk.", "65.00", null, null, 80, true],
  ["feeding-bottle", "Unicorn Anti-Colic Feeding Bottle", "Cute 125ml anti-colic feeding bottle with a slim regular neck for easy holding, cleaning, and daily baby feeding.", "80.00", null, null, 70, true],
  ["feeding-bottle", "ZEBRA Anti-Colic Feeding Bottle", "BPA-free 125ml baby bottle for smooth milk flow, reduced air intake, and fuss-free feeding at home or on the go.", "90.00", "100.00", "10% OFF", 45, false],
  ["feeding-bottle", "Elephant Anti-Colic Feeding Bottle", "125ml purple BPA-free feeding bottle for newborn milk feeds, easy cleaning, and compact diaper-bag travel.", "100.00", null, null, 35, false],
  ["feeding-bottle", "Camel Anti-Colic Feeding Bottle", "250ml transparent anti-colic baby bottle for growing babies who need a larger milk bottle for longer feeds.", "85.00", null, null, 40, false],
  ["feeding-bottle", "Giraffe Anti-Colic Feeding Bottle", "250ml blue BPA-free baby feeding bottle for formula, milk, travel, and everyday parent-friendly feeding.", "110.00", null, null, 38, false],
  ["steel-feeding-bottle", "Primo Stainless Steel Feeding Bottle 150ml", "150ml stainless steel baby feeding bottle with anti-colic support, BPA-free parts, and hygienic everyday performance.", "550.00", null, null, 28, true],
  ["steel-feeding-bottle", "Primo Stainless Steel Feeding Bottle 260ml", "Durable 260ml stainless steel feeding bottle for safe baby milk storage, travel feeding, and easy cleaning.", "650.00", null, null, 22, false],
  ["nipple-soother", "Baby Silicone Nipple Pack of 4", "Pack of 4 soft silicone baby bottle nipples for slim-neck bottles, easy latch, anti-colic feeding, and leak-resistant use.", "120.00", null, null, 55, true],
  ["nipple-soother", "Anti-Colic Essential Teat Pack of 4", "Flexible silicone teat pack for bottle feeding support, natural-feel latch, and smoother milk flow for young babies.", "180.00", null, null, 42, false],
  ["nipple-soother", "Classic Soother Pack of 4", "Soft baby soother pack for 0 to 6 months, made for comfort, calming, and diaper-bag convenience.", "140.00", null, null, 48, false],
  ["feeding-cup-sipper", "Ample Sipper Cup 150ml", "150ml baby sipper cup with twin handles and covered spout, ideal for toddlers learning independent drinking.", "120.00", null, null, 40, true],
  ["feeding-cup-sipper", "2 in 1 Convertible Soft Spout Cup", "Anti-spill 150ml soft spout cup that converts between nipple and sipper for easy feeding transitions.", "160.00", null, null, 36, false],
  ["feeding-cup-sipper", "Soft Spout Sipper Cup 150ml", "Leak-resistant 150ml soft spout sipper cup with detachable handle for babies and toddlers from 0 to 24 months.", "170.00", null, null, 34, false],
  ["baby-teether", "Silicone Baby Teether", "Food-grade silicone baby teether with textured surfaces to massage sore gums and support safe chewing.", "120.00", null, null, 64, true],
  ["baby-teether", "Water Teether for 6 to 12 Months", "Easy-grip water-filled teether for 6 to 12 month babies, designed to cool, soothe, and comfort tender gums.", "130.00", null, null, 50, false],
  ["baby-teether", "Silicone Fruit Nibbler Teether", "Soft fruit nibbler and baby teether for safe first tastes, gum soothing, and parent-supervised feeding practice.", "160.00", "200.00", "20% OFF", 32, false],
  ["baby-care-product", "Panda Soft-Feel Powder Puff", "Soft baby powder puff with holder for newborn grooming, bath time care, and gentle powder application.", "110.00", null, null, 45, true],
  ["baby-care-product", "Rabbit Musicale Baby Powder Puff", "BPA-free soft-feel baby powder puff with holder container for clean, gentle daily baby care routines.", "160.00", null, null, 30, false],
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function seoDescription(categorySlug: string, name: string, shortDescription: string) {
  const category = categories.find((item) => item.slug === categorySlug)?.name || "baby care";
  return `${shortDescription} Buy ${name} online from Me & Mommy Kenya, your Nairobi store for trusted ${category.toLowerCase()}, newborn essentials, toddler care, fast checkout, M-Pesa payment, and parent-friendly prices.`;
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@meandmommy.co.ke";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Password";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      name: process.env.SEED_ADMIN_NAME || "Me & Mommy Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: Role.ADMIN,
    },
  });

  for (const [index, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: categoryImages[category.key],
        sortOrder: index + 1,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: categoryImages[category.key],
        sortOrder: index + 1,
      },
    });
  }

  for (const item of products) {
    const [categorySlug, name, shortDescription, price, compareAt, discountLabel, stock, featured] = item;
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: categorySlug },
    });
    const imageUrl = category.imageUrl || "/images/me-and-mommy-logo.png";

    await prisma.product.upsert({
      where: { slug: slugify(name) },
      update: {
        categoryId: category.id,
        shortDescription,
        description: seoDescription(categorySlug, name, shortDescription),
        price: compareAt || price,
        salePrice: compareAt ? price : null,
        discountLabel,
        stock,
        featured,
        isActive: true,
        images: {
          deleteMany: {},
          create: [{ url: imageUrl, alt: name, sortOrder: 1 }],
        },
      },
      create: {
        categoryId: category.id,
        name,
        slug: slugify(name),
        shortDescription,
        description: seoDescription(categorySlug, name, shortDescription),
        price: compareAt || price,
        salePrice: compareAt ? price : null,
        discountLabel,
        stock,
        featured,
        images: {
          create: [{ url: imageUrl, alt: name, sortOrder: 1 }],
        },
      },
    });
  }

  await prisma.offer.upsert({
    where: { code: "ME&MOMMY" },
    update: {
      name: "First Order Welcome Offer",
      description: "Welcome discount for new Me & Mommy shoppers.",
      discountType: "PERCENTAGE",
      discountValue: "5.00",
      audience: "FIRST_ORDER",
      isActive: true,
      showOnHome: true,
    },
    create: {
      name: "First Order Welcome Offer",
      code: "ME&MOMMY",
      description: "Welcome discount for new Me & Mommy shoppers.",
      discountType: "PERCENTAGE",
      discountValue: "5.00",
      audience: "FIRST_ORDER",
      isActive: true,
      showOnHome: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
