import { useState } from "react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    quote: "En 5 jours j'avais ReviewGen en ligne. Le 6ème jour, mon premier client payant.",
    author: "Sarah",
    role: "ReviewGen — Réponses aux avis Google · 1 400€/mois",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: 2,
    quote: "Zéro ligne de code écrite. Claude a tout codé. Moi je dirigeais. Et ça marche.",
    author: "Théo",
    role: "FacturAI — Factures intelligentes pour freelances · 1 200€/mois",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: 3,
    quote: "J'ai copié un SaaS US, je l'ai adapté au marché français. Simple. Efficace.",
    author: "Marc",
    role: "LegalSnap — CGV et contrats IA pour PME · 1 800€/mois",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
  },
]

export function UniqueTestimonial() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
  const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote)
      setDisplayedRole(testimonials[index].role)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      {/* Quote */}
      <div className="relative px-8">
        <span className="absolute -left-2 -top-6 select-none pointer-events-none font-serif text-foreground/[0.06]" style={{ fontSize: 80 }}>
          "
        </span>
        <p
          className={cn(
            "text-center max-w-xl leading-relaxed text-foreground transition-all duration-300 ease-out",
            "text-2xl md:text-3xl font-light",
            isAnimating ? "opacity-0 blur-sm scale-[0.98]" : "opacity-100 blur-0 scale-100",
          )}
        >
          {displayedQuote}
        </p>
        <span className="absolute -right-2 -bottom-8 select-none pointer-events-none font-serif text-foreground/[0.06]" style={{ fontSize: 80 }}>
          "
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-2">
        {/* Role */}
        <p
          className={cn(
            "text-[11px] text-muted-foreground tracking-[0.18em] uppercase transition-all duration-500 ease-out text-center",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          )}
        >
          {displayedRole}
        </p>

        {/* Avatar pills */}
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((t, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered

            return (
              <button
                key={t.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-foreground shadow-md" : "bg-transparent hover:bg-secondary/80",
                  showName ? "pr-4 pl-2 py-2 gap-0" : "p-0.5 gap-0",
                )}
              >
                <img
                  src={t.avatar}
                  alt={t.author}
                  className={cn(
                    "w-8 h-8 rounded-full object-cover flex-shrink-0",
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isActive ? "ring-2 ring-background/30" : "",
                    !isActive && "hover:scale-105",
                  )}
                />
                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-semibold whitespace-nowrap block transition-colors duration-300",
                        isActive ? "text-background" : "text-foreground",
                      )}
                    >
                      {t.author}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
