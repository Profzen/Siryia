import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siryia | Le Hub Africain du Commerce et des Services",
  description: "Plateforme SaaS multifonctionnelle : Marketplace, Services, Annuaire et Publicité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-white text-slate-800 selection:bg-blue-100">
        {children}
      </body>
    </html>
  );
}
