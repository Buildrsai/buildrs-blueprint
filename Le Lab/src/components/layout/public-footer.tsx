import { Link } from 'react-router'

const FOOTER_LINKS = {
  Produit: [
    { href: '/finder', label: 'Buildrs Finder' },
    { href: '/pricing', label: 'Tarifs' },
    { href: '/#features', label: 'Fonctionnalités' },
  ],
  Ressources: [
    { href: '/#faq', label: 'FAQ' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Communauté' },
  ],
  Légal: [
    { href: '#', label: 'CGV' },
    { href: '#', label: 'Confidentialité' },
    { href: '#', label: 'Mentions légales' },
  ],
}

function PublicFooter() {
  return (
    <footer className="bg-[#000000] text-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <span className="text-[#121317] font-bold text-xs">B</span>
              </div>
              <span className="font-semibold text-white text-sm">Buildrs</span>
            </div>
            <p className="text-[#45474D] text-sm leading-relaxed">
              De l'idée au SaaS en ligne, sans savoir coder.
            </p>
            <p className="text-[#212226] text-xs">
              © {new Date().getFullYear()} Buildrs. Tous droits réservés.
            </p>
          </div>

          {/* Liens */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-[#45474D]">
                {category}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-sm text-[#B2BBC5] hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Wordmark géant — style Antigravity signature */}
        <div className="border-t border-[#121317] pt-8 overflow-hidden">
          <p
            className="text-[#18191D] font-bold leading-none select-none"
            style={{ fontSize: 'clamp(60px, 15vw, 180px)', letterSpacing: '-0.03em' }}
          >
            Buildrs
          </p>
        </div>
      </div>
    </footer>
  )
}

export { PublicFooter }
