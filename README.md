# Me & Mommy Ecommerce

Real ecommerce storefront and admin platform for the Me & Mommy baby-care brand.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL
- NextAuth with email/password and Google provider support
- M-Pesa Express/STK checkout API integration

## Local Setup

```bash
pnpm install
cp .env.example .env
```

Fill `.env` with MySQL, auth, Google, and M-Pesa values.

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000`.

## Required Environment Variables

For a temporary Vercel storefront preview, the app can build without `DATABASE_URL`; public pages will use the fallback starter catalog. Real ecommerce features still require MySQL.

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `MPESA_ENV`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `NEXT_PUBLIC_SITE_URL`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`

## Hosting Checklist

1. Provision a MySQL database.
2. Set all environment variables from `.env.example`.
3. Run `pnpm install`.
4. Run `pnpm db:generate`.
5. Run `pnpm db:push` or `pnpm db:migrate`.
6. Run `pnpm db:seed` once for the first admin and starter catalog.
7. Build with `pnpm build`.
8. Start with `pnpm start`.

## Admin

The seed script creates the first admin user from:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Admin dashboard:

```text
/admin
```

Default local seed admin:

```text
Email: admin@meandmommy.co.ke
Password: Password
```

This account is created only after a real MySQL database is connected and `pnpm db:seed` has run. Change the password before production launch.

## Database

Yes, this project should be connected to MySQL before launch. The public catalog has a fallback starter catalog for Vercel previews and development, but real ecommerce features such as admin login, customer accounts, carts, checkout, vouchers, M-Pesa payment records, orders, reviews, support tickets, stock, analytics, and email campaigns all depend on the database.

## Notes

The old static template was archived in `legacy-template/` for reference. The live app is the Next.js project at the repository root.

## SEO

The app includes:

- Dynamic `robots.txt`
- Dynamic `sitemap.xml`
- OpenGraph image route
- Product/category metadata
- Product structured data for price, availability, brand, and category
- SEO-focused starter category and product copy for breastmilk storage bags and sterilising tablets
- Fast server-rendered pages

Ranking first is not something any codebase can honestly guarantee, but this gives the site the technical SEO foundation needed for indexing and ranking work.
