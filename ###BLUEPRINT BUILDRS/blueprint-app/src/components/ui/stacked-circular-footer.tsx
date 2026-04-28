import { Icons } from "@/components/ui/icons"

function VerifiedBadge() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Certifié">
      <circle cx="9" cy="9" r="9" fill="#3B82F6" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StackedCircularFooter() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="flex flex-col items-center">

          {/* Buildrs logo */}
          <div className="mb-8">
            <img src="/LogoBuildrsBlanc.png" alt="Buildrs" className="h-8 w-auto" />
          </div>

          {/* Social label */}
          <div className="mb-5 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Retrouvez-nous sur les réseaux</span>
            <span className="text-sm font-semibold text-foreground">@wearebuildrs</span>
            <VerifiedBadge />
          </div>

          {/* Social links */}
          <div className="mb-8 flex space-x-4">
            {[
              { label: "LinkedIn",  Icon: Icons.linkedin,  href: "https://www.linkedin.com/company/buildrs-group" },
              { label: "TikTok",    Icon: Icons.tiktok,    href: "https://www.tiktok.com/@wearebuildrs" },
              { label: "Instagram", Icon: Icons.instagram, href: "https://www.instagram.com/wearebuildrs/" },
            ].map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="mb-8 w-full border-t border-border" />

          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Buildrs Group. Tous droits réservés.
          </p>

          {/* Legal links */}
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
            {[
              { label: "CGV",                hash: "#/legal/cgv" },
              { label: "Mentions légales",   hash: "#/legal/mentions" },
              { label: "Confidentialité",    hash: "#/legal/confidentialite" },
              { label: "Cookies",            hash: "#/legal/cookies" },
            ].map(({ label, hash }) => (
              <a
                key={label}
                href={hash}
                className="text-[11px] text-muted-foreground/50 transition-colors hover:text-muted-foreground"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Legal disclaimer */}
          <p className="mt-4 max-w-[600px] text-center text-[11px] leading-relaxed text-muted-foreground/40">
            Ce site n'est pas affilié à Facebook™, Instagram™ ou Meta Platforms, Inc. Facebook™ et Instagram™ sont des marques déposées de Meta Platforms, Inc. Les résultats peuvent varier selon les individus et dépendent de nombreux facteurs. Ce site ne garantit aucun résultat spécifique.
          </p>

        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }
