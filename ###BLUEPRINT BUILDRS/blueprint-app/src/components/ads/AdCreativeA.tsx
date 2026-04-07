/**
 * AdCreativeA — "SaaS qui encaisse"
 * Format : 1080×1080px (carré Meta)
 * Style : Premium SaaS level — Linear/Stripe quality, indigo accent, SVG chart
 * Accent : Noir Buildrs (#09090b) — pas de vert générique
 */

const BuildrsHashIcon = ({ color = '#09090b', size = 22 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

/** Stripe notification toast — fond blanc, Stripe violet */
const StripeNotif = ({
  name, amount, time, opacity = 1
}: { name: string; amount: string; time: string; opacity?: number }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '12px',
    backgroundColor: '#ffffff', borderRadius: '10px',
    padding: '11px 14px', border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    opacity, width: '100%',
  }}>
    <div style={{
      width: '34px', height: '34px', borderRadius: '8px',
      backgroundColor: '#635bff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
      </svg>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#0f172a', fontFamily: "'Geist', system-ui, sans-serif" }}>
          Nouveau paiement
        </span>
        <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: "'Geist', system-ui, sans-serif" }}>{time}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b', fontFamily: "'Geist', system-ui, sans-serif" }}>
        {name} ·{' '}
        <span style={{ color: '#09090b', fontWeight: '700', fontFamily: "'Geist Mono', monospace" }}>{amount}</span>
      </div>
    </div>
  </div>
)

/** Area chart SVG — courbe MRR organique (pas trop parfaite) */
const MRRChart = () => {
  const W = 480
  const H = 120
  // Points de données MRR sur 8 mois — légèrement irréguliers = réaliste
  const pts = [
    { x: 0,   y: 95 },
    { x: 68,  y: 88 },
    { x: 137, y: 78 },
    { x: 205, y: 62 },
    { x: 274, y: 55 },
    { x: 342, y: 38 },
    { x: 411, y: 22 },
    { x: 480, y: 8  },
  ]
  const toSVG = (x: number, y: number) => `${x},${y}`
  // Courbe lissée (cubic bezier)
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${toSVG(p.x, p.y)}`
    const prev = pts[i - 1]
    const cp1x = prev.x + (p.x - prev.x) * 0.5
    const cp2x = p.x - (p.x - prev.x) * 0.5
    return `${acc} C ${cp1x},${prev.y} ${cp2x},${p.y} ${toSVG(p.x, p.y)}`
  }, '')
  const areaD = `${d} L ${W},${H} L 0,${H} Z`

  const months = ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr']

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip au dernier point */}
      <div style={{
        position: 'absolute', top: '-6px', right: '0px',
        backgroundColor: '#09090b', color: '#ffffff',
        padding: '4px 10px', borderRadius: '6px',
        fontSize: '11px', fontWeight: '700',
        fontFamily: "'Geist Mono', monospace",
        pointerEvents: 'none',
      }}>
        2 847€
      </div>

      <svg width={W} height={H + 24} viewBox={`0 0 ${W} ${H + 24}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="mrr-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
          {/* Grid lines */}
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line key={i}
            x1="0" y1={H * p}
            x2={W} y2={H * p}
            stroke="#f1f5f9" strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#mrr-grad)" />

        {/* Line */}
        <path d={d} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Last point dot */}
        <circle cx={480} cy={8} r="4.5" fill="#6366f1" />
        <circle cx={480} cy={8} r="8" fill="#6366f1" fillOpacity="0.15" />

        {/* Month labels */}
        {months.map((m, i) => (
          <text
            key={m}
            x={i * (W / (months.length - 1))}
            y={H + 18}
            textAnchor="middle"
            fontSize="10"
            fill="#94a3b8"
            fontFamily="'Geist', system-ui, sans-serif"
          >{m}</text>
        ))}
      </svg>
    </div>
  )
}

