import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoryImages = {
  storageBags: "/images/categories/breastmilk-storage-bags-category.webp",
  sterilisingTablets: "/images/categories/sterilising-tablets-category.webp",
  creamCare: "/images/categories/cream-care-category.webp",
  brushes: "/images/categories/brushes-toothbrushes-category.webp",
  breastPumps: "/images/categories/breast-pumps-category.webp",
};

const categories = [
  {
    key: "storageBags",
    name: "Breastmilk Storage Bags",
    slug: "breastmilk-storage-bags",
    description:
      "Leak-resistant breastmilk storage bags for expressing, freezing, labelling, and organising milk safely at home, work, daycare, or while travelling in Kenya.",
  },
  {
    key: "sterilisingTablets",
    name: "Sterilising Tablets",
    slug: "sterilising-tablets",
    description:
      "Baby bottle sterilising tablets for cold-water sterilising of bottles, teats, breast pump parts, cups, and feeding accessories after washing and rinsing.",
  },
  {
    key: "creamCare",
    name: "Cream & Body Care",
    slug: "cream-body-care",
    description:
      "Cream and body-care essentials for everyday family routines, including foot cream and gentle care add-ons that can be edited from admin.",
  },
  {
    key: "brushes",
    name: "Brushes & Toothbrushes",
    slug: "brushes-toothbrushes",
    description:
      "Soft baby toothbrushes, gum brushes, bottle brushes, teat brushes, and cleaning tools for feeding accessories and early oral care.",
  },
  {
    key: "breastPumps",
    name: "Breast Pumps & Accessories",
    slug: "breast-pumps-accessories",
    description:
      "Breast pumps, flanges, milk collection bottles, and pumping accessories for expressing mums who need practical milk-flow support.",
  },
] as const;

const productDescriptions: Record<string, string> = {
  "me-and-mommy-breastmilk-storage-bags":
    "Me & Mommy Breastmilk Storage Bags help breastfeeding and pumping mums store expressed milk with confidence. Each pack contains 30 pre-sterilised 220ml storage bags made for breast milk storage, freezer organisation, daycare labelling, and easy portion control, so parents can build a practical milk stash without messy containers. Use after expressing by pouring cooled milk into the bag, leaving space for expansion before freezing, sealing securely, and writing the date and amount on the label area. Store bags flat to save freezer space, thaw the oldest milk first, and follow your healthcare provider or recognised breast milk storage guidance for safe timing. These bags are ideal for working mums, exclusive pumpers, occasional expressers, night feeds, travel, and families who want clean, organised milk storage in Nairobi and across Kenya.",
  "me-and-mommy-sterilising-tablets":
    "Protect what matters most with Me & Mommy Sterilising Tablets. Keep your baby's feeding essentials clean and safe with a fast, effective, easy-to-use cold-water sterilising solution for bottles, teats, breast pump parts, pacifiers, toys, milk storage accessories, and weaning utensils. Each compact pack contains 30 tablets and is designed for everyday use at home, at night, at daycare, or while travelling. No boiling is needed when used according to the pack instructions. Wash items thoroughly before sterilising, dissolve one tablet in the recommended amount of cold water, fully submerge items with no trapped air bubbles, leave for the recommended sterilising time, then remove with clean hands or sterilised tongs and allow to drain before use. Made for mums, trusted by families, and created for every feed that matters.",
  "me-and-mommy-care-cream":
    "Me & Mommy Care Cream is an everyday cream and body-care add-on for family routines. The starter product is editable from the admin panel, making it easy to replace the image, wording, price, and stock when the final client cream details are confirmed. Use according to the product label and seek healthcare guidance for sensitive skin concerns.",
  "me-and-mommy-baby-brush-set":
    "Me & Mommy Baby Brush Set is a starter catalog item for soft toothbrushes, gum brushes, bottle brushes, and teat cleaning tools. It helps families keep feeding accessories and early oral-care items organised, with admin-editable details for the exact brush set, price, stock, and instructions.",
  "me-and-mommy-breast-pump-kit":
    "Me & Mommy Breast Pump Kit is a starter catalog item for breast pumps and pumping accessories. It is designed as an admin-editable placeholder for wearable pumps, manual pumps, flanges, collection bottles, and milk expression accessories that pair naturally with breastmilk storage bags.",
};

const products = [
  [
    "breastmilk-storage-bags",
    "Me & Mommy Breastmilk Storage Bags",
    "30 pre-sterilised 220ml breastmilk storage bags for expressing mums: leak-resistant, freezer-friendly, easy to label, and made for organised milk storage.",
    "599.00",
    "650.00",
    "30 PCS - 220ML",
    120,
    true,
  ],
  [
    "sterilising-tablets",
    "Me & Mommy Sterilising Tablets",
    "30-tablet pack for cold-water sterilising of bottles, teats, breast pump parts, pacifiers, toys, and feeding accessories.",
    "600.00",
    null,
    "30 TABLETS",
    140,
    true,
  ],
  [
    "cream-body-care",
    "Me & Mommy Care Cream",
    "Everyday cream and body-care starter product, ready for admin edits once final client cream details are confirmed.",
    "450.00",
    null,
    "CREAM CARE",
    60,
    false,
  ],
  [
    "brushes-toothbrushes",
    "Me & Mommy Baby Brush Set",
    "Soft toothbrushes, gum brushes, and bottle-cleaning brushes for baby feeding and early oral-care routines.",
    "350.00",
    null,
    "BRUSH SET",
    80,
    false,
  ],
  [
    "breast-pumps-accessories",
    "Me & Mommy Breast Pump Kit",
    "Breast pump and pumping-accessory starter product for expressing mums, pairing naturally with breastmilk storage bags.",
    "2500.00",
    null,
    "PUMP KIT",
    60,
    false,
  ],
] as const;

