import { getCurrentTier } from "@/lib/pricing";

export function BuilderTierBadge({ variant = "full" }: { variant?: "full" | "compact" }) {
  const { currentPrice, nextPrice, placesLeft, progressPct, builderCount, tierEnd } = getCurrentTier();

  if (variant === "compact") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Plus que <strong className="text-white">{placesLeft} places</strong> à {currentPrice}€
        <span className="text-white/40">→ {nextPrice}€</span>
      </span>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Palier en cours</span>
        </div>
        <span className="font-mono text-xs text-white/40">
          {builderCount} / {tierEnd} builders
        </span>
      </div>
      <p className="mt-2 text-sm text-white/80">
        Plus que{" "}
        <span className="font-semibold text-white">{placesLeft} places</span>{" "}
        à <span className="font-semibold text-white">{currentPrice}€</span>{" "}
        avant passage à{" "}
        <span className="font-semibold text-white">{nextPrice}€</span>
      </p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
