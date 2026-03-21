import { Link } from 'react-router'
import { Bell, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  title?: string
  className?: string
}

function AppHeader({ title, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'h-14 flex items-center justify-between px-6',
        'border-b border-[#E6EAF0] bg-white flex-shrink-0',
        className
      )}
    >
      <div>
        {title && (
          <h1 className="text-sm font-medium text-[#121317]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-[#B2BBC5] hover:text-[#45474D] hover:bg-[#F0F1F5]
            transition-all duration-150"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.5} />
        </button>

        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full
            text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]
            transition-all duration-150"
        >
          <div className="w-5 h-5 rounded-full bg-[#EFF2F7] border border-[#E6EAF0]
            flex items-center justify-center">
            <span className="text-[#3279F9] text-[10px] font-bold">A</span>
          </div>
          <span className="text-xs hidden md:block">Mon compte</span>
          <ChevronDown size={11} />
        </Link>
      </div>
    </header>
  )
}

export { AppHeader }
