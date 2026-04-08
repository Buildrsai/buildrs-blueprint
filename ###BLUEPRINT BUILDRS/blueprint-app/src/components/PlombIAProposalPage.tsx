import { useEffect } from 'react'
import { BuildrsLogo } from './ui/icons'

export function PlombIAProposalPage() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.plombia-fade')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).style.opacity = '1'
            ;(e.target as HTMLElement).style.transform = 'translateY(0)'
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const fadeStyle: React.CSSProperties = {
    opacity: 0,
    transform: 'translateY(28px)',
    transition: 'opacity 0.65s ease, transform 0.65s ease',
  }

  const LIVRABLES = [
    { title: 'Web app desktop (responsive)', desc: "Accessible depuis n'importe quel navigateur, sans installation. Fonctionne sur Mac, PC et tablette." },
    { title: 'Base de données matériaux', desc: 'Votre catalogue produits intégré avec prix et références fournisseurs, prêt à utiliser.' },
    { title: 'Normes constructeur intégrées', desc: "Les règles de chiffrage sont dans l'app, pas dans la tête du technicien. Toujours à jour." },
    { title: 'Génération automatique de devis', desc: 'Du diagnostic au devis PDF en 30 secondes. Calculs exacts, présentation professionnelle.' },
    { title: 'Console administrateur', desc: 'Suivi des devis, gestion des techniciens, pilotage du catalogue produits en temps réel.' },
    { title: '2 mois de support inclus', desc: 'Corrections, ajustements, assistance technique par email pendant 2 mois après la livraison.' },
  ]

  return (
    <div
      className="min-h-screen bg-white text-[#0A0A0A]"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#E5E7EB] px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <BuildrsLogo color="#0A0A0A" iconSize={26} fontSize={15} gap={8} />
            <div className="text-sm text-[#6B7280] mt-2">Proposition sur mesure — Projet PlombIA</div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="text-sm text-[#6B7280]">{today}</div>
            <span className="text-xs font-medium px-3 py-1 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]">
              Proposition confidentielle
            </span>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
            Générez vos devis plomberie en 30 secondes.{' '}
            <span style={{ color: '#2563EB' }}>Normes constructeur intégrées. Produits fournisseurs inclus.</span>
          </h1>
          <p className="text-lg text-[#374151] mb-12 max-w-2xl leading-relaxed">
            Une web app sur mesure qui transforme votre façon de chiffrer vos chantiers. Livrée en 10 jours.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Avant</span>
              </div>
              <ul className="space-y-3">
                {['Devis sur Excel ou papier, ressaisie manuelle', 'Normes constructeur introuvables au bon moment', 'Sourcing des produits un par un, fournisseur par fournisseur', '30 à 60 min par devis', 'Erreurs de chiffrage fréquentes'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-red-400 shrink-0 mt-0.5 font-bold">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Après</span>
              </div>
              <ul className="space-y-3">
                {['Devis généré automatiquement depuis votre catalogue', 'Normes constructeur pré-intégrées et à jour', 'Base de données fournisseurs connectée (prix, références)', '30 secondes par devis', 'Zéro erreur de calcul'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-green-500 shrink-0 mt-0.5 font-bold">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* ── POURQUOI CE PROJET NOUS PARLE ───────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-2xl p-8 sm:p-10">
            <svg className="w-8 h-8 mb-6" style={{ color: '#93C5FD' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-[#0A0A0A] text-lg sm:text-xl leading-relaxed mb-8">
              Générer un devis devrait prendre 30 secondes, pas 45 minutes. Chez Buildrs, on est convaincus que les métiers du bâtiment méritent des outils à la hauteur de leur expertise — pas des tableaux Excel bricolés ou des fiches papier ressaisies à la main. Intégrer votre catalogue, vos normes constructeur et vos références fournisseurs dans une application pensée pour votre quotidien, c'est exactement ce qu'on construit. Un outil conçu pour vous, livré en 10 jours.
            </p>
            <p className="text-sm text-[#6B7280] italic text-right">
              — Buildrs · team@buildrs.fr
            </p>
          </div>
        </div>
      </section>

      {/* ── CE QU'ON VOUS LIVRE ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Votre MVP — Livré en 10 jours</h2>
          <p className="text-[#6B7280] mb-10">Six livrables concrets, zéro superflu.</p>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8">
            <div className="space-y-0">
              {LIVRABLES.map((item, i) => (
                <div key={i} className={`flex items-start gap-5 py-6 ${i < LIVRABLES.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A0A0A] mb-1">{item.title}</div>
                    <div className="text-sm text-[#374151] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-12">Le processus</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { n: '1', title: 'Kickoff', desc: "Vous nous transmettez votre catalogue produits, vos références fournisseurs et vos normes constructeur. On cadre tout ensemble." },
              { n: '2', title: 'Construction', desc: 'On développe votre MVP en 10 jours. Vous validez à chaque étape clé.' },
              { n: '3', title: 'Livraison + Support', desc: 'App livrée, déployée, fonctionnelle. 2 mois de support inclus.' },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ backgroundColor: '#2563EB' }}>
                  {step.n}
                </div>
                <div>
                  <div className="font-semibold text-[#0A0A0A] text-lg mb-2">{step.title}</div>
                  <div className="text-sm text-[#374151] leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTISSEMENT ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Votre investissement</h2>
          <p className="text-[#6B7280] mb-10">Choisissez votre modalité de paiement.</p>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            {/* Card 1 — paiement unique */}
            <div className="border-2 rounded-2xl p-8 relative" style={{ borderColor: '#2563EB' }}>
              <div className="absolute -top-3.5 left-6">
                <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#2563EB' }}>
                  Meilleur tarif
                </span>
              </div>
              <div className="text-4xl font-bold text-[#0A0A0A] mt-3 mb-1">1 297€</div>
              <div className="text-sm text-[#6B7280] mb-2">Paiement unique</div>
              <div className="text-sm text-[#374151] mb-8 leading-relaxed">Paiement en une fois à la signature.</div>
              <a
                href="https://buy.stripe.com/6oUbITgMI77j0Cf9lE0x202"
                className="block w-full text-white text-center font-semibold rounded-lg py-3.5 px-6"
                style={{ backgroundColor: '#2563EB' }}
              >
                Valider à 1 297€
              </a>
            </div>
            {/* Card 2 — 3 fois */}
            <div className="border border-[#E5E7EB] rounded-2xl p-8">
              <div className="text-4xl font-bold text-[#0A0A0A] mt-3 mb-1">1 497€</div>
              <div className="text-sm text-[#6B7280] mb-2">Paiement en 3 fois</div>
              <div className="text-sm text-[#374151] mb-8 leading-relaxed">3 × 499€ — à la signature, au mi-projet, à la livraison.</div>
              <a
                href="https://buy.stripe.com/fZufZ9dAw63f3Or8hA0x203"
                className="block w-full text-center font-semibold rounded-lg py-3.5 px-6 border-2"
                style={{ borderColor: '#2563EB', color: '#2563EB' }}
              >
                Commencer à 499€
              </a>
            </div>
            {/* Card 3 — 4 fois */}
            <div className="border border-[#E5E7EB] rounded-2xl p-8">
              <div className="text-4xl font-bold text-[#0A0A0A] mt-3 mb-1">1 597€</div>
              <div className="text-sm text-[#6B7280] mb-2">Paiement en 4 fois</div>
              <div className="text-sm text-[#374151] mb-8 leading-relaxed">4 × 399,25€ — échelonné sur la durée du projet.</div>
              <a
                href="https://buy.stripe.com/bJe8wHcws3V7gBdgO60x204"
                className="block w-full text-center font-semibold rounded-lg py-3.5 px-6 border-2"
                style={{ borderColor: '#D1D5DB', color: '#374151' }}
              >
                Commencer à 399,25€
              </a>
            </div>
          </div>
          {/* Justification box */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-6 py-5 mb-4">
            <p className="text-sm text-[#374151] leading-relaxed">
              <span className="font-semibold text-[#0A0A0A]">Pourquoi ces tarifs ?</span> Le développement d'une web app sur mesure de ce niveau représente habituellement 8 000 à 15 000€ de budget. Grâce à notre approche IA-first, on réduit ce coût de 90% tout en livrant en 10 jours. Le paiement unique est préférable — il couvre intégralement le développement. Les options fractionnées permettent d'échelonner selon votre trésorerie.
            </p>
          </div>
          <p className="text-xs text-center text-[#9CA3AF]">Paiement sécurisé par Stripe. Facture envoyée automatiquement.</p>
        </div>
      </section>

      {/* ── CE QUI EST À VOTRE CHARGE ───────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Pour avancer ensemble</h2>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8">
            <div className="space-y-5">
              {[
                'Fournir votre catalogue produits et références fournisseurs (marques, codes, prix).',
                'Transmettre vos normes constructeur et règles de chiffrage métier.',
                'Valider les étapes clés pendant le développement (retours sous 48h).',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#374151] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── À PROPOS DE BUILDRS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={fadeStyle}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6">À propos de Buildrs</h2>
          <p className="text-[#374151] leading-relaxed max-w-2xl text-base">
            Buildrs conçoit des applications IA sur mesure avec une approche builder : rapide, efficace, sans superflu. Votre projet est développé avec les meilleures technologies du marché (React, Supabase, Claude AI, Vercel) par un expert en développement IA.
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <BuildrsLogo color="#9CA3AF" iconSize={20} fontSize={12} gap={6} fontWeight={600} />
          <div className="space-y-1">
            <p className="text-sm text-[#9CA3AF]">Proposition valable 7 jours à compter de la réception.</p>
            <p className="text-sm text-[#9CA3AF]">buildrs.fr · team@buildrs.fr</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
