/**
 * AdCreativeE — "6 JOURS." Roadmap · Fond noir · DA LP
 * Format : 1080×1080px (carré Meta)
 * Angle : bandeau frustration IA → titre massif → timeline lisible → bande CTA noire
 */

const BuildrsHashIcon = ({ color = '#ffffff', size = 20 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

const days = [
  { day: 'J1', label: 'Idée trouvée & validée',   detail: 'Score de viabilité · Analyse marché par Claude',    color: '#52525b' },
  { day: 'J2', label: 'Architecture générée',      detail: 'Schéma BDD · Stack pro configuré en 1 prompt',     color: '#52525b' },
  { day: 'J3', label: 'Logiciel construit',        detail: '1 200+ fichiers · Zéro ligne de code écrite',      color: '#52525b' },
  { day: 'J4', label: 'Paiements branchés',        detail: 'Stripe actif · Abonnements · Webhook OK',          color: '#52525b' },
  { day: 'J5', label: 'Déployé en production',     detail: 'Vercel · Domaine · Emails automatiques',           color: '#52525b' },
  { day: 'J6', label: 'Premier client payant',     detail: '+49€/mois · MRR lancé · Revenus en autopilote',    color: '#22c55e' },
]

export function AdCreativeE() {
  const PAD = 52

  return (
    <div style={{
      width: '1080px', height: '1080px',
      backgroundColor: '#09090b',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>

      {/* Dot pattern — DA LP */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* ── BANDEAU TOP — accroche forte ── */}
      <div style={{
        borderBottom: '1px solid #18181b',
        padding: '18px 52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, position: 'relative', backgroundColor: '#0d0d0f',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <BuildrsHashIcon color="#ffffff" size={20} />
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
        </div>

        {/* Message */}
        <div style={{ fontSize: '16px', fontWeight: '500', color: '#71717a', letterSpacing: '-0.01em' }}>
          Pour ceux qui veulent{' '}
          <span style={{
            color: '#fafafa', fontWeight: '800',
            borderBottom: '2px solid #4d96ff', paddingBottom: '1px',
          }}>
            enfin tirer parti de l'IA
          </span>
          {' '}et générer des revenus.
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div style={{
        padding: `30px ${PAD}px 0`,
        display: 'flex', flexDirection: 'column',
        flex: 1, position: 'relative', minHeight: 0,
      }}>

        {/* Titre massif */}
        <div style={{ marginBottom: '10px' }}>
          <h1 style={{
            fontSize: '118px', fontWeight: '800', lineHeight: '0.93',
            letterSpacing: '-0.055em', color: '#fafafa', margin: '0',
          }}>
            6 JOURS
            <span style={{ color: '#4d96ff' }}>.</span>
          </h1>
        </div>

        {/* Sous-titre */}
        <p style={{
          fontSize: '20px', fontWeight: '500', color: '#71717a',
          letterSpacing: '-0.015em', lineHeight: '1.4', margin: '0 0 22px',
        }}>
          Pour créer ton{' '}
          <span style={{ color: '#fafafa', fontWeight: '700' }}>Micro-SaaS IA rentable</span>
          {' '}avec{' '}
          <span style={{ color: '#fafafa', fontWeight: '700' }}>Claude Code</span>
          {' '}— sans savoir coder.
        </p>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0 }}>
          {days.map((d, i) => {
            const isLast = i === days.length - 1
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '13px 18px',
                borderRadius: '12px',
                backgroundColor: isLast ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isLast ? 'rgba(34,197,94,0.2)' : '#18181b'}`,
              }}>

                {/* Jour badge */}
                <div style={{
                  width: '40px', flexShrink: 0, textAlign: 'center',
                  fontSize: '13px', fontWeight: '800',
                  color: isLast ? '#22c55e' : '#3f3f46',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  fontFamily: "'Geist Mono', monospace",
                }}>
                  {d.day}
                </div>

                {/* Cercle check */}
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: isLast ? '#22c55e' : '#18181b',
                  border: `1.5px solid ${isLast ? '#22c55e' : '#27272a'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={isLast ? '#09090b' : '#3f3f46'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Textes */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '18px', fontWeight: '700',
                    color: isLast ? '#22c55e' : '#fafafa',
                    letterSpacing: '-0.02em', lineHeight: '1.2',
                  }}>
                    {d.label}
                  </div>
                  <div style={{
                    fontSize: '13px', color: isLast ? 'rgba(34,197,94,0.6)' : '#52525b',
                    marginTop: '2px', letterSpacing: '-0.01em',
                  }}>
                    {d.detail}
                  </div>
                </div>

                {/* Indicateur final */}
                {isLast && (
                  <div style={{
                    fontSize: '11px', fontWeight: '700', color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.35)',
                    padding: '3px 8px', borderRadius: '5px',
                    fontFamily: "'Geist Mono', monospace",
                    flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    OBJECTIF
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── BANDE CTA — DA noir pur ── */}
      <div style={{
        backgroundColor: '#111113',
        borderTop: '1px solid #18181b',
        marginTop: '20px', padding: '22px 52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: '24px', fontWeight: '800', color: '#ffffff',
            letterSpacing: '-0.035em', lineHeight: '1.1',
          }}>
            Découvre la méthode →
          </div>
          <div style={{ fontSize: '13px', color: '#52525b', marginTop: '5px', letterSpacing: '-0.01em' }}>
            buildrs.fr · Accès immédiat · Paiement unique
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '11px', fontWeight: '600', color: '#3f3f46',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px',
          }}>
            BUILDRS BLUEPRINT
          </div>
          <div style={{
            fontSize: '48px', fontWeight: '800', color: '#ffffff',
            letterSpacing: '-0.05em', lineHeight: '1',
            fontFamily: "'Geist Mono', monospace",
          }}>
            27€
          </div>
        </div>
      </div>
    </div>
  )
}
