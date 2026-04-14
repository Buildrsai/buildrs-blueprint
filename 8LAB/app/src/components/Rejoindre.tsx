import Link from "next/link";
import Image from "next/image";

const included = [
  "Academy : Formation + Masterclass",
  "Network : Groupe communautaire",
  "Coaching : Accompagnement 1:1",
  "Convention : Accès privilégiés",
  "Ressources : Documents et fiches",
  "Ecom Talks : Podcast privé full value",
  "Build In Public : Boutique révélée",
  "Études de cas : Analyse de succès",
  "Plateforme webapp : Compte personnel",
];

const avatars = [
  "/images/avatar-1.webp",
  "/images/avatar-2.webp",
  "/images/avatar-3.webp",
  "/images/avatar-4.webp",
  "/images/avatar-5.webp",
];

export default function Rejoindre() {
  return (
    <section
      id="rejoindre"
      style={{ background: "#0a0a0a", padding: "100px 24px" }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 46px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Rejoignez le 8lab
            <br />
            et explosez en
            <br />
            e-commerce
          </h2>
          {/* Avatars + members */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
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
        </div>

        {/* Pricing card */}
        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div style={{ padding: "32px 36px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
              8lab Ecosystem - Full Access
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 46,
                  fontWeight: 500,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                1900€
              </span>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>accès à vie</span>
            </div>
          </div>

          {/* Testimonial */}
          <div style={{ padding: "28px 36px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <p
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: "#ffffff",
                fontStyle: "italic",
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              &quot;+100 000€ de CA en une seule journée&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image
                src="/images/avatar-1.webp"
                alt="Lou | Kaibaa"
                width={36}
                height={36}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: 20, color: "#ffffff", fontWeight: 400 }}>Lou | Kaibaa</div>
                <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>@kaibaa</div>
              </div>
            </div>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.4)",
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              Kaibaa a rejoint le 8lab avec une boutique qui tournait autour de 2 000€ par
              jour. Un an plus tard, il réalise des mois à plusieurs millions d&apos;euros sur
              le marché français.
            </p>
          </div>

          {/* Included items */}
          <div style={{ padding: "28px 36px" }}>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
              Ce qui est inclus:
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px 24px",
                marginBottom: 32,
              }}
            >
              {included.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 18, color: "#ffffff", fontWeight: 400 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
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
                width: "100%",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              Rejoindre l&apos;écosystème
            </Link>
          </div>
        </div>

        {/* Call CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 46px)",
              fontWeight: 500,
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Ou réservez un appel
          </h2>
        </div>
      </div>
    </section>
  );
}