const productImages: Record<string, { url: string; alt: string }[]> = {
  "me-and-mommy-breastmilk-storage-bags": [
    { url: "/images/products/breastmilk-storage-bags-studio.webp", alt: "Colorful Me & Mommy breastmilk storage bags 220ml 30pcs product display" },
    { url: "/images/products/breastmilk-storage-bags-pack.jpeg", alt: "Me & Mommy breastmilk storage bags pack with filled milk storage bags" },
    { url: "/images/products/breastmilk-storage-bags-alt.jpeg", alt: "Me & Mommy breastmilk storage bags front pack 220ml 30pcs" },
  ],
  "me-and-mommy-sterilising-tablets": [
    { url: "/images/products/sterilising-tablets-studio.webp", alt: "Colorful Me & Mommy sterilising tablets 30 pack with sachets and baby bottle" },
    { url: "/images/products/sterilising-tablets-pack.jpeg", alt: "Me & Mommy sterilising tablets pack with tablet sachets" },
    { url: "/images/products/sterilising-tablets-alt.jpeg", alt: "Me & Mommy sterilising tablets boxes and sachets" },
  ],
  "me-and-mommy-care-cream": [
    { url: "/images/products/cream-studio.webp", alt: "Colorful cream and body care product display" },
    { url: "/images/products/cream.jpeg", alt: "Me & Mommy care cream product photo" },
    { url: "/images/products/cream2.jpeg", alt: "Me & Mommy care cream alternate product photo" },
  ],
  "me-and-mommy-baby-brush-set": [
    { url: "/images/products/baby-brush-set.webp", alt: "Colorful baby toothbrush and bottle brush set display" },
  ],
  "me-and-mommy-breast-pump-kit": [
    { url: "/images/products/breast-pump-kit.webp", alt: "Colorful breast pump and pumping accessories kit display" },
  ],
};

const videoGuides = [
  {
    title: "How to prepare a cold-water sterilising routine",
    footnote: "Wash first, dissolve, submerge fully, wait, then drain with clean hands or tongs.",
    url: "https://www.youtube.com/embed/",
    posterUrl: "/images/categories/sterilising-tablets-category.webp",
    productSlug: "me-and-mommy-sterilising-tablets",
    sortOrder: 1,
  },
  {
    title: "How to organise expressed milk bags",
    footnote: "Label with date and amount, store flat, and use the oldest milk first.",
    url: "https://www.youtube.com/embed/",
    posterUrl: "/images/categories/breastmilk-storage-bags-category.webp",
    productSlug: "me-and-mommy-breastmilk-storage-bags",
    sortOrder: 2,
  },
  {
    title: "How to pair feeding essentials",
    footnote: "Store milk in clean bags and sterilise feeding accessories before use.",
    url: "https://www.youtube.com/embed/",
    posterUrl: "/images/hero/me-and-mommy-hero-products.webp",
    productSlug: null,
    sortOrder: 3,
  },
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function seedDatabase(db = prisma) {
  const prisma = db;
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@meandmommy.co.ke";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Password";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      ...(process.env.SEED_ADMIN_PASSWORD ? { passwordHash: adminPasswordHash } : {}),
    },
    create: {
      name: process.env.SEED_ADMIN_NAME || "Me & Mommy Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const categorySlugs = categories.map((category) => category.slug);
  const productSlugs = products.map((product) => slugify(product[1]));

  await prisma.category.updateMany({
    where: { slug: { notIn: categorySlugs } },
    data: { isActive: false },
  });
  await prisma.product.updateMany({
    where: { slug: { notIn: productSlugs } },
    data: { isActive: false, featured: false },
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
    const slug = slugify(name);
    const images = productImages[slug] || [{ url: category.imageUrl || "/images/me-and-mommy-logo.png", alt: name }];

    await prisma.product.upsert({
      where: { slug },
      update: {
        categoryId: category.id,
        shortDescription,
        description: productDescriptions[slug],
        price: compareAt || price,
        salePrice: compareAt ? price : null,
        discountLabel,
        stock,
        featured,
        isActive: true,
        images: {
          deleteMany: {},
          create: images.map((image, index) => ({ ...image, sortOrder: index + 1 })),
        },
      },
      create: {
        categoryId: category.id,
        name,
        slug,
        shortDescription,
        description: productDescriptions[slug],
        price: compareAt || price,
        salePrice: compareAt ? price : null,
        discountLabel,
        stock,
        featured,
        images: {
          create: images.map((image, index) => ({ ...image, sortOrder: index + 1 })),
        },
      },
    });
  }

  await prisma.videoGuide.deleteMany({
    where: { title: { in: videoGuides.map((guide) => guide.title) } },
  });
  for (const guide of videoGuides) {
    const product = guide.productSlug
      ? await prisma.product.findUnique({ where: { slug: guide.productSlug } })
      : null;
    await prisma.videoGuide.create({
      data: {
        title: guide.title,
        footnote: guide.footnote,
        url: guide.url,
        posterUrl: guide.posterUrl,
        productId: product?.id,
        sortOrder: guide.sortOrder,
        isActive: true,
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

if (process.argv[1]?.replace(/\\/g, "/").endsWith("prisma/seed.ts")) {
  seedDatabase()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
