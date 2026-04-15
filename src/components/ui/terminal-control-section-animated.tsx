import React, { useCallback, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type LineKind = "normal" | "added" | "removed" | "comment" | "gap"

interface DiffLine {
  ln?: number | null
  text: string
  kind?: LineKind
}

interface DiffBlock {
  fileTag: string
  added: number
  removed: number
  lines: DiffLine[]
}

interface BulletItem {
  step: string
  title: string
  desc: string
  diff: DiffBlock
}

const items: BulletItem[] = [
  {
    step: "01",
    title: "Tu configures. Claude mémorise.",
    desc: "Ton CLAUDE.md définit ton projet, ton stack, tes règles. Claude le lit une fois et ne te repose plus jamais les mêmes questions. Mémoire permanente.",
    diff: {
      fileTag: "CLAUDE.md",
      added: 9,
      removed: 0,
      lines: [
        { ln: null, text: "", kind: "gap" },
        { ln: 1,  text: "# Mon Projet SaaS",                          kind: "comment" },
        { ln: 2,  text: "stack: React + Supabase + Stripe + Vercel",   kind: "added" },
        { ln: 3,  text: "auth: Supabase Auth (email + Google OAuth)",  kind: "added" },
        { ln: 4,  text: "db: PostgreSQL · RLS activé sur toutes tables", kind: "added" },
        { ln: null, text: "/* … */",                                   kind: "comment" },
        { ln: 8,  text: "## Règles Claude Code",                       kind: "comment" },
        { ln: 9,  text: "- TypeScript strict, pas de any",             kind: "added" },
        { ln: 10, text: "- Composants dans src/components/ui/",        kind: "added" },
        { ln: 11, text: "- Edge Functions Supabase pour l'API IA",     kind: "added" },
        { ln: 12, text: "- Jamais ANTHROPIC_API_KEY côté client",      kind: "added" },
        { ln: null, text: "", kind: "gap" },
      ],
    },
  },
  {
    step: "02",
    title: "Tu branches. Claude agit dans tes outils.",
    desc: "Supabase, GitHub, Stripe, Vercel — Claude ne se contente pas de te donner du code à copier. Il écrit directement dans ta BDD, pousse sur ton repo, déploie ton app.",
    diff: {
      fileTag: ".claude/mcp.json",
      added: 12,
      removed: 2,
      lines: [
        { ln: null, text: "", kind: "gap" },
        { ln: 1,  text: "{",                                           kind: "normal" },
        { ln: 2,  text: '  "mcpServers": {',                          kind: "normal" },
        { ln: 3,  text: '    "supabase": {',                          kind: "added" },
        { ln: 4,  text: '      "command": "npx @supabase/mcp",',      kind: "added" },
        { ln: 5,  text: '      "env": { "SUPABASE_URL": "..." }',     kind: "added" },
        { ln: 6,  text: '    },',                                      kind: "added" },
        { ln: 7,  text: '    "github": {',                            kind: "added" },
        { ln: 8,  text: '      "command": "npx @github/mcp"',         kind: "added" },
        { ln: 9,  text: '    },',                                      kind: "added" },
        { ln: 10, text: '    "stripe": {',                            kind: "added" },
        { ln: 11, text: '      "command": "npx @stripe/agent-toolkit"', kind: "added" },
        { ln: 12, text: '    }',                                       kind: "added" },
        { ln: 13, text: "  }",                                         kind: "normal" },
        { ln: 14, text: "}",                                           kind: "normal" },
      ],
    },
  },
  {
    step: "03",
    title: "Tu lances. Plusieurs agents bossent en même temps.",
    desc: "Un agent construit ta landing, un autre configure ton Stripe, un troisième teste ton checkout. 3 tâches en 8 minutes au lieu de 45 en séquentiel.",
    diff: {
      fileTag: "agents/launch.ts",
      added: 7,
      removed: 1,
      lines: [
        { ln: null, text: "", kind: "gap" },
        { ln: 1,  text: "// Lancer 3 agents en parallèle",            kind: "comment" },
        { ln: 2,  text: "const [ui, api, tests] = await Promise.all([", kind: "added" },
        { ln: 3,  text: "  agent('designer').build('landing page'),", kind: "added" },
        { ln: 4,  text: "  agent('architect').build('Stripe webhook'),", kind: "added" },
        { ln: 5,  text: "  agent('tester').run('e2e checkout flow'),", kind: "added" },
        { ln: 6,  text: "])",                                          kind: "added" },
        { ln: null, text: "/* … */",                                   kind: "comment" },
        { ln: 10, text: "// Résultat : 3 tâches terminées en 8 min",   kind: "added" },
        { ln: 11, text: "// au lieu de 45 min en séquentiel",          kind: "added" },
        { ln: null, text: "", kind: "gap" },
      ],
    },
  },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"
      style={{ background: "rgba(255,255,255,0.07)", color: "#a1a1aa", borderColor: "rgba(255,255,255,0.10)" }}>
      {children}
    </span>
  )
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
}

const lineVariants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
}

const lineStyles: Record<LineKind, string> = {
  normal:  "text-zinc-300",
  added:   "bg-emerald-500/10 text-emerald-300",
  removed: "bg-rose-500/10 text-rose-300",
  comment: "text-zinc-500 italic",
  gap:     "opacity-0 select-none h-2",
}

