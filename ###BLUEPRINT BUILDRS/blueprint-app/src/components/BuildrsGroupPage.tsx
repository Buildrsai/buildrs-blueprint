import { useEffect, useState } from 'react'
import { ArrowRight, TrendingUp, Clock, Building2, Users, BookOpen, MessageSquare, Zap } from 'lucide-react'
import { BuildrsLogo, BuildrsIcon, BrandIcons } from './ui/icons'
import { GridPattern } from './ui/grid-pattern'
import { BLUEPRINT_PRICE } from '../lib/pricing'

// ── Helpers statiques ────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block mb-5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border border-border bg-secondary text-muted-foreground">
      {label}
    </span>
  )
}

function Sur({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <p className={`text-[11px] font-semibold mb-4 tracking-[0.12em] uppercase ${dark ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
      {label}
    </p>
  )
}

const STACK: { label: string; icon: keyof typeof BrandIcons }[] = [
  { label: 'Claude',     icon: 'claude'     },
  { label: 'Vercel',     icon: 'vercel'     },
  { label: 'Supabase',   icon: 'supabase'   },
  { label: 'Stripe',     icon: 'stripe'     },
  { label: 'Resend',     icon: 'resend'     },
  { label: 'GitHub',     icon: 'github'     },
  { label: 'Cloudflare', icon: 'cloudflare' },
]

export function BuildrsGroupPage() {
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const fn = () => setNavSolid(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.05 }
    )
    document.querySelectorAll<HTMLElement>('.g-fade').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const f0: React.CSSProperties = { opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }
  const fd = (ms: number): React.CSSProperties => ({ ...f0, transitionDelay: `${ms}ms` })

  return (
    <div className="bg-background text-foreground min-h-screen">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 border-b"
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          background: navSolid ? 'hsl(var(--background)/0.9)' : 'transparent',
          backdropFilter: navSolid ? 'blur(20px)' : 'none',
          borderColor: navSolid ? 'hsl(var(--border))' : 'transparent',
          transition: 'all 0.25s ease',
        }}
      >
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <BuildrsLogo color="currentColor" iconSize={22} fontSize={13} gap={8} fontWeight={700} />
          <button
            onClick={() => scrollTo('chemins')}
            className="cta-rainbow flex items-center gap-2 rounded-[8px] bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer border-none"
          >
            Devenir un Buildr →
          </button>
        </div>
      </nav>

      {/* ── S1 HERO — DARK ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6"
        style={{ background: '#09090b', paddingTop: 140, paddingBottom: 120, minHeight: '92vh' }}
      >
        <GridPattern
          width={32} height={32}
          className="[mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,white,transparent)] stroke-white/[0.04] fill-white/[0.04]"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(170,170,255,0.07) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-[760px] mx-auto">
          {/* Badge */}
          <div
            className="g-fade inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-[12px] text-white/50 mb-8"
            style={f0}
          >
            <Zap size={12} strokeWidth={1.5} className="shrink-0 text-white/60" />
            Le mouvement a commencé.
          </div>

          <h1
            className="g-fade text-white mb-6"
            style={{ ...fd(80), fontSize: 'clamp(38px, 5.5vw, 76px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.06 }}
          >
            L'IA ne va pas te remplacer.
            <br />Ceux qui savent l'utiliser, oui.
          </h1>

          <p
            className="g-fade mb-10 max-w-[520px] mx-auto text-[17px] leading-relaxed"
            style={{ ...fd(160), color: 'rgba(255,255,255,0.45)' }}
          >
            Le monde se divise en deux. Ceux qui regardent l'IA avancer. Et ceux qui buildent avec. Buildrs, c'est le mouvement de ceux qui construisent — un SaaS, une compétence, une entreprise — pendant que les autres en parlent.
          </p>

          <div className="g-fade flex flex-col items-center gap-3" style={fd(240)}>
            <button
              onClick={() => scrollTo('chemins')}
              className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-white text-[#09090b] px-8 py-3.5 text-[15px] font-semibold hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              Devenir un Buildr <ArrowRight size={16} strokeWidth={1.5} />
            </button>
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Entrepreneurs, salariés, entreprises. Commence maintenant.
            </span>
          </div>
        </div>
      </section>

      {/* ── S2 CONSTAT — LIGHT ─────────────────────────────────────────────── */}
      <section id="constat" className="px-6 py-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <Sur label="Pourquoi maintenant" />
          <h2
            className="g-fade text-foreground mb-4"
            style={{ ...fd(80), fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Tout le monde parle d'IA.
            <br />Presque personne ne sait quoi en faire.
          </h2>
          <p className="g-fade text-muted-foreground text-[16px] leading-relaxed max-w-xl mb-14" style={fd(120)}>
            L'IA n'est plus une tendance. C'est un changement de monde. Mais entre en parler et s'en servir concrètement, il y a un gouffre. Buildrs comble ce gouffre.
          </p>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { stat: '93%',   icon: <Building2 size={18} strokeWidth={1.5} className="text-muted-foreground" />, text: "des entreprises disent vouloir intégrer l'IA. Moins de 5% l'ont réellement fait.", d: 160 },
              { stat: '10x',   icon: <TrendingUp size={18} strokeWidth={1.5} className="text-muted-foreground" />, text: "Un builder équipé produit en une semaine ce qu'une équipe classique met trois mois à livrer. Les outils existent. Les builders manquent.", d: 240 },
              { stat: '2 ans', icon: <Clock size={18} strokeWidth={1.5} className="text-muted-foreground" />, text: "C'est le délai avant que la maîtrise de l'IA devienne un pré-requis, pas un avantage. Ceux qui buildent maintenant prennent une avance décisive.", d: 320 },
            ].map((c) => (
              <div key={c.stat} className="g-fade bg-card border border-border rounded-2xl p-7" style={fd(c.d)}>
                <div className="mb-4">{c.icon}</div>
                <div className="text-foreground mb-3" style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{c.stat}</div>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S3 MANIFESTE — DARK ────────────────────────────────────────────── */}
      <section id="manifeste" className="px-6 py-24" style={{ background: '#09090b' }}>
        <div className="max-w-4xl mx-auto">
          <Sur label="Le manifeste" dark />
          <h2
            className="g-fade text-white mb-12"
            style={{ ...fd(80), fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            On ne forme pas des spectateurs.
            <br />On arme des builders.
          </h2>

          <div className="g-fade space-y-6 mb-14" style={fd(120)}>
            {[
              "L'IA change tout. Les métiers, les entreprises, les règles du jeu. Et la majorité attend. Attend de comprendre. Attend que ça se stabilise. Attend que quelqu'un leur explique.",
              "Pendant ce temps, une poignée de gens construit. Ils lancent des produits. Ils automatisent des process. Ils créent des revenus avec des outils que 95% des gens ne savent pas encore utiliser.",
              "Ces gens ne sont pas développeurs. Ils ne sont pas experts en IA. Ils sont builders. Ils décrivent ce qu'ils veulent, et l'IA le construit.",
              "Buildrs, c'est leur écosystème. Un mouvement. Pas une formation de plus. Un système vivant qui évolue avec l'IA, pas un PDF figé qui sera obsolète dans trois mois.",
            ].map((para, i) => (
              <p key={i} className="text-[17px] leading-[1.8]" style={{ color: i < 2 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.7)' }}>
                {para}
              </p>
            ))}
          </div>

          {/* Blockquote */}
          <div
            className="g-fade py-8 px-8 rounded-r-2xl"
            style={{ ...fd(240), borderLeft: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-white text-[20px] font-bold leading-snug" style={{ letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              "Dans deux ans, il y aura ceux qui ont appris à builder avec l'IA. Et ceux qui chercheront encore par où commencer."
            </p>
          </div>
        </div>
      </section>

      {/* ── S4 LES 4 CHEMINS — LIGHT ───────────────────────────────────────── */}
      <section id="chemins" className="px-6 py-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <Sur label="Deviens un Buildr" />
          <h2
            className="g-fade text-foreground mb-3"
            style={{ ...fd(80), fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Trouve ton chemin.
            <br />Commence à builder.
          </h2>
          <p className="g-fade text-muted-foreground text-[16px] mb-14 max-w-lg" style={fd(120)}>
            Que tu partes de zéro ou que tu diriges une équipe, il y a un chemin Buildrs pour toi.
          </p>

          <div className="grid lg:grid-cols-2 gap-5">
            {[
              {
                id: 'cree', tag: 'Créer',
                title: 'Builde ton premier micro-SaaS IA rentable.',
                body: "Tu as des idées. Tu n'as pas d'équipe, pas de budget, pas de compétences techniques. Le Buildrs Blueprint te donne le système complet pour passer de l'idée à un produit qui génère des revenus récurrents. En 6 jours. Seul. Sans écrire une ligne de code.",
                bullets: ['Ton micro-SaaS, ta web app ou ton outil en ligne', 'Un produit live, hébergé, avec paiement intégré', 'Un business qui génère du MRR, que tu peux revendre ou dupliquer'],
                mono: '6 modules · Agents IA inclus · Stack complète <50€ · Accès à vie',
                cta: `Accéder au Blueprint — ${BLUEPRINT_PRICE}€`, href: '/#/checkout',
                sub: 'Paiement unique. Satisfait ou remboursé 30 jours.', d: 160,
              },
              {
                id: 'maitrise', tag: 'Maîtriser',
                title: 'Maîtrise Claude Code. La compétence la plus recherchée de 2026.',
                body: "Le vibecoding n'est pas un gadget. C'est la compétence qui sépare ceux qui subissent l'IA de ceux qui la pilotent. Maîtriser Claude Code te place dans le top 1%.",
                bullets: ["L'environnement Claude Code complet : skills, MCP, sub-agents, mémoire projet", 'Le pilotage depuis ton téléphone via Discord ou Telegram', "La construction d'outils internes, d'automatisations, de prototypes fonctionnels"],
                mono: 'Environnement clé-en-main · Mises à jour en continu · Spécialisé SaaS & apps',
                cta: 'Accéder à Claude Buildrs — 47€', href: 'https://claude.buildrs.fr',
                sub: "Paiement unique. L'environnement exact utilisé pour générer +25K€/mois.", d: 220,
              },
              {
                id: 'entreprise', tag: 'Implémenter',
                title: "Implémentez Claude dans votre entreprise. L'équipe Buildrs s'en charge.",
                body: "Vos équipes pourraient automatiser des process entiers, construire des outils internes sur mesure, et réduire des semaines de travail à quelques heures. Buildrs Entreprise déploie Claude dans votre organisation.",
                bullets: ['Audit de vos process et identification des leviers IA', "Déploiement de Claude Code, skills personnalisés, connecteurs sur vos outils existants", "Formation de vos équipes au pilotage et à l'autonomie", 'Support et itérations post-déploiement'],
                mono: null,
                cta: 'Prendre rendez-vous', href: 'mailto:team@buildrs.fr?subject=Buildrs Entreprise',
                sub: 'Sur-mesure. Résultats mesurables dès les premières semaines.', d: 280,
              },
              {
                id: 'projet', tag: 'Confier',
                title: "Vous avez un projet d'app, de SaaS, de logiciel ? Confiez-le aux Buildrs.",
                body: "Vous avez l'idée. Peut-être un cahier des charges. Peut-être juste une intuition. L'équipe Buildrs prend votre projet de A à Z. Pas d'agence à 50K€. Pas de délais à 6 mois. Un produit live, rapide.",
                bullets: ['Votre app, SaaS ou outil interne fonctionnel et déployé', 'Design, base de données, paiement, hébergement — tout inclus', 'Un produit que vous possédez, pas une dépendance à un prestataire'],
                mono: null,
                cta: 'Soumettre mon projet', href: 'mailto:team@buildrs.fr?subject=Soumission de projet',
                sub: 'Devis en 48h. Premier livrable en moins de 2 semaines.', d: 340,
              },
            ].map((card) => (
              <div
                key={card.id}
                id={card.id}
                className="g-fade bg-card border border-border rounded-2xl p-8 flex flex-col"
                style={fd(card.d)}
              >
                <Tag label={card.tag} />
                <h3 className="text-foreground text-[22px] font-bold mb-4" style={{ letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed mb-5">{card.body}</p>
                <div className="space-y-2 mb-5">
                  {card.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <span className="text-foreground font-semibold shrink-0 mt-0.5">—</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                {card.mono && (
                  <div className="px-4 py-2.5 rounded-lg text-[12px] mb-5 bg-secondary border border-border text-muted-foreground font-mono">
                    {card.mono}
                  </div>
                )}
                <div className="mt-auto">
                  <a
                    href={card.href}
                    className="cta-rainbow flex items-center justify-center gap-2 w-full py-3 rounded-[10px] text-[14px] font-semibold bg-foreground text-background hover:opacity-85 transition-opacity no-underline"
                  >
                    {card.cta} <ArrowRight size={14} strokeWidth={1.5} />
                  </a>
                  <p className="text-center text-[12px] text-muted-foreground mt-2.5">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S5 ÉQUIPE — DARK ───────────────────────────────────────────────── */}
      <section id="equipe" className="px-6 py-24" style={{ background: '#09090b' }}>
        <div className="max-w-6xl mx-auto">
          <Sur label="L'équipe" dark />
          <h2
            className="g-fade text-white mb-4"
            style={{ ...fd(80), fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Un fondateur. 40+ agents IA.
            <br />Zéro bullshit.
          </h2>
          <p className="g-fade text-[16px] leading-relaxed max-w-2xl mb-12" style={{ ...fd(120), color: 'rgba(255,255,255,0.4)' }}>
            Pas de fausse équipe de 50 personnes. Pas de stock photos de bureaux open-space. Un fondateur solo qui a construit un écosystème de plus de 40 agents IA spécialisés — et qui utilise ce même système chaque jour pour générer plus de 25 000€ par mois.
          </p>

          {/* Bloc Alfred */}
          <div
            className="g-fade rounded-2xl p-8 mb-12 max-w-2xl"
            style={{ ...fd(160), background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <BuildrsIcon color="rgba(255,255,255,0.8)" size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-[16px]" style={{ letterSpacing: '-0.02em' }}>Alfred Orsini</div>
                <div className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Fondateur de Buildrs</div>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.55)' }}>
              "J'ai construit plus de 40 produits avec l'IA. Sans équipe. Sans lever de fonds. Juste un système, une méthode, et les bons outils. Buildrs, c'est ce système — ouvert à tous ceux qui veulent builder."
            </p>
          </div>

          {/* Stack */}
          <div className="g-fade" style={fd(240)}>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
              La stack Buildrs
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {STACK.map(({ label, icon }) => {
                const Icon = BrandIcons[icon]
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-mono"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    <Icon width={12} height={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    {label}
                  </div>
                )
              })}
              {['Claude Code', 'Playwright', 'Cowork'].map((t) => (
                <div
                  key={t}
                  className="px-4 py-2 rounded-xl text-[12px] font-mono"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                >
                  {t}
                </div>
              ))}
            </div>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Les outils qu'on utilise. Les outils qu'on enseigne. Tous accessibles, la plupart gratuits.
            </p>
          </div>
        </div>
      </section>

      {/* ── S6 MOUVEMENT — LIGHT ───────────────────────────────────────────── */}
      <section id="club" className="px-6 py-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <Sur label="Buildrs Club" />
          <h2
            className="g-fade text-foreground mb-4"
            style={{ ...fd(80), fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Rejoins le mouvement.
            <br />Builde avec nous, pas tout seul.
          </h2>
          <p className="g-fade text-muted-foreground text-[16px] leading-relaxed max-w-xl mb-14" style={fd(120)}>
            Chaque semaine, du contenu concret. Pas du bla-bla sur l'IA. Des cas réels, des templates, des agents, des retours d'expérience de builders qui construisent.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { title: 'Contenu exclusif', text: "Vidéos, templates, prompts, agents — chaque semaine, du concret que tu peux appliquer immédiatement.", icon: <BookOpen size={18} strokeWidth={1.5} className="text-muted-foreground" />, d: 160 },
              { title: 'Communauté active', text: "Des builders qui construisent, pas des lurkers. On partage les wins, les blocages, les solutions. On avance ensemble.", icon: <Users size={18} strokeWidth={1.5} className="text-muted-foreground" />, d: 240 },
              { title: 'Accès direct', text: "Canal privé avec Alfred et Jarvis. Pose ta question, obtiens une réponse. Pas dans 3 jours. Maintenant.", icon: <MessageSquare size={18} strokeWidth={1.5} className="text-muted-foreground" />, d: 320 },
            ].map((col) => (
              <div key={col.title} className="g-fade bg-card border border-border rounded-2xl p-7" style={fd(col.d)}>
                <div className="mb-4">{col.icon}</div>
                <h3 className="text-foreground font-bold text-[17px] mb-3" style={{ letterSpacing: '-0.02em' }}>{col.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{col.text}</p>
              </div>
            ))}
          </div>

          <div className="g-fade" style={fd(380)}>
            <a
              href="https://chat.whatsapp.com/PLACEHOLDER"
              className="cta-rainbow inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold bg-foreground text-background hover:opacity-85 transition-opacity no-underline"
            >
              Rejoindre le Club Buildrs <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* ── S7 AFFILIÉ — DARK ──────────────────────────────────────────────── */}
      <section id="affilie" className="px-6 py-24" style={{ background: '#09090b' }}>
        <div className="max-w-6xl mx-auto">
          <Sur label="Programme affilié" dark />
          <h2
            className="g-fade text-white mb-4"
            style={{ ...fd(80), fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Deviens ambassadeur Buildrs.
            <br />Recommande. Gagne. Répète.
          </h2>
          <p className="g-fade text-[16px] leading-relaxed max-w-xl mb-14" style={{ ...fd(120), color: 'rgba(255,255,255,0.4)' }}>
            Tu connais des gens qui veulent se lancer dans l'IA ? Partage ton lien. À chaque vente, tu touches ta commission. Pas de minimum. Pas de conditions cachées.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { stat: '30%',       label: 'de commission sur chaque vente générée par ton lien.', d: 160 },
              { stat: '0€',        label: 'pour démarrer. Inscription gratuite, lien unique, dashboard de suivi.', d: 240 },
              { stat: 'Récurrent', label: 'Sur les abonnements et les produits premium. Tu recommandes une fois, tu touches plusieurs fois.', d: 320 },
            ].map((item) => (
              <div
                key={item.stat}
                className="g-fade rounded-2xl p-8"
                style={{ ...fd(item.d), background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="text-white mb-3" style={{ fontWeight: 800, fontSize: 56, letterSpacing: '-0.04em', lineHeight: 1 }}>{item.stat}</div>
                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div className="g-fade" style={fd(380)}>
            <a
              href="mailto:team@buildrs.fr?subject=Programme affilié Buildrs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold no-underline transition-colors"
              style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
            >
              Devenir affilié <ArrowRight size={16} strokeWidth={1.5} />
            </a>
            <p className="text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Inscription en 2 minutes. Lien de tracking personnel. Paiement mensuel.
            </p>
          </div>
        </div>
      </section>

      {/* ── S8 CTA FINAL — DARK ────────────────────────────────────────────── */}
      <section className="px-6 text-center relative overflow-hidden" style={{ background: '#09090b', paddingTop: 120, paddingBottom: 120 }}>
        <GridPattern
          width={32} height={32}
          className="[mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,white,transparent)] stroke-white/[0.04] fill-white/[0.04]"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(170,170,255,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-[720px] mx-auto">
          <h2
            className="g-fade text-white mb-5"
            style={{ ...f0, fontSize: 'clamp(36px, 5.5vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.06 }}
          >
            Le monde n'attend pas.
            <br />Les builders non plus.
          </h2>
          <p className="g-fade mb-10 text-[17px] leading-relaxed max-w-lg mx-auto" style={{ ...fd(80), color: 'rgba(255,255,255,0.4)' }}>
            Tu peux continuer à regarder l'IA transformer le monde autour de toi. Ou tu peux prendre les outils, rejoindre le mouvement, et commencer à builder. Maintenant.
          </p>

          <div className="g-fade flex flex-col items-center gap-6" style={fd(160)}>
            <button
              onClick={() => scrollTo('chemins')}
              className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-white text-[#09090b] px-8 py-3.5 text-[16px] font-semibold hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              Devenir un Buildr <ArrowRight size={18} strokeWidth={1.5} />
            </button>

            <div className="flex flex-wrap justify-center gap-5">
              {[
                { label: 'Créer mon SaaS', target: 'cree' },
                { label: 'Maîtriser Claude', target: 'maitrise' },
                { label: 'Mon entreprise', target: 'entreprise' },
                { label: 'Mon projet', target: 'projet' },
              ].map((a) => (
                <button
                  key={a.target}
                  onClick={() => scrollTo(a.target)}
                  className="text-[13px] cursor-pointer border-none bg-transparent underline underline-offset-4 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <BuildrsLogo color="rgba(255,255,255,0.25)" iconSize={18} fontSize={12} gap={6} fontWeight={600} />
            <div className="flex flex-wrap gap-5">
              {['Blueprint', 'Claude Buildrs', 'Entreprise', 'Studio', 'Club', 'Affilié'].map((link) => (
                <a key={link} href="#" className="text-[13px] no-underline transition-colors" style={{ color: 'rgba(255,255,255,0.28)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-wrap gap-5">
              {['CGV', 'Mentions légales', 'Politique de confidentialité'].map((link) => (
                <a key={link} href="#" className="text-[12px] no-underline" style={{ color: 'rgba(255,255,255,0.18)' }}>{link}</a>
              ))}
            </div>
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
              © 2026 Buildrs. Le mouvement des builders de demain.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
