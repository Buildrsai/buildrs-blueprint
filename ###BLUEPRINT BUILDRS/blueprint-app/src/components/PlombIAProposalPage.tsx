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
    { title: 'Application mobile-first (PWA)', desc: 'Accessible sur tous les téléphones, aucune installation requise.' },
    { title: 'Assistant chantier IA', desc: 'Prenez une photo, recevez les instructions détaillées en temps réel.' },
    { title: 'Génération de devis automatique', desc: "Vos produits, vos prix, vos fournisseurs — un devis pro en 30 secondes." },
    { title: 'Console administrateur', desc: "Gérez vos utilisateurs, votre catalogue produits, suivez l'activité." },
    { title: 'Contrôle des coûts IA intégré', desc: 'Système de crédits pour maîtriser chaque centime de consommation IA.' },
    { title: '2 mois de support inclus', desc: 'Corrections, ajustements, assistance technique par email.' },
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
            Votre assistant IA pour plombiers.{' '}
            <span style={{ color: '#2563EB' }}>Devis en 30 secondes.</span>{' '}
            Instructions chantier en temps réel.
          </h1>
          <p className="text-lg text-[#374151] mb-12 max-w-2xl leading-relaxed">
            Vous avez une idée précise. On la transforme en application fonctionnelle en 10 jours.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Avant</span>
              </div>
              <ul className="space-y-3">
                {['Devis manuels lents et chronophages', 'Erreurs terrain difficiles à anticiper', 'Perte de temps sur la paperasse', 'Aucun outil dédié au métier de plombier'].map((item) => (
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
                {['Photo chantier → instructions IA instantanées', 'Devis auto-générés en 30 secondes', 'App pro dans la poche de chaque technicien', 'Un outil taillé exactement pour votre métier'].map((item) => (
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

      {/* ── MOCKUP APP ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 plombia-fade" style={{ ...fadeStyle, background: '#FAFAFA', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-3">PlombIA en action</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Trois outils intégrés, pensés pour le terrain et le bureau.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ─ Écran 1 — Photo chantier IA ─ */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Analyse chantier IA</span>
              {/* Phone frame */}
              <div
                className="relative rounded-[2.5rem] shadow-xl overflow-hidden"
                style={{ width: 220, height: 440, background: '#1C1C1E', border: '8px solid #2C2C2E' }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1C1C1E] rounded-b-xl z-10" />

                {/* Camera view — simulated photo */}
                <div className="absolute inset-0 overflow-hidden" style={{ background: '#2A3A2A' }}>
                  {/* Grid overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Simulated pipe / chantier element */}
                  <div className="absolute" style={{ top: '30%', left: '20%', width: '60%', height: '12px', background: 'rgba(200,180,120,0.6)', borderRadius: 4 }} />
                  <div className="absolute" style={{ top: '25%', left: '48%', width: '12px', height: '35%', background: 'rgba(200,180,120,0.6)', borderRadius: 4 }} />
                  <div className="absolute" style={{ top: '25%', left: '24%', width: '12px', height: '35%', background: 'rgba(200,180,120,0.6)', borderRadius: 4 }} />

                  {/* Detection box */}
                  <div
                    className="absolute"
                    style={{ top: '22%', left: '18%', width: '64%', height: '42%', border: '2px solid #34D399', borderRadius: 6 }}
                  >
                    <span
                      className="absolute -top-5 left-0 text-[9px] font-bold px-2 py-0.5 rounded-sm"
                      style={{ background: '#34D399', color: '#0A0A0A' }}
                    >
                      Fuite joint — 94%
                    </span>
                  </div>

                  {/* Top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 px-4 py-6 flex justify-between items-center"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}
                  >
                    <span className="text-white text-[10px] font-semibold">PlombIA</span>
                    <div className="flex gap-1">
                      <span className="text-white text-[9px] bg-white/20 px-2 py-0.5 rounded-full">IA ON</span>
                    </div>
                  </div>

                  {/* Bottom panel */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                  >
                    <div className="text-[10px] text-[#9CA3AF] mb-1 uppercase tracking-wider">Détection IA</div>
                    <div className="text-white text-[11px] font-semibold mb-1">Fuite joint — Robinet 3/4"</div>
                    <div className="text-[#9CA3AF] text-[10px] mb-3">Cause probable : usure joint PTFE</div>
                    <button
                      className="w-full text-[11px] font-bold py-2 rounded-xl text-white"
                      style={{ background: '#2563EB' }}
                    >
                      Générer le devis →
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-[#9CA3AF] max-w-[200px] leading-relaxed">
                Photo du chantier → analyse IA → diagnostic + instructions détaillées
              </p>
            </div>

            {/* ─ Écran 2 — Générateur de devis ─ */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Générateur de devis</span>
              <div
                className="relative rounded-[2.5rem] shadow-xl overflow-hidden"
                style={{ width: 220, height: 440, background: '#FFFFFF', border: '8px solid #2C2C2E' }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1C1C1E] rounded-b-xl z-10" />

                <div className="h-full overflow-hidden pt-6">
                  {/* App header */}
                  <div className="px-4 pt-2 pb-3 border-b border-[#F3F4F6]" style={{ background: '#2563EB' }}>
                    <div className="text-white text-[11px] font-bold">Devis #0042</div>
                    <div className="text-blue-200 text-[9px]">12 avr. 2026 · Martin Dupont</div>
                  </div>

                  {/* Line items */}
                  <div className="px-3 py-2 space-y-2 overflow-hidden">
                    {[
                      { label: 'Joint PTFE 20m', qty: 2, price: '4,90€', supplier: 'Leroy Merlin', color: '#007A3D' },
                      { label: 'Robinet 3/4" laiton', qty: 1, price: '18,50€', supplier: 'Leroy Merlin', color: '#007A3D' },
                      { label: 'Raccord PER 16mm', qty: 4, price: '3,20€', supplier: 'Rexel', color: '#E30613' },
                      { label: 'Main d\'oeuvre (2h)', qty: 1, price: '90,00€', supplier: '', color: '' },
                    ].map((item, i) => (
                      <div key={i} className="rounded-lg p-2" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <div className="text-[10px] font-semibold text-[#0A0A0A] leading-tight">{item.label}</div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-[9px] text-[#6B7280]">×{item.qty}</div>
                          <div className="text-[10px] font-bold text-[#0A0A0A]">{item.price}</div>
                        </div>
                        {item.supplier && (
                          <div
                            className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white"
                            style={{ background: item.color }}
                          >
                            {item.supplier}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Total */}
                    <div className="rounded-lg p-2 mt-2" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#1E40AF]">Total HT</span>
                        <span className="text-[11px] font-bold text-[#1E40AF]">129,50€</span>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[9px] text-[#93C5FD]">TVA 20%</span>
                        <span className="text-[9px] text-[#93C5FD]">155,40€ TTC</span>
                      </div>
                    </div>

                    <button
                      className="w-full text-[11px] font-bold py-2 rounded-xl text-white mt-1"
                      style={{ background: '#2563EB' }}
                    >
                      Envoyer au client →
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-[#9CA3AF] max-w-[200px] leading-relaxed">
                Produits de votre catalogue avec liens fournisseurs intégrés
              </p>
            </div>

            {/* ─ Écran 3 — Dashboard Admin ─ */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Console administrateur</span>
              {/* Browser frame */}
              <div
                className="rounded-xl shadow-xl overflow-hidden"
                style={{ width: 260, border: '1px solid #D1D5DB' }}
              >
                {/* Browser chrome */}
                <div className="px-3 py-2 flex items-center gap-2" style={{ background: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-[9px] text-[#6B7280] bg-white rounded px-2 py-1 text-center">
                    plombia.app/admin
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-3" style={{ background: '#FFFFFF' }}>
                  {/* Top stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Techniciens', value: '4', color: '#2563EB' },
                      { label: 'Devis / mois', value: '23', color: '#059669' },
                      { label: 'CA estimé', value: '18 400€', color: '#D97706' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg p-2 text-center" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <div className="text-[11px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-[8px] text-[#9CA3AF] leading-tight mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Section title */}
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Activité récente</div>

                  {/* Activity list */}
                  <div className="space-y-1.5">
                    {[
                      { tech: 'Lucas M.', action: 'Devis #0042 envoyé', time: 'Il y a 3min', status: 'sent' },
                      { tech: 'Jordan K.', action: 'Analyse chantier — Fuite', time: 'Il y a 14min', status: 'ai' },
                      { tech: 'Théo R.', action: 'Devis #0041 accepté', time: 'Il y a 1h', status: 'ok' },
                      { tech: 'Lucas M.', action: 'Devis #0040 créé', time: 'Il y a 2h', status: 'draft' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: '#F9FAFB' }}>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                          style={{ background: item.status === 'ok' ? '#059669' : item.status === 'ai' ? '#7C3AED' : item.status === 'sent' ? '#2563EB' : '#6B7280' }}
                        >
                          {item.tech[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-semibold text-[#0A0A0A] truncate">{item.action}</div>
                          <div className="text-[8px] text-[#9CA3AF]">{item.tech} · {item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Credit usage */}
                  <div className="mt-3 rounded-lg p-2" style={{ background: '#F0F7FF', border: '1px solid #BFDBFE' }}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-[#1E40AF]">Crédits IA ce mois</span>
                      <span className="text-[9px] text-[#1E40AF]">68%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: '#DBEAFE' }}>
                      <div className="h-1.5 rounded-full" style={{ width: '68%', background: '#2563EB' }} />
                    </div>
                    <div className="text-[8px] text-[#93C5FD] mt-1">340 / 500 crédits utilisés</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-[#9CA3AF] max-w-[220px] leading-relaxed">
                Vue en temps réel : techniciens, devis, CA estimé, consommation IA
              </p>
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
              Ce projet fait partie de ceux qu'on aime construire chez Buildrs. On est convaincus que l'IA a un rôle énorme à jouer dans les métiers manuels — plomberie, électricité, BTP. Des métiers où le temps perdu sur la paperasse et les devis, c'est du temps volé au terrain. Transformer une photo chantier en instructions + devis instantané, c'est exactement le type d'application qui change un quotidien. On veut faire partie de cette aventure avec vous.
            </p>
            <p className="text-sm text-[#6B7280] italic text-right">
              — Alfred, fondateur de Buildrs · team@buildrs.fr
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
              { n: '1', title: 'Kickoff', desc: "Vous nous transmettez votre base produits et vos cas d'usage terrain. On cadre tout ensemble." },
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
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="border-2 rounded-2xl p-8 relative" style={{ borderColor: '#2563EB' }}>
              <div className="absolute -top-3.5 left-6">
                <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#2563EB' }}>
                  Offre lancement — valable 7 jours
                </span>
              </div>
              <div className="text-4xl font-bold text-[#0A0A0A] mt-3 mb-1">1 997€</div>
              <div className="text-sm text-[#6B7280] mb-2">Paiement unique</div>
              <div className="text-sm text-[#374151] mb-8 leading-relaxed">Économisez 1 000€ en validant cette semaine.</div>
              <a
                href="https://buy.stripe.com/eVqcMX7c8fDP0Cf2Xg0x200"
                className="block w-full text-white text-center font-semibold rounded-lg py-3.5 px-6"
                style={{ backgroundColor: '#2563EB' }}
              >
                Je valide mon projet à 1 997€
              </a>
            </div>
            <div className="border border-[#E5E7EB] rounded-2xl p-8">
              <div className="text-4xl font-bold text-[#0A0A0A] mt-3 mb-1">2 997€</div>
              <div className="text-sm text-[#6B7280] mb-2">Paiement en 2 fois</div>
              <div className="text-sm text-[#374151] mb-8 leading-relaxed">1 498,50€ à la signature + 1 498,50€ à la livraison.</div>
              <a
                href="https://buy.stripe.com/fZucMXgMIfDP1Gj0P80x201"
                className="block w-full text-center font-semibold rounded-lg py-3.5 px-6 border-2"
                style={{ borderColor: '#2563EB', color: '#2563EB' }}
              >
                Je choisis le paiement en 2 fois
              </a>
            </div>
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
                'Fournir votre base de données produits et fournisseurs (références, prix).',
                "Fournir vos cas d'usage métier (situations terrain types).",
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
