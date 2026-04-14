"use client";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "L'écosystème 8lab, c'est quoi ?",
    answer:
      "C'est un programme complet qui réunit formation, coaching, communauté, sourcing et networking pour vous aider à créer et développer votre marque e-commerce.",
  },
  {
    question: "Comment rejoindre le 8lab ?",
    answer:
      "Rendez-vous sur notre page d'offres et choisissez l'accès Full Access à 1900€ à vie. Vous aurez immédiatement accès à l'ensemble du programme.",
  },
  {
    question: "Est ce qu'il y a une garantie de remboursement ?",
    answer:
      "Nous offrons une garantie satisfait ou remboursé de 30 jours. Si vous n'êtes pas satisfait dans les 30 premiers jours, nous vous remboursons intégralement.",
  },
  {
    question: "Suis-je accompagné lors de la formation ?",
    answer:
      "Oui, vous bénéficiez d'un coaching personnalisé, d'une communauté active et d'un accès direct aux experts 8lab pour répondre à toutes vos questions.",
  },
  {
    question: "Abordez-vous l'administratif et le fiscal ?",
    answer:
      "Oui, nos experts abordent les aspects administratifs, juridiques et fiscaux liés à la création et gestion d'une boutique e-commerce.",
  },
  {
    question: "Quel est le budget idéal pour bien commencer ?",
    answer:
      "Nous recommandons un budget minimum de 1 000 à 2 000€ pour débuter confortablement, en plus de votre accès au programme.",
  },
  {
    question: "La formation est-elle adaptée pour débutants ?",
    answer:
      "Absolument. Le programme est conçu pour accompagner les débutants complets jusqu'aux e-commerçants avancés qui souhaitent scaler leur business.",
  },
  {
    question: "Pouvez-vous m'assurer que j'aurais des résultats ?",
    answer:
      "Nous ne pouvons pas garantir des résultats spécifiques, car ils dépendent de votre implication. Cependant, notre taux de réussite de 99,8% parle pour lui-même.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{ background: "#ffffff", padding: "100px 24px" }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div
            style={{
              fontSize: 15.25,
              fontWeight: 600,
              color: "rgb(94,95,110)",
              marginBottom: 16,
            }}
          >
            FAQ
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "rgb(19,19,22)",
              marginBottom: 12,
            }}
          >
            Vos Questions.{" "}
            <span style={{ color: "rgb(171,170,168)" }}>Nos Réponses</span>
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <p style={{ fontSize: 20, color: "rgb(19,19,22)", fontWeight: 400 }}>
              <strong>Si vous ne trouvez pas la réponse que vous cherchez,</strong>{" "}
              réservez un appel ou contactez-nous en cliquant ici.
            </p>
            <Link
              href="mailto:team@8labecosystem.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: 9999,
                background: "rgb(19,19,22)",
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Contactez-nous
            </Link>
          </div>
        </div>

        {/* Accordion */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "22px 28px",
                  background: openIndex === i ? "rgba(0,0,0,0.02)" : "transparent",
                  border: "none",
                  borderBottom:
                    i < faqs.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: "rgb(19,19,22)",
                  }}
                >
                  {faq.question}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                    opacity: 0.4,
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div
                  style={{
                    padding: "0 28px 20px",
                    background: "rgba(0,0,0,0.02)",
                    borderBottom:
                      i < faqs.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      color: "rgb(171,170,168)",
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
