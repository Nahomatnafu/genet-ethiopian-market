import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Ethiopian & Eritrean Traditional Clothing and Groceries in Wheaton, MD`,
    template: `%s — ${site.name}`,
  },
  description:
    "Ethiopian and Eritrean market in Wheaton, MD offering traditional clothing, family matching outfits for weddings and celebrations, fresh injera, berbere, and authentic Ethiopian groceries.",
  keywords: [
    "Ethiopian and Eritrean market",
    "traditional clothing",
    "habesha kemis",
    "family matching outfits",
    "Ethiopian groceries Wheaton MD",
    "injera",
    "berbere",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
