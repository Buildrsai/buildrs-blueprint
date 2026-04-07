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
          <div className="mb-8 rounded-full bg-white p-4">
            <BuildrsIcon color="#09090b" className="h-8 w-8" />
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
              { label: "LinkedIn",  Icon: Icons.linkedin  },
              { label: "X",         Icon: Icons.twitter   },
              { label: "Instagram", Icon: Icons.instagram },
              { label: "TikTok",    Icon: Icons.tiktok    },
              { label: "YouTube",   Icon: Icons.youtube   },
            ].map(({ label, Icon }) => (
              <Button key={label} variant="outline" size="icon" className="rounded-full" aria-label={label}>
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mb-8 w-full max-w-md">
            <h3 className="mb-3 text-center text-sm font-semibold tracking-tight">
              Reçois les prochaines idées de SaaS rentables
            </h3>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex-1">
                <Label htmlFor="footer-email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="footer-email"
                  type="email"
                  placeholder="ton@email.com"
                />
              </div>
              <Button type="submit" className="shrink-0">
                S'abonner
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="mb-8 w-full border-t border-border" />

          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Buildrs Group. Tous droits réservés.
          </p>
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground/50">
            Buildrs Blueprint&nbsp;·&nbsp;Buildrs Lab&nbsp;·&nbsp;Buildrs Club&nbsp;·&nbsp;Buildrs Pro
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
