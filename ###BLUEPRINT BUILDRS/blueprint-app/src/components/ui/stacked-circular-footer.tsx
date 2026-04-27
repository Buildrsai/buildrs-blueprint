import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BuildrsIcon, Icons } from "@/components/ui/icons"

function StackedCircularFooter() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <BuildrsIcon color="hsl(var(--foreground))" size={36} />
          </div>

          {/* Nav links */}
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            {["Modules", "Comment ça marche", "Tarif", "FAQ", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          {/* Social links */}
          <div className="mb-8 flex space-x-4">
            {[
              { label: "LinkedIn",  Icon: Icons.linkedin,  href: "https://www.linkedin.com/company/buildrs-group" },
              { label: "TikTok",    Icon: Icons.tiktok,    href: "https://www.tiktok.com/@wearebuildrs" },
              { label: "Instagram", Icon: Icons.instagram, href: "https://www.instagram.com/wearebuildrs/" },
            ].map(({ label, Icon, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon className="h-4 w-4" />
                </Button>
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
