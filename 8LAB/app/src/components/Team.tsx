"use client";
import { useState } from "react";

const teamMembers = [
  {
    name: "Alex Shane",
    role: "Création de marque et semi marque",
    description:
      "Gérant plus de 3 marques simultanément et ayant généré plusieurs millions de CA, Alex te guidera pour bâtir une marque stable et pérenne.",
  },
  {
    name: "Maximilien Triora",
    role: "Créateur de la méthode 8lab",
    description:
      "Expert e-commerce ayant généré plusieurs millions de chiffre d'affaire. Créateur du process 8lab, il t'apprendra à transformer tes ambitions en réalité.",
  },
  {
    name: "Andrea & Camille (Hover)",
    role: "Optimisation du taux de conversion",
    description:
      "Passés de e-commerçants générants de millions à experts en optimisation de taux de conversion, UI/UX, etc., Andrea te donnera les meilleures méthodes pour optimiser ton site.",
  },
  {
    name: "Nicolas Del Gaudio",
    role: "Fondateur de Creative Crafters et Crafter Studio",
    description:
      "Expert en stratégie créative, il supervise la production de +1 000 créatives chaque mois, en collaboration avec les plus grandes marques.",
  },
  {
    name: "Killyan | Examy",
    role: "Expert en Meta Ads",
    description:
      "Fort de son expérience sur Facebook, Examy génère plusieurs millions annuellement sur Meta Ads. Il t'apprendra à manier la plateforme comme un expert.",
  },
  {
    name: "Clément | Lemiento",
    role: "Ecom Brands & CEO 8lab",
    description:
      "Expert en e-commerce et en analyse concurrentielle, il t'aidera aussi à structurer des funnels de vente qui convertissent.",
  },
  {
    name: "Tess (Onially)",
    role: "Service après vente",
    description:
      "En gérant la stratégie de service après-vente de certaines des plus grosses marques e-commerce françaises, Tess vous montrera les meilleures pratiques.",
  },
  {
    name: "Charles | Karli",
    role: "Expert Google",
    description:
      "Expert en publicité sur Google Ads, Karli partagera toutes ses stratégies et conseils pour lancer des campagnes rentables.",
  },
  {
    name: "Emin & Khalifa",
    role: "Experts en Intelligence Artificielle",
    description:
      "Ayant intégré l'IA dans des dizaines de business et accompagné plusieurs grosses brand à 7 chiffres, Emin et Khalifa te donneront toutes les clés.",
  },
  {
    name: "Romain (ReveMedia)",
    role: "Expert en Email Marketing",
    description:
      "Après avoir accompagné +300 e-commerçants à optimiser leur backend avec des emails professionnels qui convertissent, il partage ses secrets.",
  },
  {
    name: "Alan | EcomGuy",
    role: "Expert en Pinterest Ads",
    description:
      "Réputé pour son expertise sur Pinterest depuis plus de 4 ans et ayant généré des chiffres impressionnants, te montrera comment exploiter la plateforme.",
  },
  {
    name: "Jordan | Lhommebleu",
    role: "Expert Photoshop",
    description:
      "Jordan, réputé pour son expertise en création de miniatures YouTube à l'aide de Photoshop, vous montrera comment utiliser cet outil pour votre marque.",
  },
];

const VISIBLE_PER_PAGE = 3;

export default function Team() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(teamMembers.length / VISIBLE_PER_PAGE);
  const visible = teamMembers.slice(page * VISIBLE_PER_PAGE, (page + 1) * VISIBLE_PER_PAGE);

  return (
    <section
      id="team-8lab"
      style={{ background: "#ffffff", padding: "100px 24px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 9999,
              border: "1px solid rgba(0,0,0,0.12)",
              fontSize: 15.25,
              fontWeight: 700,
              color: "rgb(94,95,110)",
              marginBottom: 20,
            }}
          >
            L&apos;équipe du Laboratoire
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "rgb(19,19,22)",
              marginBottom: 16,
            }}
          >
            Les experts <span style={{ color: "rgb(19,19,22)" }}>8lab</span>
            <br />
            <span style={{ color: "rgb(171,170,168)" }}>derrière l&apos;Academy</span>
          </h2>
          <p
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "rgb(19,19,22)",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            <strong>Des experts passionnés</strong>, réunis pour vous transmettre les
            stratégies les plus efficaces et vous guider vers l&apos;excellence.
          </p>
        </div>

        {/* Team cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {visible.map((member) => (
            <div
              key={member.name}
              style={{
                padding: 28,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Avatar placeholder */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 400, color: "rgb(19,19,22)" }}>
                    <strong>{member.name}</strong>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 400, color: "rgb(171,170,168)" }}>
                    {member.role}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 18, fontWeight: 400, color: "rgb(171,170,168)", lineHeight: 1.5 }}>
                {member.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.12)",
              background: "transparent",
              cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.12)",
              background: "transparent",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              opacity: page === totalPages - 1 ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