function CodeDiff({ diff }: { diff: DiffBlock }) {
  const styles = useMemo(() => lineStyles, [])

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#0d0d10" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#111113" }}>
        <span className="rounded px-2 py-0.5 font-mono text-[11px] tracking-tight"
          style={{ background: "rgba(255,255,255,0.06)", color: "#a1a1aa" }}>
          {diff.fileTag}
        </span>
        <div className="flex items-center gap-2">
          <Badge>+{diff.added}</Badge>
          <Badge>-{diff.removed}</Badge>
        </div>
      </div>

      {/* Body */}
      <div style={{ overflowX: 'auto' }}>
      <motion.div
        className="grid grid-cols-[auto_1fr] gap-x-0.5 px-1 py-2 font-mono text-[12px] leading-relaxed"
        style={{ minWidth: 'max-content' }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={diff.fileTag}
      >
        {diff.lines.map((l, i) => (
          <React.Fragment key={i}>
            <motion.div variants={lineVariants}
              className="select-none px-3 text-right text-zinc-600">
              {l.ln ?? ""}
            </motion.div>
            <motion.div variants={lineVariants}
              className={"whitespace-pre px-3 rounded-r " + (l.kind ? styles[l.kind] : "text-zinc-300")}>
              {l.text}
            </motion.div>
          </React.Fragment>
        ))}
      </motion.div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", color: "#52525b" }}>
        <div className="flex items-center gap-2">
          <span className="rounded px-1.5 py-0.5 font-mono text-[10px]"
            style={{ background: "rgba(255,255,255,0.06)" }}>→</span>
          <span>Ajouter un message de suivi</span>
        </div>
        <div>
          <span className="font-medium text-zinc-400">a</span> garder ·{" "}
          <span className="font-medium text-zinc-400">z</span> annuler ·{" "}
          <span className="font-medium text-zinc-400">←</span>{" "}
          <span className="font-medium text-zinc-400">→</span> fichiers
        </div>
      </div>
    </div>
  )
}

export function TerminalControlSectionAnimated() {
  const [active, setActive] = useState(0)

  const onKey = useCallback((e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(i => Math.min(items.length - 1, i + 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(i => Math.max(0, i - 1)) }
    else if (e.key === "Home") { e.preventDefault(); setActive(0) }
    else if (e.key === "End") { e.preventDefault(); setActive(items.length - 1) }
  }, [])

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 items-start">
        {/* Left: steps */}
        <div className="relative">
          {/* Vertical rail */}
          <div aria-hidden className="absolute left-[22px] top-[40px]"
            style={{
              width: "1px",
              height: "calc(100% - 56px)",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.14), rgba(255,255,255,0.03))"
            }} />

          <ul className="space-y-2" role="tablist" onKeyDown={onKey}>
            {items.map((it, i) => {
              const isActive = i === active
              const isPast = i < active
              return (
                <li key={it.step} role="presentation" className="relative flex gap-4">
                  {/* Step indicator */}
                  <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 44 }}>
                    <button
                      onClick={() => setActive(i)}
                      className="flex items-center justify-center rounded-full text-[11px] font-bold transition-all duration-200 flex-shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        background: isActive
                          ? "rgba(255,255,255,0.10)"
                          : isPast
                          ? "rgba(255,255,255,0.04)"
                          : "transparent",
                        border: isActive
                          ? "1px solid rgba(255,255,255,0.22)"
                          : "1px solid rgba(255,255,255,0.08)",
                        color: isActive ? "#fafafa" : isPast ? "#52525b" : "#3f3f46",
                        fontFamily: "Geist Mono, monospace",
                      }}
                    >
                      {isPast ? "✓" : it.step}
                    </button>

                    {/* Connector arrow between steps */}
                    {i < items.length - 1 && (
                      <div className="flex flex-col items-center mt-1 mb-1" style={{ height: 18 }}>
                        <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.07)" }} />
                        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M4 5L0 0h8L4 5z" fill="rgba(255,255,255,0.12)" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <button
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className="flex-1 rounded-xl px-4 py-3.5 text-left transition-all duration-200 mb-0"
                    style={{
                      border: isActive ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(255,255,255,0.06)",
                      background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                      boxShadow: isActive ? "0 0 24px rgba(77,150,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTabBg"
                        className="absolute inset-0 -z-10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.22, duration: 0.48 }}
                      />
                    )}
                    <div className="text-[15px] font-semibold leading-snug" style={{ color: isActive ? "#fafafa" : "#52525b" }}>
                      {it.title}
                    </div>
                    <div className="text-[13px] mt-1.5 leading-relaxed" style={{ color: isActive ? "#a1a1aa" : "#3f3f46" }}>
                      {it.desc}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right: code diff */}
        <div role="tabpanel" aria-live="polite">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl p-0.5"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111113" }}
          >
            <div className="p-4 sm:p-5">
              <AnimatePresence mode="wait">
                <CodeDiff key={items[active].step} diff={items[active].diff} />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reassurance line */}
      <p className="mt-10 text-center text-[13px]" style={{ color: "#52525b" }}>
        Setup complet en 3 étapes. Guidé pas à pas dans le dashboard. Opérationnel en une journée.
      </p>
    </div>
  )
}
