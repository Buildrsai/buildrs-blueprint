"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Programme", href: "#programme" },
  { label: "Processus", href: "#process" },
  { label: "Team", href: "#team-8lab" },
  { label: "Résultats", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div
        className="flex items-center justify-between mx-auto px-6"
        style={{ maxWidth: 1280, height: 71 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center" style={{ height: 16 }}>
          <Image
            src="/images/logo-8lab.webp"
            alt="Logo 8lab"
            width={80}
            height={14}
            style={{ objectFit: "contain", height: 16, width: "auto" }}
            priority
          />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontSize: 15.25,
                fontWeight: 300,
                color: "rgb(175, 176, 185)",
                padding: "8px 14px",
                textDecoration: "none",
                borderRadius: 8,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgb(175, 176, 185)")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/offers"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 16px",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.18)",
            fontSize: 16,
            fontWeight: 300,
            color: "#ffffff",
            textDecoration: "none",
            transition: "border-color 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")
          }
        >
          Rejoindre maintenant
        </Link>
      </div>
    </nav>
  );
}
