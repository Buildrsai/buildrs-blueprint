/**
 * InstaPost1 — "Le Manifeste Buildr" — 3 slides 1080×1080
 * Fond noir · typo massive · chiffres de preuve · CTA mot-clé
 */
import { BLUEPRINT_PRICE } from '../../lib/pricing'

const BuildrsHashIcon = ({ color = '#ffffff', size = 24 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

const SlideShell = ({ children, bg = '#09090b' }: { children: React.ReactNode; bg?: string }) => (
  <div style={{
    width: '1080px', height: '1080px', backgroundColor: bg,
    fontFamily: "'Geist', system-ui, sans-serif",
    display: 'flex', flexDirection: 'column',
    boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
  }}>
    {/* Dot pattern */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }} />
    {/* Logo top-left */}
    <div style={{
      position: 'absolute', top: 48, left: 52,
      display: 'flex', alignItems: 'center', gap: '9px', zIndex: 2,
    }}>
      <BuildrsHashIcon color="#ffffff" size={22} />
      <span style={{ fontSize: '16px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
    </div>
    {/* Slide counter top-right */}
    <div style={{
      position: 'absolute', top: 52, right: 52, zIndex: 2,
      fontSize: '12px', fontWeight: '600', color: '#3f3f46',
      fontFamily: "'Geist Mono', monospace", letterSpacing: '0.05em',
    }}>
      {children && (children as any).props?.counter}
    </div>
    {children}
  </div>
)

/* ── SLIDE 1 — Hook ── */
export function InstaPost1Slide1() {
  return (
    <div style={{
      width: '1080px', height: '1080px', backgroundColor: '#09090b',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>
      {/* Dot pattern */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(77,150,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#ffffff" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      {/* Counter */}
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#3f3f46', fontFamily: "'Geist Mono', monospace" }}>1 / 3</div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        {/* Pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          border: '1px solid #27272a', borderRadius: '999px',
          padding: '6px 14px', marginBottom: '32px', width: 'fit-content',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#71717a', letterSpacing: '0.02em' }}>LE MANIFESTE</span>
        </div>

        {/* Titre massif */}
        <h1 style={{
          fontSize: '76px', fontWeight: '800', lineHeight: '1.0',
          letterSpacing: '-0.045em', color: '#fafafa', margin: '0 0 24px',
        }}>
          Tu utilises l'IA pour résumer des emails.
        </h1>

        {/* Contraste */}
        <div style={{
          borderLeft: '3px solid #4d96ff',
          paddingLeft: '24px', marginBottom: '32px',
        }}>
          <p style={{ fontSize: '28px', fontWeight: '500', color: '#71717a', lineHeight: '1.45', margin: 0, letterSpacing: '-0.02em' }}>
            D'autres construisent des logiciels qui génèrent{' '}
            <span style={{ color: '#22c55e', fontWeight: '700' }}>3 000€/mois</span>
            {' '}avec la même IA.
          </p>
        </div>

        {/* Punchline */}
        <p style={{
          fontSize: '22px', fontWeight: '700', color: '#fafafa',
          letterSpacing: '-0.02em', lineHeight: '1.3',
          borderBottom: '2px solid #4d96ff', paddingBottom: '4px',
          display: 'inline-block', margin: 0,
        }}>
          La différence, c'est la méthode. →
        </p>
      </div>

      {/* Bottom swipe hint */}
      <div style={{ padding: '0 52px 40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#3f3f46', fontWeight: '500' }}>Swipe pour voir</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  )
}

/* ── SLIDE 2 — Ce qu'est un Buildr ── */
export function InstaPost1Slide2() {
  const items = [
    { verb: 'Construit', desc: 'son logiciel IA en quelques jours avec Claude Code', icon: '⬡' },
    { verb: 'Lance',     desc: 'en prod avec Vercel, Supabase, Stripe — stack pro complet', icon: '⬡' },
    { verb: 'Monétise',  desc: 'ses premiers clients payants sans équipe, sans bureau', icon: '⬡' },
  ]

  return (
    <div style={{
      width: '1080px', height: '1080px', backgroundColor: '#09090b',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#ffffff" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#3f3f46', fontFamily: "'Geist Mono', monospace" }}>2 / 3</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        {/* Header */}
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#4d96ff', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>UN BUILDR, C'EST QUOI ?</p>
        <h2 style={{ fontSize: '58px', fontWeight: '800', letterSpacing: '-0.04em', color: '#fafafa', lineHeight: '1.05', margin: '0 0 48px' }}>
          Quelqu'un qui utilise l'IA pour{' '}
          <span style={{ backgroundColor: '#fafafa', color: '#09090b', padding: '2px 10px', borderRadius: '6px' }}>créer de la valeur.</span>
        </h2>

        {/* 3 verbes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '20px',
              padding: '20px 24px', borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid #18181b',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                backgroundColor: '#18181b', border: '1px solid #27272a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontSize: '18px', fontWeight: '800', color: '#4d96ff',
                fontFamily: "'Geist Mono', monospace",
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#fafafa', letterSpacing: '-0.03em', marginBottom: '4px' }}>{item.verb}</div>
                <div style={{ fontSize: '15px', color: '#71717a', lineHeight: '1.4', letterSpacing: '-0.01em' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 52px 40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#3f3f46', fontWeight: '500' }}>Swipe pour les chiffres</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </div>
  )
}

/* ── SLIDE 3 — Chiffres + CTA mot-clé ── */
export function InstaPost1Slide3() {
  const stats = [
    { value: '110+', label: 'Buildrs actifs', sub: 'communauté en croissance' },
    { value: '6j',   label: 'de l\'idée au live', sub: 'méthode Buildrs' },
    { value: `${BLUEPRINT_PRICE}€`, label: 'pour commencer', sub: 'accès à vie · paiement unique' },
  ]

  return (
    <div style={{
      width: '1080px', height: '1080px', backgroundColor: '#09090b',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(34,197,94,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#ffffff" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#3f3f46', fontFamily: "'Geist Mono', monospace" }}>3 / 3</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        <p style={{ fontSize: '14px', fontWeight: '700', color: '#4d96ff', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>LA PREUVE</p>

        <h2 style={{ fontSize: '54px', fontWeight: '800', letterSpacing: '-0.04em', color: '#fafafa', lineHeight: '1.05', margin: '0 0 44px' }}>
          La méthode Buildrs en{' '}
          <span style={{ color: '#22c55e' }}>chiffres.</span>
        </h2>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '24px 20px', borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid #18181b', textAlign: 'center',
            }}>
              <div style={{ fontSize: '46px', fontWeight: '800', color: '#fafafa', letterSpacing: '-0.05em', lineHeight: '1', fontFamily: "'Geist Mono', monospace", marginBottom: '8px' }}>{s.value}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.01em', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: '#52525b' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA mot-clé — encadré fort */}
        <div style={{
          backgroundColor: '#fafafa', borderRadius: '16px',
          padding: '28px 32px', textAlign: 'center',
        }}>
          <p style={{ fontSize: '15px', color: '#71717a', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Tu veux la méthode complète ?
          </p>
          <p style={{ fontSize: '26px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', margin: 0, lineHeight: '1.2' }}>
            Écris{' '}
            <span style={{ backgroundColor: '#09090b', color: '#ffffff', padding: '2px 10px', borderRadius: '6px' }}>BUILDR</span>
            {' '}en commentaire
          </p>
          <p style={{ fontSize: '14px', color: '#71717a', margin: '8px 0 0', letterSpacing: '-0.01em' }}>
            et je t'envoie le guide en DM
          </p>
        </div>
      </div>
    </div>
  )
}
