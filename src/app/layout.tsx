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
    "Shop Me & Mommy baby care essentials: diapers, feeding bottles, teethers, soothers, sippers, and gentle care products.",
  keywords: [
    "Me and Mommy",
    "Me & Mommy",
    "baby diapers",
    "feeding bottles",
    "baby teether",
    "baby care products",
    "BPA free feeding bottle",
    "baby products online",
  ],
  openGraph: {
    title: "Me & Mommy | Baby Care Essentials",
    description:
      "Thoughtful baby care essentials for Kenyan parents: diapers, feeding bottles, teethers, soothers, and care products.",
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
