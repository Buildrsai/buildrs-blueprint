import { cn } from '@/lib/utils'

interface Tool {
  name: string
  color: string
}

const TOOLS: Tool[] = [
  { name: 'Claude AI',     color: '#D97706' },
  { name: 'Claude Code',   color: '#3279F9' },
  { name: 'Supabase',      color: '#22C55E' },
  { name: 'Vercel',        color: '#121317' },
  { name: 'GitHub',        color: '#6366F1' },
  { name: 'Stripe',        color: '#6772E5' },
  { name: 'Resend',        color: '#121317' },
  { name: 'Framer Motion', color: '#E11D48' },
  { name: 'Magic UI',      color: '#7C3AED' },
  { name: 'PostHog',       color: '#F59E0B' },
  { name: 'Cloudflare',    color: '#F97316' },
  { name: 'shadcn/ui',     color: '#45474D' },
]

interface ToolStripProps {
  className?: string
}

function ToolStrip({ className }: ToolStripProps) {
  // Dupliquer pour boucle seamless
  const doubled = [...TOOLS, ...TOOLS]

  return (
    <div
      className={cn(
        'w-full overflow-hidden border-y border-[#E6EAF0] bg-white py-4',
        className,
      )}
    >
      <div className="relative">
        {/* Fondu gauche */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
        {/* Fondu droite */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

        <div
          className="flex w-max gap-3 [animation:tool-scroll_28s_linear_infinite] hover:[animation-play-state:paused]"
        >
          {doubled.map((tool, i) => (
            <div
              key={`${tool.name}-${i}`}
              className="flex items-center gap-2 rounded-full border border-[#E6EAF0] bg-[#F8F9FC] px-3.5 py-1.5 text-xs font-medium text-[#45474D] whitespace-nowrap select-none"
            >
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: tool.color }}
              />
              {tool.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { ToolStrip }
