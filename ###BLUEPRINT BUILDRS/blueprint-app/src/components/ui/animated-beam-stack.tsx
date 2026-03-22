import { forwardRef, useRef } from "react"
import { cn } from "../../lib/utils"
import { AnimatedBeam } from "./animated-beam"
import { BrandIcons } from "./icons"

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-full border border-border bg-card shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
)
Circle.displayName = "Circle"

export function AnimatedBeamStack({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const claudeRef = useRef<HTMLDivElement>(null)
  const vercelRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<HTMLDivElement>(null)
  const githubRef = useRef<HTMLDivElement>(null)
  const stripeRef = useRef<HTMLDivElement>(null)
  const resendRef = useRef<HTMLDivElement>(null)

  const sharedBeam = {
    containerRef,
    pathColor: "#e4e4e7",
    pathWidth: 2,
    pathOpacity: 1,
    gradientStartColor: "#a1a1aa",
    gradientStopColor: "#09090b",
    duration: 2.5,
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-[300px] sm:h-[380px] w-full items-center justify-center overflow-hidden", className)}
    >
      <div className="flex w-full max-w-[340px] sm:max-w-[420px] items-center justify-between gap-4 sm:gap-6">

        {/* Left — Utilisateur */}
        <div className="flex flex-col items-center gap-2">
          <Circle ref={userRef} className="h-11 w-11 sm:h-14 sm:w-14">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Circle>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground tracking-wide">Toi</span>
        </div>

        {/* Center — Claude (plus grand) */}
        <div className="flex flex-col items-center gap-2">
          <Circle ref={claudeRef} className="h-16 w-16 sm:h-20 sm:w-20 shadow-md">
            <BrandIcons.claude className="h-7 w-7 sm:h-9 sm:w-9" />
          </Circle>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground tracking-wide">Claude</span>
        </div>

        {/* Right — Stack outils */}
        <div className="flex flex-col justify-center gap-2 sm:gap-3">
          {([
            [vercelRef, "Vercel", BrandIcons.vercel],
            [supabaseRef, "Supabase", BrandIcons.supabase],
            [githubRef, "GitHub", BrandIcons.github],
            [stripeRef, "Stripe", BrandIcons.stripe],
            [resendRef, "Resend", BrandIcons.resend],
          ] as const).map(([ref, label, Icon]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Circle ref={ref} className="h-9 w-9 sm:h-12 sm:w-12">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Circle>
              <span className="text-[8px] sm:text-[9px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toi → Claude (part en premier) */}
      <AnimatedBeam {...sharedBeam} fromRef={userRef} toRef={claudeRef} delay={0} />

      {/* Claude → outils — lignes droites, pas de croisement */}
      <AnimatedBeam {...sharedBeam} fromRef={claudeRef} toRef={vercelRef}   delay={1}   duration={2} />
      <AnimatedBeam {...sharedBeam} fromRef={claudeRef} toRef={supabaseRef} delay={1.3} duration={2} />
      <AnimatedBeam {...sharedBeam} fromRef={claudeRef} toRef={githubRef}   delay={1.6} duration={2} />
      <AnimatedBeam {...sharedBeam} fromRef={claudeRef} toRef={stripeRef}   delay={1.9} duration={2} />
      <AnimatedBeam {...sharedBeam} fromRef={claudeRef} toRef={resendRef}   delay={2.2} duration={2} />
    </div>
  )
}
