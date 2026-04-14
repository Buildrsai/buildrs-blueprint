import Link from "next/link";

const eightlabItems = [
  "Méthodes éprouvées",
  "Coaching personnalisé",
  "Communauté d'entraide",
  "Sourcing et warehouse",
];

const seulItems = [
  "Zéro vision et stratégie",
  "Confronter à soi-même",
  "Asymétrie des infos",
  "Des difficultés à sourcer",
];

const autresItems = [
  "Théorie sans concret",
  "Pas d'accompagnement",
  "Communauté inactive",
  "Vision court-terme",
];

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: checked ? "rgb(19,19,22)" : "transparent",
        border: checked ? "none" : "1.5px solid rgb(171,170,168)",
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {!checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2L8 8M8 2L2 8" stroke="rgb(171,170,168)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export default function Avantages() {
  return (
    <section
      id="avantages"
      style={{
        background: "#ffffff",
        padding: "100px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div
            style={{
              fontSize: 15.25,
              fontWeight: 600,
              color: "rgb(94,95,110)",
              marginBottom: 16,
            }}
          >
            8lab Avantages
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "rgb(19,19,22)",
              marginBottom: 16,
            }}
          >
            L&apos;écosystème ultime.{" "}
            <span style={{ color: "rgb(171,170,168)" }}>L&apos;environnement parfait.</span>
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p style={{ fontSize: 20, fontWeight: 400, color: "rgb(19,19,22)", maxWidth: 520 }}>
              <strong>Bien plus qu&apos;une simple formation</strong>, un environnement
              façonné pour maximiser la performance et la réussite.
            </p>
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
                whiteSpace: "nowrap",
              }}
            >
              Rejoindre maintenant.
            </Link>
          </div>
        </div>

        {/* Comparison table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* 8lab column */}
          <div style={{ padding: "32px 28px", background: "#ffffff" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 9999,
                border: "1px solid rgba(0,0,0,0.12)",
                fontSize: 15.25,
                fontWeight: 600,
                color: "rgb(19,19,22)",
                marginBottom: 28,
              }}
            >
              8 lab
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {eightlabItems.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckIcon checked={true} />
                  <span style={{ fontSize: 20, fontWeight: 400, color: "rgb(19,19,22)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Apprendre Seul column */}
          <div
            style={{
              padding: "32px 28px",
              background: "rgba(0,0,0,0.02)",
              borderLeft: "1px solid rgba(0,0,0,0.06)",
              borderRight: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: "rgb(19,19,22)",
                marginBottom: 28,
                paddingTop: 4,
              }}
            >
              <strong>Apprendre Seul</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {seulItems.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckIcon checked={false} />
                  <span style={{ fontSize: 20, fontWeight: 400, color: "rgb(171,170,168)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Autres Formations column */}
          <div style={{ padding: "32px 28px", background: "rgba(0,0,0,0.02)" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: "rgb(19,19,22)",
                marginBottom: 28,
                paddingTop: 4,
              }}
            >
              <strong>Autres Formations</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {autresItems.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckIcon checked={false} />
                  <span style={{ fontSize: 20, fontWeight: 400, color: "rgb(171,170,168)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
