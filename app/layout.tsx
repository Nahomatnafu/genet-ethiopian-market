import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { getCurrentUser } from "@/lib/customer-auth";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <Nav user={user} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
