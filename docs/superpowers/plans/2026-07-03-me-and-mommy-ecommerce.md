# Me And Mommy Ecommerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static ecommerce template into a real Me & Mommy ecommerce platform with customer auth, admin auth, MySQL-backed catalog/order data, seeded baby-care products, cart, and M-Pesa STK checkout.

**Architecture:** Replace the static HTML/CSS/JS files with a Next.js App Router application. Use Prisma with MySQL for categories, products, users, carts, orders, and payments. Keep the storefront fast through Server Components, local seed data, optimized images, and small client components only where interaction is required.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, MySQL, Auth.js/NextAuth credentials and Google provider, bcrypt, Zod, M-Pesa Daraja STK Push API, local seed data.

---

## File Structure

- `src/app/(store)/page.tsx`: branded homepage with hero, categories, products, trust blocks, testimonials, and blog teasers.
- `src/app/(store)/category/[slug]/page.tsx`: category product listing.
- `src/app/(store)/product/[slug]/page.tsx`: product detail page.
- `src/app/(store)/cart/page.tsx`: customer cart view.
- `src/app/(store)/checkout/page.tsx`: checkout page with address and M-Pesa phone number.
- `src/app/admin/**`: protected admin dashboard, category manager, product manager, order manager.
- `src/app/account/**`: customer account and order history.
- `src/app/api/**`: auth, cart, checkout, M-Pesa callback, admin mutations.
- `src/components/store/**`: storefront UI components.
- `src/components/admin/**`: admin UI components.
- `src/lib/db.ts`: lazy Prisma client getter.
- `src/lib/auth.ts`: auth configuration and role helpers.
- `src/lib/mpesa.ts`: Daraja token and STK push helpers.
- `src/lib/catalog.ts`: catalog queries for storefront and admin.
- `prisma/schema.prisma`: MySQL schema.
- `prisma/seed.ts`: seed admin, categories, and Me & Mommy products.
- `.env.example`: required environment variables.

## Task 1: Scaffold Next.js App

**Files:**
- Create/replace: `package.json`, `src/app/**`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`

- [ ] Run `create-next-app` in the existing project with `--force`, TypeScript, Tailwind, ESLint, App Router, and `src` directory.
- [ ] Preserve the uploaded logo by copying `C:/Users/Admin/Downloads/flyer-me-and-mommy-.png` to `public/images/me-and-mommy-logo.png`.
- [ ] Remove obsolete static files after equivalent routes exist: `index.html`, `header.html`, `footer.html`, `slider.html`, `content*.html`, `cart.html`, `orderPlaced.html`, old CSS, old JS, and sample slider images.
- [ ] Verify the scaffold with `npm run build`.

## Task 2: Database Models

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `.env.example`

- [ ] Add Prisma MySQL datasource using `DATABASE_URL`.
- [ ] Add models: `User`, `Account`, `Session`, `VerificationToken`, `Category`, `Product`, `ProductImage`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `Address`.
- [ ] Use roles `CUSTOMER` and `ADMIN`.
- [ ] Add product fields for `price`, `salePrice`, `discountLabel`, `stock`, `featured`, `isActive`, `slug`, and `shortDescription`.
- [ ] Add order statuses `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
- [ ] Add payment statuses `PENDING`, `SUCCESS`, `FAILED`, `CANCELLED`.
- [ ] Generate Prisma client and verify schema formatting.

## Task 3: Seed Catalog

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`

- [ ] Seed categories: Baby Diaper, Feeding Bottle, Steel Feeding Bottle, Nipple & Soother, Feeding Cup & Sipper, Baby Teether, Baby Care Product.
- [ ] Seed starter products for the Me & Mommy catalog, including diaper sizes, anti-colic bottles, steel bottles, nipples, soothers, sipper cups, teethers, and baby powder puffs.
- [ ] Seed an admin user from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.
- [ ] Seed product images as remote URLs initially, with admin-editable image fields.
- [ ] Add `npm run db:seed`.

## Task 4: Auth

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/proxy.ts`

- [ ] Configure Auth.js with Google OAuth and credentials provider.
- [ ] Hash email/password registrations with bcrypt.
- [ ] Store minimal customer details: name, email, password hash for email users, role, phone optional.
- [ ] Protect `/admin` by checking `role === "ADMIN"` in server-side route code and proxy redirects.
- [ ] Protect `/account` and `/checkout` for signed-in customers.

## Task 5: Storefront UI

**Files:**
- Create: `src/app/(store)/page.tsx`
- Create: `src/app/(store)/layout.tsx`
- Create: `src/components/store/*.tsx`
- Create: `src/app/globals.css`

- [ ] Build a fast homepage using the logo color palette: light blue, white, soft sky, gentle pink accent, dark readable text.
- [ ] Replace generic clothing copy with Me & Mommy baby-care copy.
- [ ] Render category cards as primary navigation.
- [ ] Render product sub-cards with image, description, price, sale price, discount badge, stock state, and add-to-cart button.
- [ ] Add trust blocks: secure payments, online support, free returns, COD available, M-Pesa available.
- [ ] Add testimonials and blog teaser cards.
- [ ] Use `next/image` for all local images and standard `<img loading="lazy">` only for external seed URLs if needed.

## Task 6: Cart And Checkout

**Files:**
- Create: `src/lib/cart.ts`
- Create: `src/app/api/cart/route.ts`
- Create: `src/app/(store)/cart/page.tsx`
- Create: `src/app/(store)/checkout/page.tsx`

- [ ] Implement DB-backed carts for logged-in users.
- [ ] Support add, update quantity, remove, and clear cart.
- [ ] Calculate totals server-side from product prices.
- [ ] Collect customer name, phone, email, and delivery address at checkout.
- [ ] Create pending order before payment request.

## Task 7: M-Pesa STK Checkout

**Files:**
- Create: `src/lib/mpesa.ts`
- Create: `src/app/api/checkout/mpesa/route.ts`
- Create: `src/app/api/mpesa/callback/route.ts`

- [ ] Add env vars for `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_CALLBACK_URL`, and `MPESA_ENV`.
- [ ] Generate Daraja OAuth access token lazily inside request handlers.
- [ ] Send STK Push with normalized Kenyan phone format.
- [ ] Store checkout request ID and merchant request ID in `Payment`.
- [ ] Process callback and update payment/order status.
- [ ] Keep checkout pending until callback confirms success.

## Task 8: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/categories/page.tsx`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/components/admin/*.tsx`

- [ ] Show dashboard cards for revenue, pending orders, product count, low stock count.
- [ ] Build category create/edit/delete forms.
- [ ] Build product create/edit/delete forms with category, price, sale price, discount label, stock, image URLs, and active/featured toggles.
- [ ] Build order table with status update actions.
- [ ] Validate all admin mutations with Zod.

## Task 9: Verification

**Files:**
- Modify as needed.

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run Prisma generation.
- [ ] Start local dev server and smoke-test homepage, category page, product page, login/register, admin guard, cart, checkout form, and M-Pesa request validation.
- [ ] Confirm no old template dead links remain.