/** Mockup SaaS premium — style Linear/Stripe, light mode, indigo accent */
const SaaSAppMock = () => {
  const SIDEBAR_BG = '#0f172a'  // Navy dark — contraste fort avec fond blanc de l'ad
  const MAIN_BG    = '#ffffff'
  const BORDER     = '#e2e8f0'
  const INDIGO     = '#6366f1'

  return (
    <div style={{
      backgroundColor: MAIN_BG,
      borderRadius: '14px',
      overflow: 'hidden',
      display: 'flex',
      width: '100%',
      height: '100%',
      fontFamily: "'Geist', system-ui, sans-serif",
      border: `1px solid ${BORDER}`,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
    }}>

      {/* ── Sidebar navy ── */}
      <div style={{
        width: '168px', flexShrink: 0,
        backgroundColor: SIDEBAR_BG,
        padding: '16px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo app */}
        <div style={{ padding: '0 14px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            InvoiceAI
          </span>
        </div>

        {/* Nav items */}
        <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {[
            { label: 'Dashboard', active: true  },
            { label: 'Factures',  active: false },
            { label: 'Clients',   active: false },
            { label: 'Revenus',   active: false },
          ].map(item => (
            <div key={item.label} style={{
              padding: '7px 10px',
              borderRadius: '7px',
              fontSize: '11.5px',
              fontWeight: item.active ? '600' : '400',
              color: item.active ? '#f8fafc' : '#64748b',
              backgroundColor: item.active ? 'rgba(99,102,241,0.2)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: '8px',
              borderLeft: item.active ? `2px solid ${INDIGO}` : '2px solid transparent',
            }}>
              {item.label}
            </div>
          ))}
        </div>

        {/* MRR badge en bas de sidebar */}
        <div style={{ marginTop: 'auto', padding: '10px 14px' }}>
          <div style={{
            padding: '10px 12px', borderRadius: '9px',
            backgroundColor: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              MRR
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc', fontFamily: "'Geist Mono', monospace", lineHeight: '1' }}>
              2 847€
            </div>
            <div style={{ fontSize: '9px', color: '#6366f1', marginTop: '3px', fontWeight: '500' }}>
              +23% ce mois
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, padding: '16px 20px', overflow: 'hidden', backgroundColor: '#fafafa' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Dashboard</span>
            <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>Avril 2026</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            backgroundColor: '#09090b', borderRadius: '7px', padding: '5px 12px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#ffffff' }}>+ Nouvelle facture</span>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Revenus totaux', value: '2 847€',  sub: '+23% vs mars',   accent: INDIGO },
            { label: 'Payées ce mois',  value: '47',      sub: 'sur 51 envoyées', accent: '#0891b2' },
            { label: 'Taux de recouvrement', value: '94%', sub: '+2pts vs mars', accent: '#059669' },
          ].map(card => (
            <div key={card.label} style={{
              flex: 1, padding: '12px 14px',
              backgroundColor: '#ffffff', borderRadius: '10px',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '9.5px', color: '#94a3b8', marginBottom: '5px', fontWeight: '500' }}>{card.label}</div>
              <div style={{
                fontSize: '22px', fontWeight: '800', color: '#0f172a',
                fontFamily: "'Geist Mono', monospace", lineHeight: '1', marginBottom: '3px',
              }}>{card.value}</div>
              <span style={{ fontSize: '9.5px', color: card.accent, fontWeight: '600' }}>{card.sub}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '10px',
          border: `1px solid ${BORDER}`, padding: '12px 14px',
          marginBottom: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a' }}>Croissance MRR</span>
            <span style={{ fontSize: '9.5px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
              8 derniers mois
            </span>
          </div>
          <MRRChart />
        </div>

        {/* Recent invoices mini-table */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '10px',
          border: `1px solid ${BORDER}`,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {/* Table header */}
          <div style={{
            display: 'flex', padding: '8px 14px',
            borderBottom: `1px solid ${BORDER}`,
            backgroundColor: '#f8fafc',
          }}>
            {['Client', 'Montant', 'Statut'].map(h => (
              <span key={h} style={{
                fontSize: '9.5px', fontWeight: '600', color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                flex: h === 'Client' ? 2 : 1,
              }}>{h}</span>
            ))}
          </div>
          {/* Rows */}
          {[
            { client: 'Dupont SARL',     amount: '490€',  status: 'Payée',   color: '#059669', bg: 'rgba(5,150,105,0.08)' },
            { client: 'Studio Martin',   amount: '290€',  status: 'Payée',   color: '#059669', bg: 'rgba(5,150,105,0.08)' },
            { client: 'Tech Solutions',  amount: '890€',  status: 'En attente', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
            { client: 'Agence Weber',    amount: '690€',  status: 'Payée',   color: '#059669', bg: 'rgba(5,150,105,0.08)' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '8px 14px',
              borderBottom: i < 3 ? `1px solid ${BORDER}` : 'none',
            }}>
              <span style={{ flex: 2, fontSize: '11px', color: '#334155', fontWeight: '500' }}>{row.client}</span>
              <span style={{ flex: 1, fontSize: '11px', fontWeight: '700', color: '#0f172a', fontFamily: "'Geist Mono', monospace" }}>{row.amount}</span>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: '9.5px', fontWeight: '600', color: row.color,
                  backgroundColor: row.bg, padding: '2px 8px', borderRadius: '4px',
                }}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdCreativeA() {
  const PAD = 52

  return (
    <div style={{
      width: '1080px', height: '1080px', backgroundColor: '#ffffff',
      fontFamily: "'Geist', system-ui, sans-serif",
      padding: `${PAD}px`, display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>

      {/* Logo Buildrs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '26px' }}>
        <BuildrsHashIcon color="#09090b" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: '72px', fontWeight: '800', lineHeight: '1.02',
        letterSpacing: '-0.045em', color: '#09090b', margin: '0 0 14px',
      }}>
        Son micro SaaS IA génère{' '}
        <span style={{ borderBottom: '5px solid #09090b', paddingBottom: '2px' }}>
          2 847€/mois
        </span>.
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize: '18px', color: '#64748b', margin: '0 0 18px', lineHeight: '1.5' }}>
        MVP en 6 jours. Sans coder. Avec Claude comme moteur.
      </p>

      {/* SaaS App + Stripe notifs */}
      <div style={{ flex: 1, display: 'flex', gap: '14px', minHeight: 0, marginBottom: '18px' }}>
        {/* App mockup */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SaaSAppMock />
        </div>

        {/* Stripe column */}
        <div style={{
          width: '230px', flexShrink: 0, display: 'flex', flexDirection: 'column',
          gap: '8px', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
            Paiements reçus
          </div>
          <StripeNotif name="Marie L."   amount="+49€" time="2 min"  opacity={1} />
          <StripeNotif name="Paul D."    amount="+49€" time="14 min" opacity={0.88} />
          <StripeNotif name="Julie M."   amount="+49€" time="38 min" opacity={0.75} />
          <StripeNotif name="Thomas R."  amount="+49€" time="1h"     opacity={0.6} />
          <StripeNotif name="Sarah K."   amount="+49€" time="2h"     opacity={0.45} />

          {/* Total du jour */}
          <div style={{
            marginTop: '4px', padding: '12px 14px',
            borderRadius: '10px', border: '1.5px solid #09090b',
            backgroundColor: '#09090b', textAlign: 'center',
          }}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              AUJOURD'HUI
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', fontFamily: "'Geist Mono', monospace", lineHeight: '1' }}>
              +392€
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>8 transactions</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        {["Sans savoir coder", "Moins de 50€ d'outils", "MVP en 6 jours"].map(b => (
          <span key={b} style={{
            fontSize: '13px', fontWeight: '500', padding: '7px 16px',
            borderRadius: '999px', border: '1.5px solid #e2e8f0',
            color: '#09090b', whiteSpace: 'nowrap',
          }}>· {b}</span>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '18px', borderTop: '1.5px solid #e2e8f0',
      }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
            BUILDRS BLUEPRINT
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '34px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.04em', lineHeight: '1' }}>27€</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>De l'idée au SaaS monétisé</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px' }}>
          <button style={{
            backgroundColor: '#09090b', color: '#ffffff', padding: '15px 30px',
            borderRadius: '12px', fontSize: '15px', fontWeight: '600', border: 'none',
            cursor: 'pointer', fontFamily: "'Geist', system-ui, sans-serif", letterSpacing: '-0.01em',
          }}>Je démarre →</button>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>27€ · Offre de lancement · buildrs.fr</span>
        </div>
      </div>
    </div>
  )
}
