"use client";
import { useState } from "react";
import Link from "next/link";

const chapters = [
  {
    id: 1,
    title: "1 - Les fondations de ta réussite",
    content: "Découvrez les bases essentielles pour réussir en e-commerce : mindset, organisation et plan d'action.",
  },
  {
    id: 2,
    title: "2 - Structuration et bases du e-commerce",
    content: "Maîtrisez la structure d'une boutique performante, de la création à la configuration technique.",
  },
  {
    id: 3,
    title: "3 - Sourcing et supply chain",
    content: "Trouvez les meilleurs fournisseurs, négociez les prix et maîtrisez la chaîne logistique.",
  },
  {
    id: 4,
    title: "4 - Créer une boutique brandée de A à Z",
    content: "Créez une identité visuelle forte et une boutique qui inspire confiance et convertit.",
  },
  {
    id: 5,
    title: "5 - Créer ou récupérer du contenu publicitaire",
    content: "Produisez des créatives qui captent l'attention et convertissent sur toutes les plateformes.",
  },
  {
    id: 6,
    title: "6 - Maîtriser les plateformes publicitaires",
    content: "Meta Ads, Google Ads, TikTok Ads : maîtrisez chaque plateforme pour scaler votre business.",
  },
  {
    id: 7,
    title: "7 - Gestion et optimisation des opérations",
    content: "Optimisez vos opérations, automatisez les tâches et maximisez votre rentabilité.",
  },
  {
    id: 8,
    title: "8 - Transition vers une semi-marque",
    content: "Passez d'une boutique généraliste à une véritable marque reconnue et pérenne.",
  },
  {
    id: 9,
    title: "9 - Empire Builder [NOUVEAUTÉ]",
    content: "Construisez un empire e-commerce avec plusieurs marques et sources de revenus.",
  },
  {
    id: 10,
    title: "10 - Masterclass",
    content: "Les masterclasses exclusives des experts 8lab pour aller encore plus loin.",
  },
];

export default function Programme() {
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <section
      id="programme"
      style={{
        background: "#0a0a0a",
        padding: "100px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 60,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15.25,
                fontWeight: 600,
                color: "rgb(94,95,110)",
                marginBottom: 16,
              }}
            >
              Academy
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 500,
                lineHeight: 1.2,
                color: "#ffffff",
                marginBottom: 16,
                maxWidth: 600,
              }}
            >
              Le programme e-commerce avec le plus fort taux de réussite
            </h2>
            <p
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 520,
              }}
            >
              La formation la plus poussée du marché pour apprendre l&apos;e-commerce,
              peu importe vos connaissances et vos compétences de départ.
            </p>
          </div>
          <Link
            href="/offers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px 12px 16px",
              borderRadius: 9999,
              background: "#ffffff",
              color: "#131316",
              fontSize: 15.25,
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
              alignSelf: "flex-start",
            }}
          >
            Rejoindre l&apos;écosystème
          </Link>
        </div>

        {/* Video placeholder */}
        <div
          style={{
            width: "100%",
            height: 480,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>

        {/* Chapters tabs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          {chapters.map((chapter, i) => (
            <div key={chapter.id}>
              <button
                onClick={() => setActiveChapter(i === activeChapter ? -1 : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "20px 28px",
                  background:
                    activeChapter === i
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                  border: "none",
                  borderBottom:
                    i < chapters.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: activeChapter === i ? "#ffffff" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {chapter.title}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: activeChapter === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                    opacity: 0.5,
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {activeChapter === i && (
                <div
                  style={{
                    padding: "0 28px 20px",
                    background: "rgba(255,255,255,0.06)",
                    borderBottom:
                      i < chapters.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.6,
                    }}
                  >
                    {chapter.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 5 en 1 callout */}
        <div
          style={{
            marginTop: 48,
            padding: "32px 36px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            5 en 1
          </div>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>
            Formation · Coaching · Networking · Sourcing · Convention
          </p>
        </div>
      </div>
    </section>
  );
}
