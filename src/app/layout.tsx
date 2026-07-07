import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AttentionTitle } from "@/components/store/AttentionTitle";
import { WhatsAppFloatingButton } from "@/components/store/WhatsAppFloatingButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://meandmommy.co.ke"),
  title: {
    default: "Me & Mommy | Baby Care Essentials",
    template: "%s | Me & Mommy",
  },
  description:
    "Shop Me & Mommy breastmilk storage bags, sterilising tablets, baby brushes, breast pump accessories, and cream care products for safer feeding routines in Kenya.",
  keywords: [
    "Me and Mommy",
    "Me & Mommy",
    "breastmilk storage bags Kenya",
    "breast milk storage bags Nairobi",
    "sterilising tablets Kenya",
    "baby bottle sterilising tablets",
    "breast pump sterilising tablets",
    "baby toothbrush Kenya",
    "baby bottle brush Kenya",
    "breast pump Kenya",
    "breast pump accessories Kenya",
    "baby cream Kenya",
    "expressed milk storage",
  ],
  openGraph: {
    title: "Me & Mommy | Breastmilk Storage Bags, Sterilising Tablets & Baby Care Kenya",
    description:
      "Breastmilk storage bags, sterilising tablets, brushes, breast pump accessories, and cream care products for clean, organised parenting routines.",
    url: "/",
    siteName: "Me & Mommy",
    type: "website",
    images: [{ url: "/images/hero/me-and-mommy-hero-products.webp", width: 1600, height: 900, alt: "Me & Mommy baby feeding essentials in Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Me & Mommy Baby Feeding & Care Essentials Kenya",
    description:
      "Shop breastmilk storage bags, sterilising tablets, brushes, pump accessories, and cream care products.",
    images: ["/images/hero/me-and-mommy-hero-products.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AttentionTitle />
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
