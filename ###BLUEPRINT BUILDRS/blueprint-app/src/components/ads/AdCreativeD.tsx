/**
 * AdCreativeD — "J'AI LANCÉ MON PREMIER LOGICIEL IA EN 6 JOURS" — Fond blanc
 * Format : 1080×1080px (carré Meta)
 * Angle : preuve première personne · terminal · notifs Stripe · bande CTA noire
 */

const PAD = 52

const BuildrsHashIcon = ({ color = '#09090b', size = 22 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

const Terminal = () => (
  <div style={{
    backgroundColor: '#09090b', borderRadius: '14px',
    overflow: 'hidden', border: '1px solid #27272a',
    boxShadow: '0 24px 60px rgba(0,0,0,0.14)',
  }}>
    {/* Title bar */}
    <div style={{
      backgroundColor: '#18181b', padding: '11px 18px',
      display: 'flex', alignItems: 'center', gap: '12px',
      borderBottom: '1px solid #27272a',
    }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#eab308' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#22c55e' }} />
      </div>
      <span style={{ fontSize: '10px', color: '#52525b', fontFamily: "'Geist Mono', monospace", flex: 1, textAlign: 'center' }}>
        claude — buildrs-project
      </span>
    </div>

    {/* Body */}
    <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {/* Prompt */}
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: '15px',
        color: '#fafafa', lineHeight: '1.55', marginBottom: '4px',
      }}>
        <span style={{ color: '#4d96ff' }}>❯</span>{' '}
        claude{' '}
        <span style={{ color: '#22c55e' }}>"Crée-moi une app de pricing</span>
        <br />
        <span style={{ color: '#22c55e', paddingLeft: '56px' }}>pour e-commerçants Shopify"</span>
      </div>

      <div style={{ height: '1px', backgroundColor: '#27272a', margin: '2px 0 4px' }} />

      {/* Steps */}
      {[
        { label: 'Idée validée',           detail: '· Score 91/100 · Marché 4.2M€' },
        { label: 'Architecture générée',   detail: '· Supabase · Stripe · Vercel' },
        { label: 'Logiciel construit',     detail: '· 1 247 fichiers · zéro ligne de code' },
        { label: 'Premiers clients live',  detail: '· 49€/mois · MRR en route' },
      ].map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 12px', borderRadius: '7px',
          backgroundColor: 'rgba(34,197,94,0.07)',
          border: '1px solid rgba(34,197,94,0.12)',
        }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '13px', color: '#22c55e', fontWeight: '800', flexShrink: 0 }}>✓</span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '14px', color: '#fafafa', fontWeight: '600' }}>{s.label}</span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: '#52525b' }}>{s.detail}</span>
        </div>
      ))}
    </div>
  </div>
)

const StripeNotif = ({
  label, sub, amount, offset = 0,
}: { label: string; sub: string; amount: string; offset?: number }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '12px',
    backgroundColor: '#ffffff', borderRadius: '12px',
    padding: '13px 18px',
    border: '1px solid #e4e4e7',
    boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
    marginLeft: offset,
  }}>
    {/* Stripe logo */}
    <div style={{
      width: '36px', height: '36px', borderRadius: '9px',
      backgroundColor: '#635bff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
      </svg>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.01em' }}>{label}</div>
      <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>{sub}</div>
    </div>
    <div style={{
      fontSize: '20px', fontWeight: '800', color: '#22c55e',
      fontFamily: "'Geist Mono', monospace", letterSpacing: '-0.04em',
    }}>
      {amount}
    </div>
  </div>
)

export function AdCreativeD() {
  return (
    <div style={{
      width: '1080px', height: '1080px',
      backgroundColor: '#ffffff',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>
      {/* Dot pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }} />

      {/* Content zone avec padding */}
      <div style={{ padding: `${PAD}px ${PAD}px 0`, display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', minHeight: 0 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '24px' }}>
          <BuildrsHashIcon color="#09090b" size={22} />
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }}>Buildrs</span>
        </div>

        {/* Titre — 2 lignes, massif */}
        <div style={{ marginBottom: '22px' }}>
          <h1 style={{
            fontSize: '66px', fontWeight: '800', lineHeight: '1.0',
            letterSpacing: '-0.045em', color: '#09090b',
            margin: '0', textTransform: 'uppercase',
          }}>
            J'AI LANCÉ MON PREMIER
          </h1>
          <h1 style={{
            fontSize: '66px', fontWeight: '800', lineHeight: '1.0',
            letterSpacing: '-0.045em', margin: '0',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
          }}>
            <span style={{ color: '#09090b' }}>LOGICIEL IA EN</span>
            {/* Surlignage noir comme sur la LP */}
            <span style={{
              backgroundColor: '#09090b', color: '#ffffff',
              padding: '2px 14px 4px', borderRadius: '8px',
              display: 'inline-block',
            }}>6 JOURS.</span>
          </h1>
        </div>

        {/* Terminal */}
        <Terminal />

        {/* Punchline — plus grosse */}
        <p style={{
          fontSize: '24px', fontWeight: '800', color: '#09090b',
          letterSpacing: '-0.03em', lineHeight: '1.25',
          margin: '14px 0 12px',
        }}>
          Pas une ligne de code écrite.{' '}
          <span style={{ color: '#71717a', fontWeight: '500' }}>Juste toi et Claude.</span>
        </p>

        {/* 4 Stripe notifs empilées */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <StripeNotif
            label="Paiement reçu"
            sub="PricerShop · Abonnement mensuel · Client #1"
            amount="+49€"
          />
          <StripeNotif
            label="Paiement reçu"
            sub="PricerShop · Abonnement mensuel · Client #2"
            amount="+49€"
            offset={20}
          />
          <StripeNotif
            label="Paiement reçu"
            sub="PricerShop · Abonnement mensuel · Client #3"
            amount="+49€"
            offset={40}
          />
          <StripeNotif
            label="Paiement reçu"
            sub="PricerShop · Abonnement mensuel · Client #4"
            amount="+49€"
            offset={60}
          />
        </div>
      </div>

      {/* Bande CTA pleine largeur — sort du padding */}
      <div style={{
        backgroundColor: '#09090b',
        marginTop: '24px',
        padding: '22px 52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: '22px', fontWeight: '800', color: '#ffffff',
            letterSpacing: '-0.03em', lineHeight: '1.1',
          }}>
            Apprends la méthode —
          </div>
          <div style={{
            fontSize: '22px', fontWeight: '800', color: '#ffffff',
            letterSpacing: '-0.03em', lineHeight: '1.1',
          }}>
            Démarre maintenant →
          </div>
          <div style={{ fontSize: '12px', color: '#52525b', marginTop: '6px', letterSpacing: '0.02em' }}>
            27€ · Accès à vie · buildrs.fr
          </div>
        </div>
        {/* Prix mis en valeur */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
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
