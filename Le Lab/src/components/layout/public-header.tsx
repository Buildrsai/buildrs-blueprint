import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/finder', label: 'Finder' },
  { href: '/pricing', label: 'Tarifs' },
]

function PublicHeader() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#121317] flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="font-semibold text-[#121317] text-sm tracking-tight">
            Buildrs
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'px-4 py-2 rounded-full text-sm transition-colors duration-150',
                pathname === href
                  ? 'text-[#121317] bg-[rgba(33,34,38,0.06)]'
                  : 'text-[#45474D] hover:text-[#121317] hover:bg-[rgba(33,34,38,0.04)]'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-[#45474D] hover:text-[#121317] transition-colors"
          >
            Connexion
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Commencer →</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export { PublicHeader }
