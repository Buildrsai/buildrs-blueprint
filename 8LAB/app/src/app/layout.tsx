import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8lab Ecosystem - Créez et développer votre marque e-commerce",
  description:
    "Formation, coaching et réseau pour créer une marque e-commerce durable. 150 h de contenu, webapp, sourcing et communauté active.",
  openGraph: {
    title: "8lab Ecosystem - Créez et développer votre marque e-commerce",
    description:
      "Formation, coaching et réseau pour créer une marque e-commerce durable. 150 h de contenu, webapp, sourcing et communauté active.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full antialiased bg-[#0a0a0a] text-white" style={{ fontFamily: '"Aeonik Pro", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
