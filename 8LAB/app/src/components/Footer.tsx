import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Programme", href: "#programme" },
  { label: "Process", href: "#process" },
  { label: "L'Équipe", href: "#team-8lab" },
  { label: "Rejoindre", href: "#rejoindre" },
  { label: "Avis", href: "#" },
  { label: "FAQ", href: "#faq" },
];

const legalLinks = [
  { label: "Mentions légales", href: "#" },
  { label: "Conditions générales", href: "#" },
  { label: "Politique de confidentialité", href: "#" },
];

const avatars = [
  "/images/avatar-1.webp",
  "/images/avatar-2.webp",
  "/images/avatar-3.webp",
  "/images/avatar-4.webp",
  "/images/avatar-5.webp",
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        padding: "100px 24px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Main CTA block */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Infinite Is The New Norm
          </h2>
          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#ffffff" }}>Repoussez les limites</strong> et{" "}
            évoluez dans un environnement où la{" "}
            <strong style={{ color: "#ffffff" }}>performance et la réussite</strong> priment.
          </p>

          {/* Members count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex" }}>
              {avatars.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={28}
                  height={28}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "2px solid #0a0a0a",
                    marginLeft: i === 0 ? 0 : -6,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 15.25, color: "#ffffff" }}>+2 536 membres</span>
          </div>

          <Link
            href="/offers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 9999,
              background: "#ffffff",
              color: "#131316",
              fontSize: 15.25,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Rejoindre l&apos;écosystème
          </Link>
        </div>

        {/* Footer grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 40,
            paddingTop: 48,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 48,
          }}
        >
          {/* Logo + contact */}
          <div>
            <Image
              src="/images/logo-8lab.webp"
              alt="Logo 8lab"
              width={80}
              height={14}
              style={{ height: 16, width: "auto", objectFit: "contain", marginBottom: 16 }}
            />
            <a
              href="mailto:team@8labecosystem.com"
              style={{ fontSize: 15.25, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
            >
              team@8labecosystem.com
            </a>
          </div>

          {/* Navigation */}
          <div>
            <div
              style={{
                fontSize: 15.25,
                fontWeight: 400,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 16,
              }}
            >
              Navigation
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: 15.25,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div
              style={{
                fontSize: 15.25,
                fontWeight: 400,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 16,
              }}
            >
              Informations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: 15.25,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            fontSize: 15.25,
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          © 2025 8lab Corporation - All rights reserved.
        </div>
      </div>
    </footer>
  );
}
