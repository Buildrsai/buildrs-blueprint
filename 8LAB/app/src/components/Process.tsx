import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Recherche produit et analyse concurrentielle",
    description:
      "Utilisez la psychologie et les tendances pour trouver les niches et produits rentables.",
  },
  {
    number: "2",
    title: "Boutique qui convertit et image de marque forte",
    description:
      "Créez un véritable écosystème qui pousse les visiteurs à l'achat.",
  },
  {
    number: "3",
    title: "Optimisation générale et scaling à l'international",
    description:
      "Transitionnez en une marque stable et pérenne, assurant un succès à long terme.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      style={{
        background: "#ffffff",
        padding: "100px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
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
              Processus
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
              3 étapes simples
              <br />
              <span style={{ color: "rgb(171,170,168)" }}>pour avoir des résultats</span>
            </h2>
            <p style={{ fontSize: 20, fontWeight: 400, color: "rgb(19,19,22)", maxWidth: 480 }}>
              <strong>Une approche structuré en trois phases</strong>, pour avancer
              efficacement et bâtir une marque solide.
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
              background: "rgb(19,19,22)",
              color: "#ffffff",
              fontSize: 15.25,
              fontWeight: 500,
              textDecoration: "none",
              alignSelf: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            Rejoindre maintenant
          </Link>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                padding: 28,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Placeholder image area */}
              <div
                style={{
                  width: "100%",
                  height: 180,
                  background: "rgba(0,0,0,0.04)",
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              />
              <div style={{ fontSize: 20, fontWeight: 400, color: "rgb(19,19,22)" }}>
                <strong>
                  {step.number} - {step.title}
                </strong>
              </div>
              <div style={{ fontSize: 18, fontWeight: 400, color: "rgb(171,170,168)" }}>
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
