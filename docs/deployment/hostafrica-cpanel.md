# HostAfrica cPanel Deployment

This project can run on HostAfrica/cPanel as a Node.js app. Hosting it on the same cPanel account as MySQL avoids Vercel outbound-IP issues and lets the app connect to MySQL through `localhost`.

## 1. Create the subdomain

In cPanel:

1. Open **Domains** or **Subdomains**.
2. Create a subdomain such as `shop.meandmommy.co.ke` or `app.meandmommy.co.ke`.
3. Note the document root cPanel creates.

## 2. Clone the repository

In cPanel **Git Version Control**:

1. Choose **Create**.
2. Enable **Clone a Repository**.
3. Use the GitHub SSH URL for this repo.
4. Set repository path outside `public_html`, for example:

```text
/home/CPANEL_USER/apps/meandmommy
```

If the GitHub repo is private, add the cPanel SSH public key to GitHub as a deploy key.

## 3. Configure Node.js app

In cPanel **Setup Node.js App**:

```text
Node version: 20 or 22
Application mode: Production
Application root: apps/meandmommy
Application URL: your subdomain
Application startup file: server.cjs
```

Create the app but do not start it yet.

## 4. Add environment variables

In the Node.js app screen, add these environment variables. Also create an untracked `.env.production` file in the repository folder with the same values so cPanel Git deploy/build commands can read them.

```env
DATABASE_URL=mysql://codecham_meandmummy:YOUR_DB_PASSWORD@localhost:3306/codecham_meandmommy
NEXT_PUBLIC_SITE_URL=https://shop.meandmommy.co.ke
NEXTAUTH_URL=https://shop.meandmommy.co.ke
NEXTAUTH_SECRET=YOUR_LONG_RANDOM_SECRET

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

MPESA_ENV=production
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://shop.meandmommy.co.ke/api/mpesa/callback

EMAIL_PROVIDER=smtp
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=Me & Mommy <no-reply@meandmommy.co.ke>
SUPPORT_EMAIL=info@meandmommy.co.ke
```

Use your real subdomain instead of `shop.meandmommy.co.ke`.

## 5. Install, build, and sync DB

Open cPanel **Terminal**, then run:

```bash
cd ~/apps/meandmommy
corepack enable
corepack prepare pnpm@latest --activate
pnpm install --frozen-lockfile
pnpm db:generate
pnpm build
pnpm db:push
```

`pnpm build` creates a Next.js standalone server and copies `public` plus `.next/static` into the standalone output for cPanel hosting.

On shared hosting, keep the build worker profile small. This repo already sets `experimental.cpus = 1`, configures Next.js static generation concurrency to `1`, builds with webpack, and the cPanel deploy script exports:

```bash
NEXT_PRIVATE_BUILD_WORKER_COUNT=1
NODE_OPTIONS=--max-old-space-size=512
```

If HostAfrica still returns `EAGAIN`, stop extra Node processes from cPanel **Setup Node.js App**, then run the build again.

The database should already have data, but if you need to seed/reset starter content:

```bash
SEED_ADMIN_EMAIL=admin@meandmommy.co.ke SEED_ADMIN_PASSWORD='CHANGE_THIS' pnpm db:seed
```

## 6. Start or restart the app

Return to **Setup Node.js App** and click:

```text
Restart
```

Open your subdomain and test:

```text
/login
/admin
/checkout
```

## 7. Git deployment workflow

This repo includes `.cpanel.yml`, so cPanel can show deployment controls for the repository.

When you push changes to GitHub:

1. In cPanel Git Version Control, open the repository.
2. Click **Pull or Deploy**.
3. Pull latest changes.
4. Click **Deploy HEAD Commit**. cPanel runs `scripts/cpanel-deploy.sh`, which installs packages, generates Prisma, builds the standalone app, and touches `tmp/restart.txt`.
5. If the deployment includes schema changes, run `pnpm db:push` once from Terminal, or set `RUN_DB_PUSH=1` only for that deployment.

If your cPanel Git feature supports deployment hooks, place these commands in the deploy action.

## Notes

- Do not commit `.env`.
- Use `localhost` for MySQL only when the app and database are on the same HostAfrica/cPanel server.
- If `localhost` fails, ask HostAfrica for the local MySQL socket/host for this account.
- Uploaded product images are currently stored in MySQL as compressed data URLs. For many large uploads, move media to filesystem or object storage later.
