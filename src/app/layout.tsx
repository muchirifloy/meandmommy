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
    "Shop Me & Mommy breastmilk storage bags and sterilising tablets for safer expressing, milk storage, feeding, and bottle care routines in Kenya.",
  keywords: [
    "Me and Mommy",
    "Me & Mommy",
    "breastmilk storage bags Kenya",
    "breast milk storage bags Nairobi",
    "sterilising tablets Kenya",
    "baby bottle sterilising tablets",
    "breast pump sterilising tablets",
    "expressed milk storage",
  ],
  openGraph: {
    title: "Me & Mommy | Baby Care Essentials",
    description:
      "Breastmilk storage bags and sterilising tablets for clean, organised feeding routines.",
    url: "/",
    siteName: "Me & Mommy",
    type: "website",
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
