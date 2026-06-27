import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#17519B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Siryia | Le Hub Africain du Commerce et des Services",
  description: "Plateforme SaaS multifonctionnelle : Marketplace, Services, Annuaire et Publicité.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Siryia",
  },
  openGraph: {
    title: "Siryia | Le Hub Africain",
    description: "Le Hub Africain du Commerce et des Services",
    url: "https://siryia.com",
    siteName: "Siryia",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siryia",
    description: "Le Hub Africain du Commerce et des Services",
  },
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
