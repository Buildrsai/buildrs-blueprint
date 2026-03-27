import { Star, FileText, Scale, UtensilsCrossed, Search, UserCheck, Sparkles, CalendarDays, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaasProduct {
  id: string
  name: string
  tagline: string
  mrr: string
  accent: string
  Icon: LucideIcon
  ui: 1 | 2 | 3 | 4
}

const products: SaasProduct[] = [
  { id: "reviewgen",  name: "ReviewGen",  tagline: "Réponses avis Google automatiques",  mrr: "1 400€/mois", accent: "#4d96ff", Icon: Star,            ui: 1 },
  { id: "factura",    name: "FacturAI",   tagline: "Facturation intelligente freelances", mrr: "1 200€/mois", accent: "#22c55e", Icon: FileText,        ui: 2 },
  { id: "legalsnap",  name: "LegalSnap",  tagline: "CGV et contrats IA pour PME",        mrr: "1 800€/mois", accent: "#cc5de8", Icon: Scale,           ui: 3 },
  { id: "menuflow",   name: "MenuFlow",   tagline: "Menus digitaux pour restaurants",    mrr: "780€/mois",   accent: "#eab308", Icon: UtensilsCrossed, ui: 4 },
  { id: "seoflow",    name: "SeoFlow",    tagline: "Audit SEO automatisé en 1 clic",     mrr: "2 100€/mois", accent: "#ff6b6b", Icon: Search,          ui: 2 },
  { id: "recrut",     name: "RecrutAI",   tagline: "Tri de candidatures par IA",         mrr: "1 650€/mois", accent: "#4d96ff", Icon: UserCheck,       ui: 3 },
  { id: "copyblast",  name: "CopyBlast",  tagline: "Copywriting publicitaire IA",        mrr: "3 200€/mois", accent: "#22c55e", Icon: Sparkles,        ui: 1 },
  { id: "calendbot",  name: "CalendBot",  tagline: "Prise de rendez-vous automatique",   mrr: "950€/mois",   accent: "#f97316", Icon: CalendarDays,    ui: 4 },
]

const row1 = products.slice(0, 4)
const row2 = products.slice(4)

// ── Mini UI mockups ───────────────────────────────────────────────────────────

// Variant 1 — ReviewGen: dashboard avis Google
function MiniUI1({ a }: { a: string }) {
  const reviews = [
    { initials: 'JM', stars: 5, text: 'Excellent service, réponse rapide' },
    { initials: 'SL', stars: 4, text: 'Très professionnel, je recommande' },
    { initials: 'PB', stars: 5, text: 'Parfait, réponse personnalisée' },
  ]
  return (
    <div className="w-full h-full flex flex-col p-2 gap-1.5">
      {/* Score header */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className="flex items-center gap-0.5">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-sm" style={{ background: i <= 4 ? a : `${a}30` }} />
          ))}
        </div>
        <span className="text-[6px] font-bold" style={{ color: a }}>4.8</span>
        <div className="ml-auto h-1 w-10 rounded-full" style={{ background: `${a}20` }}>
          <div className="h-full rounded-full" style={{ width: '82%', background: a }} />
        </div>
      </div>
      {/* Review rows */}
      {reviews.map(({ initials, text }, i) => (
        <div key={i} className="flex items-start gap-1.5 pb-1 border-b last:border-0" style={{ borderColor: `${a}15` }}>
          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[5px] font-bold text-white" style={{ background: a }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map(s => <div key={s} className="w-1 h-1 rounded-sm" style={{ background: s <= 5 ? '#eab308' : '#eab30830' }} />)}
            </div>
            <p className="text-[6px] text-gray-500 truncate">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Variant 2 — FacturAI: liste de factures
function MiniUI2({ a }: { a: string }) {
  const invoices = [
    { client: 'Agence Nova',    amount: '2 400€', paid: true  },
    { client: 'Studio Blanc',   amount: '1 800€', paid: true  },
    { client: 'Dev & Co',       amount: '3 200€', paid: false },
    { client: 'Freelance Paul', amount: '950€',   paid: false },
  ]
  return (
    <div className="w-full h-full flex flex-col p-2">
      {/* Header */}
      <div className="flex items-center gap-1 mb-1.5 pb-1 border-b" style={{ borderColor: `${a}20` }}>
        <span className="text-[5.5px] font-bold uppercase tracking-wider text-gray-400 flex-1">Client</span>
        <span className="text-[5.5px] font-bold uppercase tracking-wider text-gray-400 w-8 text-right">Montant</span>
        <span className="text-[5.5px] font-bold uppercase tracking-wider text-gray-400 w-8 text-right">Statut</span>
      </div>
      {invoices.map(({ client, amount, paid }, i) => (
        <div key={i} className="flex items-center gap-1 py-0.5">
          <div className="w-3 h-3 rounded flex-shrink-0" style={{ background: `${a}18` }} />
          <span className="text-[6.5px] text-gray-600 flex-1 truncate">{client}</span>
          <span className="text-[6.5px] font-bold w-8 text-right" style={{ color: a }}>{amount}</span>
          <span className="text-[5.5px] font-bold px-1 py-0.5 rounded w-8 text-center" style={paid ? { background: '#22c55e18', color: '#22c55e' } : { background: '#eab30818', color: '#eab308' }}>
            {paid ? 'Payé' : 'En att.'}
          </span>
        </div>
      ))}
    </div>
  )
}

// Variant 3 — RecrutAI: table RH style Deel
function MiniUI3({ a }: { a: string }) {
  const rows = [
    { initials: 'JG', name: 'Jose Guzman',   team: 'Design',   country: '🇨🇱', amount: '€40 200' },
    { initials: 'AF', name: 'André Fabron',  team: 'Data',     country: '🇫🇷', amount: '€58 000' },
    { initials: 'LA', name: 'Lena Antonis',  team: 'Comms',    country: '🇩🇪', amount: '€44 500' },
    { initials: 'LR', name: 'Levin Reuter',  team: 'Marketing',country: '🇩🇪', amount: '€97 000' },
  ]
  return (
    <div className="w-full h-full flex flex-col p-1.5">
      {/* Table header */}
      <div className="flex items-center gap-1 pb-1 border-b" style={{ borderColor: '#e5e7eb' }}>
        <span className="text-[5px] font-bold uppercase tracking-wider text-gray-300 w-12">Personne</span>
        <span className="text-[5px] font-bold uppercase tracking-wider text-gray-300 flex-1">Équipe</span>
        <span className="text-[5px] font-bold uppercase tracking-wider text-gray-300 w-7">Statut</span>
        <span className="text-[5px] font-bold uppercase tracking-wider text-gray-300 w-10 text-right">Montant</span>
      </div>
      {/* Rows */}
      {rows.map(({ initials, name, team, country, amount }, i) => (
        <div key={i} className="flex items-center gap-1 py-[3px] border-b last:border-0" style={{ borderColor: '#f3f4f6' }}>
          {/* Avatar */}
          <div className="flex items-center gap-1 w-12 flex-shrink-0">
            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[4.5px] font-bold text-white flex-shrink-0" style={{ background: a }}>
              {initials}
            </div>
            <span className="text-[5.5px] text-gray-600 truncate">{name}</span>
          </div>
          {/* Team */}
          <div className="flex items-center gap-0.5 flex-1">
            <span className="text-[5px]">{country}</span>
            <span className="text-[5.5px] text-gray-500 truncate">{team}</span>
          </div>
          {/* Status */}
          <span className="text-[5px] font-bold px-1 py-0.5 rounded w-7 text-center" style={{ background: '#22c55e18', color: '#22c55e' }}>
            ACTIF
          </span>
          {/* Amount */}
          <span className="text-[5.5px] font-bold text-gray-700 w-10 text-right tabular-nums">{amount}</span>
        </div>
      ))}
    </div>
  )
}

// Variant 4 — CalendBot: agenda de réservations
function MiniUI4({ a }: { a: string }) {
  const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  const booked = [0, 2, 4]
  return (
    <div className="w-full h-full flex flex-col p-2 gap-1">
      {/* Day header */}
      <div className="flex gap-1 mb-0.5">
        {['L', 'M', 'M', 'J', 'V'].map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <div className="text-[5px] text-gray-400 mb-0.5">{d}</div>
            <div className="h-3.5 w-3.5 rounded-full mx-auto flex items-center justify-center text-[5.5px] font-bold"
              style={i === 3 ? { background: a, color: '#fff' } : { color: '#6b7280' }}>
              {17 + i}
            </div>
          </div>
        ))}
      </div>
      {/* Time slots */}
      <div className="flex flex-col gap-0.5 flex-1">
        {slots.map((slot, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-[5px] text-gray-400 w-6 flex-shrink-0">{slot}</span>
            <div className="flex-1 h-2 rounded-sm" style={{ background: booked.includes(i) ? a : `${a}15` }}>
              {booked.includes(i) && (
                <span className="text-[4.5px] font-bold text-white px-0.5 leading-2 flex items-center h-full">Réservé</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniUI({ variant, accent }: { variant: 1 | 2 | 3 | 4; accent: string }) {
  if (variant === 1) return <MiniUI1 a={accent} />
  if (variant === 2) return <MiniUI2 a={accent} />
  if (variant === 3) return <MiniUI3 a={accent} />
  return <MiniUI4 a={accent} />
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function SaasLogo({ Icon, accent }: { Icon: LucideIcon; accent: string }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      style={{ background: `${accent}18` }}
    >
      <Icon size={16} strokeWidth={1.5} style={{ color: accent }} />
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

function SaasCard({ name, tagline, mrr, accent, ui, Icon }: SaasProduct) {
  return (
    <figure
      className={cn(
        "relative h-full w-[220px] shrink-0 cursor-default overflow-hidden rounded-xl border p-3.5",
        "border-border bg-background hover:border-foreground/20 transition-colors shadow-sm"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <SaasLogo Icon={Icon} accent={accent} />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-foreground leading-none truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-none truncate">{tagline}</p>
        </div>
      </div>

      {/* Mini screenshot */}
      <div
        className="relative w-full h-[80px] rounded-lg overflow-hidden mb-3"
        style={{ background: '#ffffff', border: `1px solid ${accent}20` }}
      >
        <MiniUI variant={ui} accent={accent} />
        {/* Frosted glass overlay */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{ backdropFilter: 'blur(1.5px)', background: 'rgba(255,255,255,0.18)' }}
        />
      </div>

      {/* MRR */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">MRR</span>
        <span
          className="text-[13px] font-black tabular-nums"
          style={{ color: accent, letterSpacing: "-0.02em" }}
        >
          {mrr}
        </span>
      </div>
    </figure>
  )
}

// ── Double Marquee ────────────────────────────────────────────────────────────

function MarqueeRow({ items, reverse = false }: { items: SaasProduct[]; reverse?: boolean }) {
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3"
        style={{
          width: "max-content",
          animation: `${reverse ? "marquee-scroll-reverse" : "marquee-scroll"} 30s linear infinite`,
        }}
      >
        {doubled.map((p, i) => (
          <SaasCard key={`${p.id}-${i}`} {...p} />
        ))}
      </div>
    </div>
  )
}

export function SaasMarquee() {
  return (
    <div className="relative flex w-full flex-col gap-3 overflow-hidden py-2">
      <MarqueeRow items={row1} />
      <MarqueeRow items={row2} reverse />
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-muted to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted to-transparent" />
    </div>
  )
}
