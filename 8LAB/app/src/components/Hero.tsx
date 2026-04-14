import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "2 536", label: "Nombre de membres actifs" },
  { value: "$45M+", label: "CA générés par les membres" },
  { value: "99,8%", label: "Satisfaction de nos membres" },
  { value: "150", label: "Nombre d'heures de contenu" },
];

const pills = ["Formation", "Coaching", "Networking", "Sourcing", "Convention", "Branding"];

const avatars = [
  "/images/avatar-1.webp",
  "/images/avatar-2.webp",
  "/images/avatar-3.webp",
  "/images/avatar-4.webp",
  "/images/avatar-5.webp",
];

export default function Hero() {
  return (
    <section
      style={{
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blur overlay left */}
      <Image
        src="/images/blur-left.png"
        alt=""
        width={600}
        height={600}
        style={{
          position: "absolute",
          left: 0,
          top: 200,
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Blur overlay right */}
      <Image
        src="/images/blur-right.png"
        alt=""
        width={600}
        height={600}
        style={{
          position: "absolute",
          right: 0,
          top: 200,
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingTop: 160,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Badge */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#ffffff",
            marginBottom: 28,
            opacity: 0.85,
          }}
        >
          8lab Ecosystem : The Infinite
        </div>

        {/* H1 */}
        <h1
          style={{
            fontSize: "clamp(36px, 4vw, 56px)",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.02px",
            color: "#ffffff",
            maxWidth: 780,
            marginBottom: 24,
          }}
        >
          Le seul écosystème{" "}
          <strong style={{ color: "rgb(122,122,122)", fontWeight: 500 }}>pour</strong>{" "}
          créer{" "}
          <strong style={{ color: "rgb(122,122,122)", fontWeight: 500 }}>et</strong>{" "}
          scaler{" "}
          <strong style={{ color: "rgb(122,122,122)", fontWeight: 500 }}>son</strong>{" "}
          empire e-commerce
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 520,
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          Le 8lab vous offre un plan étape par étape, le réseau et les outils pour créer
          une marque e-commerce pérenne.
        </p>

        {/* CTA Button */}
        <Link
          href="/offers"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 20px 12px 16px",
            borderRadius: 9999,
            background: "#ffffff",
            color: "#131316",
            fontSize: 15.25,
            fontWeight: 500,
            textDecoration: "none",
            marginBottom: 28,
            transition: "opacity 0.2s ease",
          }}
        >
          <Image
            src="/images/hero-cling-vert.webp"
            alt=""
            width={20}
            height={20}
            style={{ borderRadius: "50%" }}
          />
          Rejoindre l&apos;écosystème
          <Image
            src="/images/hero-arrow.webp"
            alt=""
            width={16}
            height={16}
          />
        </Link>

        {/* Social proof — avatars + members count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 48,
          }}
        >
          <div style={{ display: "flex" }}>
            {avatars.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="client satisfait-8lab"
                width={32}
                height={32}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid #0a0a0a",
                  marginLeft: i === 0 ? 0 : -8,
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <Image key={i} src="/images/star.webp" alt="star" width={14} height={14} />
            ))}
          </div>
          <span style={{ fontSize: 15.25, color: "#ffffff", fontWeight: 400 }}>
            +2 536 membres
          </span>
        </div>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            marginBottom: 60,
          }}
        >
          {pills.map((pill) => (
            <div
              key={pill}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 18,
                fontWeight: 400,
                color: "#ffffff",
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "32px 0",
          maxWidth: 1100,
          width: "100%",
          margin: "0 auto 0",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              borderRight:
                i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "rgba(255,255,255,0.73)",
                textAlign: "center",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
