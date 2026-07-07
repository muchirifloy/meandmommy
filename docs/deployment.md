# Deployment Guide

This project is arranged as a standard root-level Next.js app for easy hosting.

## Build Commands

```bash
pnpm install
pnpm db:generate
pnpm build
```

## Vercel

Recommended for the Next.js frontend/API layer.

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Set the framework to Next.js.
4. Set build command:

```bash
pnpm db:generate && pnpm build
```

5. For a quick storefront preview while MySQL is pending, add only:

```bash
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="https://your-vercel-url.vercel.app"
NEXT_PUBLIC_SITE_URL="https://your-vercel-url.vercel.app"
```

Without `DATABASE_URL`, the public storefront uses the built-in starter catalog. Admin login, customer accounts, checkout, M-Pesa records, reviews, support tickets, offers, stock, and analytics stay unavailable until MySQL is connected.

6. For the real ecommerce launch, add every variable from `.env.example`.
7. Use a hosted MySQL database, then set `DATABASE_URL`.
8. After the database is connected, run:

```bash
pnpm db:push
pnpm db:seed
```

You can run those from a local terminal against the production `DATABASE_URL` or from a deployment job.

## HostAfrica

Use HostAfrica if you want traditional hosting plus MySQL. Choose a plan that supports Node.js 20.9+ or newer. If using cPanel Node app hosting:

1. Upload/pull the repository.
2. Set application root to this project root.
3. Set startup command to `pnpm start`.
4. Build locally or through SSH with `pnpm install && pnpm db:generate && pnpm build`.
5. Create MySQL database in cPanel.
6. Set `DATABASE_URL` using the cPanel DB username/password/host.
7. Run `pnpm db:push && pnpm db:seed` once over SSH.

For M-Pesa, the callback URL must be public HTTPS:

```text
https://your-domain.com/api/mpesa/callback
```

## Runtime Command

```bash
pnpm start
```

## Database

Use any hosted MySQL provider. Set:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
```

For first deployment:

```bash
pnpm db:push
pnpm db:seed
```

Use `pnpm db:migrate` once migrations are formalized for production release cycles.

## M-Pesa

Set the Daraja values:

```bash
MPESA_ENV="sandbox"
MPESA_CONSUMER_KEY=""
MPESA_CONSUMER_SECRET=""
MPESA_SHORTCODE=""
MPESA_PASSKEY=""
MPESA_CALLBACK_URL="https://your-domain.com/api/mpesa/callback"
```

The callback URL must be publicly reachable by Safaricom.
