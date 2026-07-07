import test from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "../src/lib/search";
import { contactSchema, registerSchema } from "../src/lib/validation";
import { buildWhatsAppUrl } from "../src/lib/whatsapp";

const products = [
  {
    name: "Me & Mommy Breastmilk Storage Bags",
    slug: "me-and-mommy-breastmilk-storage-bags",
    shortDescription: "Leak-resistant freezer-friendly storage bags",
    description: "Pre-sterilised bags for expressed milk storage",
    categoryName: "Breastmilk Storage Bags",
  },
  {
    name: "Me & Mommy Sterilising Tablets",
    slug: "me-and-mommy-sterilising-tablets",
    shortDescription: "Cold-water baby bottle sterilising tablets",
    description: "For bottles, teats, breast pump parts, and feeding accessories",
    categoryName: "Sterilising Tablets",
  },
];

test("searchProducts matches product name, category, and description text", () => {
  assert.equal(searchProducts(products, "breastmilk").length, 1);
  assert.equal(searchProducts(products, "sterilising").length, 1);
  assert.equal(searchProducts(products, "pump parts").length, 1);
});

test("registerSchema trims and rejects weak registration data", () => {
  const result = registerSchema.safeParse({
    name: " A ",
    email: "bad-email",
    password: "short",
  });

  assert.equal(result.success, false);
});

test("contactSchema rejects short support messages", () => {
  const result = contactSchema.safeParse({
    name: "Mary Parent",
    email: "mary@example.com",
    subject: "Order help",
    message: "too short",
  });

  assert.equal(result.success, false);
});

test("buildWhatsAppUrl creates a wa.me link with a useful prefilled message", () => {
  const url = buildWhatsAppUrl();

  assert.match(url, /^https:\/\/wa\.me\/254724736495\?/);
  assert.match(decodeURIComponent(url), /Hello Me & Mommy/);
  assert.match(decodeURIComponent(url), /breastmilk storage bags/);
});
