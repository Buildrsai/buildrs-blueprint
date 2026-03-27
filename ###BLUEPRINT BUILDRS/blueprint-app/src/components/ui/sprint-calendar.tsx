import { cn } from "@/lib/utils"

const sprint = [
  {
    day: "Jour 1",
    date: "Lun",
    module: "00 — Fondations",
    tasks: ["Comprendre le vibe coding", "Choisir ta stratégie", "Définir ton objectif de monétisation"],
    color: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    accent: "bg-zinc-200 dark:bg-zinc-800",
    tag: "intro",
  },
  {
    day: "Jour 2",
    date: "Mar",
    module: "01 — Trouver & Valider",
    tasks: ["Générer 5 idées", "Valider avec Claude", "Rédiger le brief produit"],
    color: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    accent: "bg-zinc-200 dark:bg-zinc-800",
    tag: "stratégie",
  },
  {
    day: "Jour 3",
    date: "Mer",
    module: "02 & 03 — Design & Architecture",
    tasks: ["Configurer l'environnement", "Créer le branding express", "Planifier la base de données"],
    color: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    accent: "bg-zinc-200 dark:bg-zinc-800",
    tag: "design",
  },
  {
    day: "Jour 4",
    date: "Jeu",
    module: "04 — Construire",
    tasks: ["Générer la base avec Claude", "Coder la feature principale", "Intégrer l'auth + paiement"],
    color: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    accent: "bg-zinc-200 dark:bg-zinc-800",
    tag: "build",
  },
  {
    day: "Jour 5",
    date: "Ven",
    module: "05 — Déployer",
    tasks: ["Mettre en ligne sur Vercel", "Connecter le domaine", "Brancher Stripe + Resend"],
    color: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    accent: "bg-zinc-200 dark:bg-zinc-800",
    tag: "déploiement",
  },
  {
    day: "Jour 6",
    date: "Sam",
    module: "06 — Monétiser & Lancer",
    tasks: ["Écrire la page de vente", "Publier les premiers contenus", "Encaisser les premiers euros"],
    color: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    accent: "bg-zinc-200 dark:bg-zinc-800",
    tag: "revenus",
    highlight: true,
  },
]

export function SprintCalendar() {
  return (
    <div
      className="mx-auto grid max-w-[1100px] grid-cols-3 gap-3.5 md:grid-cols-6"
      style={{ perspective: 1000 }}
    >
      {sprint.map(({ day, date, module, tasks, accent, tag, highlight }, i) => (
        <div
          key={day}
          className={cn(
            "group relative flex flex-col rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
            highlight ? "border-foreground/20 ring-1 ring-foreground/10" : "border-border"
          )}
          style={{
            transform: `rotateX(${2 - i * 0.4}deg) translateZ(${i * 2}px)`,
          }}
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
                {date}
              </p>
              <p
                className="text-[22px] font-bold leading-none tracking-tight text-foreground"
                style={{ letterSpacing: "-0.03em" }}
              >
                {day.split(" ")[1]}
              </p>
            </div>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70",
                accent
              )}
            >
              {tag}
            </span>
          </div>

          {/* Divider */}
          <div className="mb-3 h-px w-full bg-border" />

          {/* Module */}
          <p className="mb-3 text-[11px] font-semibold tracking-tight text-foreground">
            {module}
          </p>

          {/* Tasks */}
          <ul className="flex flex-col gap-1.5">
            {tasks.map((t) => (
              <li key={t} className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                {t}
              </li>
            ))}
          </ul>

          {/* Day 6 badge */}
          {highlight && (
            <div className="mt-4 rounded-lg bg-foreground px-3 py-2 text-center text-[11px] font-semibold text-background">
              Premiers euros ✓
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
