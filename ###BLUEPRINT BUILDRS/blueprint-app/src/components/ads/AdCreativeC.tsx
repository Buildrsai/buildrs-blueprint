import { BLUEPRINT_PRICE } from '../../lib/pricing'

/**
 * AdCreativeC — "Ton app, ton SaaS ou ton logiciel" — Fond noir
 * Format : 1080×1080px (carré Meta)
 * Angle : version dark de la pub qui marche — même structure, couleurs inversées
 */

const BuildrsHashIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

/** Mockup dashboard — version dark */
const DashboardMockup = () => (
  <div style={{
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #27272a',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    backgroundColor: '#09090b',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  }}>
    {/* Browser chrome */}
    <div style={{
      backgroundColor: '#18181b',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid #27272a',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#eab308' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
      </div>
      <div style={{
        flex: 1, backgroundColor: '#09090b', borderRadius: '5px',
        padding: '4px 10px', fontSize: '9px', color: '#52525b',
        fontFamily: "'Geist Mono', monospace", textAlign: 'center',
      }}>
        app.buildrs.fr/dashboard
      </div>
    </div>

    {/* App layout */}
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{
        width: '130px', flexShrink: 0,
        backgroundColor: '#09090b',
        borderRight: '1px solid #18181b',
        padding: '12px 0',
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px', marginBottom: '12px' }}>
          <BuildrsHashIcon color="#ffffff" size={13} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
        </div>

        {/* XP bar */}
        <div style={{ padding: '0 12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '7px', fontWeight: '700', color: '#4d96ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>EXPLORER</span>
            <span style={{ fontSize: '7px', color: '#52525b', fontFamily: "'Geist Mono', monospace" }}>42 XP</span>
          </div>
          <div style={{ height: '3px', backgroundColor: '#18181b', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '42%', background: 'linear-gradient(90deg, #4d96ff, #8b5cf6)', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Nav items */}
        {[
          { label: 'Accueil', active: true },
          { label: 'Claude OS', active: false },
        ].map(item => (
          <div key={item.label} style={{
            padding: '6px 12px', fontSize: '9.5px', fontWeight: item.active ? '600' : '400',
            color: item.active ? '#fafafa' : '#52525b',
            backgroundColor: item.active ? '#18181b' : 'transparent',
            borderRadius: '6px', margin: '0 6px',
          }}>
            {item.label}
          </div>
        ))}

        <div style={{ padding: '6px 12px 2px', fontSize: '7px', fontWeight: '600', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px' }}>
          MON PARCOURS
        </div>
        {['00 Fondations', '01 Configuration', '02 Mon idée', '03 Valider', '04 Structurer'].map((m, i) => (
          <div key={m} style={{
            padding: '5px 12px', fontSize: '8.5px',
            color: i < 2 ? '#22c55e' : i === 2 ? '#fafafa' : '#3f3f46',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            {i < 2 && <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />}
            {i === 2 && <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#4d96ff', flexShrink: 0 }} />}
            {i > 2 && <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#27272a', flexShrink: 0 }} />}
            {m}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fafafa', letterSpacing: '-0.03em' }}>Salut, Alex</div>
            <div style={{ fontSize: '8px', color: '#52525b' }}>Ton SaaS prend forme — continue.</div>
          </div>
          <div style={{ fontSize: '8px', fontWeight: '700', color: '#4d96ff', border: '1px solid #4d96ff', borderRadius: '4px', padding: '2px 6px' }}>EXPLORER</div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { label: 'Modules', value: '3/11', color: '#4d96ff' },
            { label: 'Tâches', value: '8', color: '#22c55e' },
            { label: 'Score', value: '72', color: '#eab308' },
          ].map(m => (
            <div key={m.label} style={{
              flex: 1, backgroundColor: '#18181b', borderRadius: '6px',
              padding: '7px 8px', border: '1px solid #27272a',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: m.color, letterSpacing: '-0.03em', fontFamily: "'Geist Mono', monospace" }}>{m.value}</div>
              <div style={{ fontSize: '7px', color: '#52525b' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Jarvis block */}
        <div style={{
          backgroundColor: '#18181b', borderRadius: '8px',
          border: '1px solid #27272a', padding: '10px 12px',
          flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '6px',
              backgroundColor: '#09090b', border: '1px solid #22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="12" x2="12" y2="14"/>
              </svg>
            </div>
            <span style={{ fontSize: '9px', fontWeight: '700', color: '#fafafa' }}>Jarvis IA</span>
            <span style={{ fontSize: '7px', fontWeight: '700', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '1px 5px', borderRadius: '3px' }}>EN LIGNE</span>
          </div>
          <div style={{ fontSize: '9px', color: '#71717a', lineHeight: '1.5', marginBottom: '8px' }}>
            Module 03 en cours — valide ton idée avant de coder. Voici la prochaine action à faire.
          </div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <div style={{
              flex: 1, backgroundColor: '#09090b', borderRadius: '5px',
              border: '1px solid #27272a', padding: '5px 8px',
              fontSize: '8px', color: '#52525b',
            }}>
              Demande à Jarvis...
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: '5px',
              backgroundColor: '#fafafa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: '90px', flexShrink: 0,
        borderLeft: '1px solid #18181b',
        padding: '12px 8px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {/* Score */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#22c55e', letterSpacing: '-0.04em', fontFamily: "'Geist Mono', monospace", lineHeight: 1 }}>72</div>
          <div style={{ fontSize: '6.5px', color: '#52525b', lineHeight: '1.4', marginTop: '3px' }}>Score de viabilité</div>
        </div>

        {/* Stack */}
        <div>
          <div style={{ fontSize: '6px', fontWeight: '700', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>STACK</div>
          {['Claude Code', 'Supabase', 'Vercel', 'Stripe'].map(tool => (
            <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: '7.5px', color: '#71717a' }}>{tool}</span>
            </div>
          ))}
        </div>

        {/* MRR */}
        <div style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.15)', padding: '6px' }}>
          <div style={{ fontSize: '6px', color: '#52525b', marginBottom: '2px' }}>MRR estimé</div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#22c55e', letterSpacing: '-0.03em', fontFamily: "'Geist Mono', monospace" }}>2 400€</div>
        </div>
      </div>
    </div>
  </div>
)

export function AdCreativeC() {
  const PAD = 52

  return (
    <div style={{
      width: '1080px', height: '1080px',
      backgroundColor: '#09090b',
      fontFamily: "'Geist', system-ui, sans-serif",
      padding: `${PAD}px`,
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>
      {/* Subtle dot pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Radial glow top */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(77,150,255,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '32px', position: 'relative' }}>
        <BuildrsHashIcon color="#ffffff" size={24} />
        <span style={{ fontSize: '17px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: '64px', fontWeight: '800', lineHeight: '1.03',
        letterSpacing: '-0.04em', color: '#fafafa',
        margin: '0 0 12px', position: 'relative',
      }}>
        Tout ce qu'il te faut pour créer{' '}
        <span style={{
          background: 'linear-gradient(135deg, #4d96ff 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ton app, ton SaaS ou ton logiciel.
        </span>
        {' '}En 6 jours.
      </h1>

      {/* Sub */}
      <p style={{ fontSize: '17px', color: '#71717a', margin: '0 0 22px', lineHeight: '1.55', position: 'relative' }}>
        Claude comme moteur. La méthode Buildrs comme plan. Toi comme fondateur.
      </p>

      {/* Dashboard mockup */}
      <DashboardMockup />

      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', position: 'relative' }}>
        {["Sans savoir coder", "Moins de 50€ d'outils", "En solo, sans équipe"].map(b => (
          <span key={b} style={{
            fontSize: '13px', fontWeight: '500', padding: '7px 16px',
            borderRadius: '999px', border: '1.5px solid #27272a',
            color: '#a1a1aa', whiteSpace: 'nowrap',
          }}>· {b}</span>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '18px', marginTop: '14px',
        borderTop: '1px solid #18181b', position: 'relative',
      }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>BUILDRS BLUEPRINT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '34px', fontWeight: '800', color: '#fafafa', letterSpacing: '-0.04em', lineHeight: '1' }}>{BLUEPRINT_PRICE}€</span>
            <span style={{ fontSize: '14px', color: '#52525b' }}>Paiement unique · Accès à vie</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px' }}>
          <button style={{
            backgroundColor: '#ffffff', color: '#09090b',
            padding: '15px 32px', borderRadius: '12px',
            fontSize: '15px', fontWeight: '700', border: 'none',
            cursor: 'pointer', fontFamily: "'Geist', system-ui, sans-serif",
            letterSpacing: '-0.01em',
          }}>
            Je démarre →
          </button>
          <span style={{ fontSize: '11px', color: '#3f3f46' }}>{BLUEPRINT_PRICE}€ · Offre de lancement · buildrs.fr</span>
        </div>
      </div>
    </div>
  )
}
