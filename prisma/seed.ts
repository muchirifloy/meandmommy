import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoryImages = {
  storageBags: "/images/categories/breastmilk-storage-bags.svg",
  sterilisingTablets: "/images/categories/sterilising-tablets.svg",
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
] as const;

const productDescriptions: Record<string, string> = {
  "me-and-mommy-breastmilk-storage-bags":
    "Me & Mommy Breastmilk Storage Bags help breastfeeding and pumping mums store expressed milk with confidence. Each pack contains 30 pre-sterilised 220ml storage bags made for breast milk storage, freezer organisation, daycare labelling, and easy portion control, so parents can build a practical milk stash without messy containers. Use after expressing by pouring cooled milk into the bag, leaving space for expansion before freezing, sealing securely, and writing the date and amount on the label area. Store bags flat to save freezer space, thaw the oldest milk first, and follow your healthcare provider or recognised breast milk storage guidance for safe timing. These bags are ideal for working mums, exclusive pumpers, occasional expressers, night feeds, travel, and families who want clean, organised milk storage in Nairobi and across Kenya.",
  "me-and-mommy-sterilising-tablets":
    "Protect what matters most with Me & Mommy Sterilising Tablets. Keep your baby's feeding essentials clean and safe with a fast, effective, easy-to-use cold-water sterilising solution for bottles, teats, breast pump parts, pacifiers, toys, milk storage accessories, and weaning utensils. Each compact pack contains 30 tablets and is designed for everyday use at home, at night, at daycare, or while travelling. No boiling is needed when used according to the pack instructions. Wash items thoroughly before sterilising, dissolve one tablet in the recommended amount of cold water, fully submerge items with no trapped air bubbles, leave for the recommended sterilising time, then remove with clean hands or sterilised tongs and allow to drain before use. Made for mums, trusted by families, and created for every feed that matters.",
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
] as const;

const productImages: Record<string, string> = {
  "me-and-mommy-breastmilk-storage-bags": "/images/products/breastmilk-storage-bags-pack.jpeg",
  "me-and-mommy-sterilising-tablets": "/images/products/sterilising-tablets-pack.jpeg",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
    const imageUrl = productImages[slug] || category.imageUrl || "/images/me-and-mommy-logo.png";

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
          create: [{ url: imageUrl, alt: name, sortOrder: 1 }],
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
