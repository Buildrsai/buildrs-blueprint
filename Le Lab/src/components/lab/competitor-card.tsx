import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CompetitorCardProps {
  name: string
  url: string | null
  price: string
  strength: string
  weakness: string
}

function CompetitorCard({ name, url, price, strength, weakness }: CompetitorCardProps) {
  return (
    <Card variant="light" padding="md" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#121317]">{name}</span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B2BBC5] hover:text-[#3279F9] transition-colors"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
        <span className="text-xs font-mono font-medium text-[#3279F9] bg-[#3279F9]/8 px-2.5 py-1 rounded-full">
          {price}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#22C55E] mt-0.5 flex-shrink-0">+</span>
          <p className="text-xs text-[#45474D] leading-relaxed">{strength}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#EF4444] mt-0.5 flex-shrink-0">−</span>
          <p className="text-xs text-[#45474D] leading-relaxed">{weakness}</p>
        </div>
      </div>
    </Card>
  )
}

export { CompetitorCard }
