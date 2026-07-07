import test from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "../src/lib/search";
import { contactSchema, registerSchema } from "../src/lib/validation";
import { buildWhatsAppUrl } from "../src/lib/whatsapp";

const products = [
  {
    name: "Small Baby Diaper Pants",
    slug: "small-baby-diaper-pants",
    shortDescription: "For 3 to 8 kg",
    description: "Soft and reliable baby diapers",
    categoryName: "Baby Diaper",
  },
  {
    name: "DEER Anti-Colic Feeding Bottle",
    slug: "deer-anti-colic-feeding-bottle",
    shortDescription: "125ml BPA-free bottle",
    description: "Safe feeding bottle",
    categoryName: "Feeding Bottle",
  },
];

test("searchProducts matches product name, category, and description text", () => {
  assert.equal(searchProducts(products, "diaper").length, 1);
  assert.equal(searchProducts(products, "feeding").length, 1);
  assert.equal(searchProducts(products, "bpa free").length, 1);
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
  assert.match(decodeURIComponent(url), /baby care essentials/);
});
