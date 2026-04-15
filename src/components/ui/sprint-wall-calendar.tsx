"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

// ─── Sprint data ──────────────────────────────────────────────────────────────

const SPRINT_DAYS = [
  {
    day: "01",
    label: "Lundi",
    module: "Fondations",
    num: "00",
    tag: "intro",
    tasks: [
      "Comprendre le vibe coding",
      "Choisir ta stratégie",
      "Définir ton objectif",
    ],
    highlight: false,
  },
  {
    day: "02",
    label: "Mardi",
    module: "Trouver & Valider",
    num: "01",
    tag: "stratégie",
    tasks: [
      "Générer 5 idées",
      "Valider avec Claude",
      "Rédiger le brief produit",
    ],
    highlight: false,
  },
  {
    day: "03",
    label: "Mercredi",
    module: "Design & Architecture",
    num: "02–03",
    tag: "design",
    tasks: [
      "Configurer l'environnement",
      "Branding express 15min",
      "Schéma base de données",
    ],
    highlight: false,
  },
  {
    day: "04",
    label: "Jeudi",
    module: "Construire",
    num: "04",
    tag: "build",
    tasks: [
      "Générer la base avec Claude",
      "Feature principale",
      "Auth + onboarding",
    ],
    highlight: false,
  },
  {
    day: "05",
    label: "Vendredi",
    module: "Déployer",
    num: "05",
    tag: "déploiement",
    tasks: [
      "Mise en ligne Vercel",
      "Domaine personnalisé",
      "Stripe + Resend branchés",
    ],
    highlight: false,
  },
  {
    day: "06",
    label: "Samedi",
    module: "Monétiser & Lancer",
    num: "06",
    tag: "revenus",
    tasks: [
      "Page de vente rédigée",
      "Contenus publiés",
      "Premiers euros encaissés",
    ],
    highlight: true,
  },
]

const PANEL_W = 155
const PANEL_H = 200
const COLS = 6
const GAP = 14

// ─── Component ───────────────────────────────────────────────────────────────

export function SprintWallCalendar() {
  const [tiltX, setTiltX] = React.useState(22)
  const [tiltY, setTiltY] = React.useState(-4)

  const isDragging = React.useRef(false)
  const dragStart = React.useRef<{ x: number; y: number } | null>(null)

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setTiltX((t) => Math.max(0, Math.min(55, t + e.deltaY * 0.025)))
    setTiltY((t) => Math.max(-50, Math.min(50, t + e.deltaX * 0.05)))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setTiltY((t) => Math.max(-50, Math.min(50, t + dx * 0.12)))
    setTiltX((t) => Math.max(0, Math.min(55, t - dy * 0.12)))
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = () => {
    isDragging.current = false
    dragStart.current = null
  }

  const totalW = COLS * (PANEL_W + GAP) + GAP

  return (
    <div className="w-full select-none">
      {/* Hint */}
      <p className="mb-4 text-center font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase">
        ↔ glisse pour explorer · molette pour incliner
      </p>

      <div
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="mx-auto cursor-grab overflow-visible active:cursor-grabbing"
        style={{ perspective: 1400, width: "100%", maxWidth: totalW }}
      >
        <div
          style={{
            width: totalW,
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: "transform 100ms linear",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, ${PANEL_W}px)`,
              gridAutoRows: `${PANEL_H}px`,
              gap: GAP,
              padding: GAP,
              transformStyle: "preserve-3d",
            }}
          >
            {SPRINT_DAYS.map(({ day, label, module, num, tag, tasks, highlight }, idx) => {
              // Z offset: centre les cartes, milieu légèrement plus proche
              const z = 30 - Math.abs(idx - (COLS - 1) / 2) * 8

              return (
                <HoverCard key={day} openDelay={100} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <div
                      className="relative h-full"
                      style={{
                        transform: `translateZ(${z}px)`,
                        zIndex: Math.round(60 - Math.abs(idx - 2.5) * 5),
                      }}
                    >
                      <Card
                        className={`h-full overflow-hidden transition-shadow duration-200 hover:shadow-lg ${
                          highlight
                            ? "border-foreground/30 ring-1 ring-foreground/10"
                            : "border-border"
                        }`}
                      >
                        <CardContent className="flex h-full flex-col p-0">
                          {/* Header */}
                          <div
                            className={`flex items-start justify-between px-4 pt-4 pb-3 ${
                              highlight ? "bg-foreground text-background" : "bg-muted/50"
                            }`}
                          >
                            <div>
                              <p
                                className={`font-mono text-[9px] font-semibold uppercase tracking-widest ${
                                  highlight ? "text-background/50" : "text-muted-foreground/50"
                                }`}
                              >
                                {label}
                              </p>
                              <p
                                className={`text-3xl font-bold leading-none tracking-tight ${
                                  highlight ? "text-background" : "text-foreground"
                                }`}
                                style={{ letterSpacing: "-0.04em" }}
                              >
                                {day}
                              </p>
                            </div>
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-wider ${
                                highlight
                                  ? "bg-background/15 text-background/80"
                                  : "bg-muted text-muted-foreground/60"
                              }`}
                            >
                              {num}
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-border" />

                          {/* Body */}
                          <div className="flex flex-1 flex-col px-4 py-3">
                            <p className="mb-3 text-[11px] font-bold leading-tight tracking-tight text-foreground">
                              {module}
                            </p>
                            <ul className="flex flex-col gap-2">
                              {tasks.map((t) => (
                                <li
                                  key={t}
                                  className="flex items-start gap-1.5 text-[10px] leading-snug text-muted-foreground"
                                >
                                  <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                                  {t}
                                </li>
                              ))}
                            </ul>

                            {highlight && (
                              <div className="mt-auto pt-3">
                                <div className="rounded-md bg-foreground px-2 py-1.5 text-center text-[10px] font-semibold text-background">
                                  Premiers euros ✓
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="top"
                    className="w-52 p-3"
                    style={{ zIndex: 9999 }}
                  >
                    <p className="mb-1 text-[11px] font-bold text-foreground">
                      Jour {day} — {module}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                      {tag}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
