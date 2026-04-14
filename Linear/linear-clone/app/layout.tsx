import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linear – The system for product development",
  description:
    "Linear is a purpose-built tool for planning and building products. Designed for the modern software development workflow.",
  icons: {
    icon: [
      { url: "/seo/favicon.ico" },
      { url: "/seo/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/seo/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="enhanced js">
      <body className="antialiased">{children}</body>
    </html>
  );
}
