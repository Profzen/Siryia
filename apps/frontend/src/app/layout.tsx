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
  title: {
    template: '%s | Siryia',
    default: 'Siryia | Le Hub Africain du Commerce et des Services',
  },
  description: "Plateforme SaaS multifonctionnelle : Marketplace, Services, Annuaire et Publicité.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Siryia",
  },
  openGraph: {
    title: {
      template: '%s | Siryia',
      default: 'Siryia | Le Hub Africain',
    },
    description: "Le Hub Africain du Commerce et des Services. Trouvez artisans, prestataires, et produits en un clic.",
    url: "https://siryia.com",
    siteName: "Siryia",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: 'https://siryia.com/og-image.jpg', // Vous remplacerez par la vraie image plus tard
        width: 1200,
        height: 630,
        alt: 'Siryia Platform',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: '%s | Siryia',
      default: 'Siryia',
    },
    description: "Le Hub Africain du Commerce et des Services",
    images: ['https://siryia.com/og-image.jpg'],
  },
  keywords: ["Afrique", "Commerce", "Services", "Freelance", "Togo", "Marketplace"],
  authors: [{ name: "Siryia Team" }],
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
