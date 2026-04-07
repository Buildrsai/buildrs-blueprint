/**
 * InstaPost2 — "La méthode 6 jours" — 7 slides 1080×1080
 * Alternance fond noir / fond blanc · mockup dashboard J3 et J6
 */

import React from 'react'

const BuildrsHashIcon = ({ color = '#ffffff', size = 22 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

function Logo({ dark = false }) {
  const c = dark ? '#09090b' : '#ffffff'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      <BuildrsHashIcon color={c} size={20} />
      <span style={{ fontSize: '15px', fontWeight: '700', color: c, letterSpacing: '-0.02em' }}>Buildrs</span>
    </div>
  )
}

function Dots({ dark = false }) {
  const c = dark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.07)'
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle, ${c} 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
}

function Counter({ n, total, dark }: { n: number; total: number; dark: boolean }) {
  return (
    <div style={{ fontSize: '12px', fontWeight: '600', color: dark ? '#a1a1aa' : '#3f3f46', fontFamily: "'Geist Mono', monospace" }}>
      {n} / {total}
    </div>
  )
}

const TOTAL = 7

/* ── SLIDE 1 — Cover ── */
export function InstaPost2Slide1() {
  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: '#09090b', fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots />
      <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(77,150,255,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', top: 48, left: 52 }}><Logo /></div>
      <div style={{ position: 'absolute', top: 52, right: 52 }}><Counter n={1} total={TOTAL} dark={false} /></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', border: '1px solid #27272a', borderRadius: '999px', padding: '6px 14px', marginBottom: '28px', width: 'fit-content' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4d96ff' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#71717a', letterSpacing: '0.02em' }}>LA MÉTHODE</span>
        </div>

        <h1 style={{ fontSize: '72px', fontWeight: '800', lineHeight: '1.0', letterSpacing: '-0.045em', color: '#fafafa', margin: '0 0 24px' }}>
          Comment lancer ton logiciel IA rentable en{' '}
          <span style={{ color: '#4d96ff' }}>6 jours.</span>
        </h1>

        <p style={{ fontSize: '22px', color: '#52525b', lineHeight: '1.5', letterSpacing: '-0.01em', margin: '0 0 48px', fontWeight: '500' }}>
          Sans savoir coder. Sans équipe. Sans budget. Claude Code fait le travail.
        </p>

        {/* 6 jours pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['J1 Valider', 'J2 Architecturer', 'J3 Construire', 'J4 Payer', 'J5 Déployer', 'J6 Monétiser'].map((d, i) => (
            <span key={i} style={{ fontSize: '13px', fontWeight: '600', color: '#52525b', border: '1px solid #18181b', borderRadius: '999px', padding: '5px 14px' }}>{d}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 52px 40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#3f3f46', fontWeight: '500' }}>Swipe →</span>
      </div>
    </div>
  )
}

/* ── Helper : slide jour standard ── */
function DaySlide({ n, dark, day, title, desc, items, tag }: {
  n: number; dark: boolean; day: string; title: string; desc: string; items: string[]; tag?: string
}) {
  const bg = dark ? '#09090b' : '#ffffff'
  const fg = dark ? '#fafafa' : '#09090b'
  const muted = dark ? '#52525b' : '#a1a1aa'
  const border = dark ? '#18181b' : '#e4e4e7'
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : '#f4f4f5'

  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: bg, fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots dark={!dark} />

      <div style={{ position: 'absolute', top: 48, left: 52 }}><Logo dark={!dark} /></div>
      <div style={{ position: 'absolute', top: 52, right: 52 }}><Counter n={n} total={TOTAL} dark={!dark} /></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        {/* Jour badge */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontSize: '13px', fontWeight: '800', color: dark ? '#4d96ff' : '#09090b',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            border: `1.5px solid ${dark ? '#4d96ff' : '#09090b'}`,
            borderRadius: '6px', padding: '4px 12px',
            fontFamily: "'Geist Mono', monospace",
          }}>{day}</span>
          {tag && <span style={{ marginLeft: '10px', fontSize: '11px', fontWeight: '700', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '4px', padding: '3px 8px' }}>{tag}</span>}
        </div>

        <h2 style={{ fontSize: '62px', fontWeight: '800', letterSpacing: '-0.04em', color: fg, lineHeight: '1.05', margin: '0 0 16px' }}>{title}</h2>
        <p style={{ fontSize: '20px', color: muted, lineHeight: '1.5', letterSpacing: '-0.01em', margin: '0 0 36px', fontWeight: '400', maxWidth: '700px' }}>{desc}</p>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px', borderRadius: '12px',
              backgroundColor: cardBg, border: `1px solid ${border}`,
            }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontSize: '17px', fontWeight: '600', color: fg, letterSpacing: '-0.01em' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 52px 40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: muted, fontWeight: '500' }}>Swipe →</span>
      </div>
    </div>
  )
}

export function InstaPost2Slide2() {
  return <DaySlide n={2} dark={false} day="Jour 1 — Valider"
    title="Ton idée est scorée par Claude."
    desc="Avant d'écrire la moindre ligne de code, Claude analyse ton idée, le marché, la concurrence. Score sur 100."
    items={['Prompt de validation en 2 minutes', 'Analyse concurrentielle automatique', 'Score de viabilité · 91/100']}
  />
}

export function InstaPost2Slide3() {
  return <DaySlide n={3} dark={true} day="Jour 2 — Architecturer"
    title="L'architecture générée en 1 prompt."
    desc="Claude génère le schéma complet de ta base de données, les tables, les relations, la stack. Rien à inventer."
    items={['Schéma Supabase complet', 'Auth · Paiements · Emails intégrés', 'Stack pro : Vercel · Stripe · Resend']}
  />
}

/* Slide J3 avec mockup terminal */
export function InstaPost2Slide4() {
  const bg = '#ffffff'
  const fg = '#09090b'
  const muted = '#a1a1aa'

  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: bg, fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots dark />

      <div style={{ position: 'absolute', top: 48, left: 52 }}><Logo dark /></div>
      <div style={{ position: 'absolute', top: 52, right: 52 }}><Counter n={4} total={TOTAL} dark /></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: fg, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1.5px solid #09090b', borderRadius: '6px', padding: '4px 12px', fontFamily: "'Geist Mono', monospace" }}>Jour 3 — Construire</span>
        </div>

        <h2 style={{ fontSize: '58px', fontWeight: '800', letterSpacing: '-0.04em', color: fg, lineHeight: '1.05', margin: '0 0 14px' }}>
          Claude code.{' '}
          <span style={{ backgroundColor: '#09090b', color: '#ffffff', padding: '2px 10px', borderRadius: '6px' }}>Toi tu diriges.</span>
        </h2>
        <p style={{ fontSize: '18px', color: muted, lineHeight: '1.5', letterSpacing: '-0.01em', margin: '0 0 28px' }}>1 200 fichiers générés. Zéro ligne de code écrite par toi.</p>

        {/* Mockup terminal */}
        <div style={{ backgroundColor: '#09090b', borderRadius: '14px', overflow: 'hidden', border: '1px solid #27272a', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <div style={{ backgroundColor: '#18181b', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid #27272a' }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#eab308' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ fontSize: '10px', color: '#52525b', fontFamily: "'Geist Mono', monospace", marginLeft: '8px' }}>claude — buildrs-project</span>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '14px', color: '#fafafa' }}>
              <span style={{ color: '#4d96ff' }}>❯</span> claude <span style={{ color: '#22c55e' }}>"Crée le dashboard de mon logiciel"</span>
            </div>
            {[
              'Analysing codebase... 847 files',
              'Building React dashboard... Done',
              'Connecting Supabase API... Success',
              'Deploying to Vercel... Live!',
            ].map((line, i) => (
              <div key={i} style={{ fontFamily: "'Geist Mono', monospace", fontSize: '13px', display: 'flex', gap: '10px' }}>
                <span style={{ color: '#22c55e' }}>✓</span>
                <span style={{ color: '#52525b' }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 52px 40px' }}>
        <span style={{ fontSize: '12px', color: muted, fontWeight: '500' }}>Swipe →</span>
      </div>
    </div>
  )
}

export function InstaPost2Slide5() {
  return <DaySlide n={5} dark={true} day="Jour 4 — Paiements"
    title="Stripe branché en 1 prompt."
    desc="Abonnements, paiement unique, webhook — tout configuré par Claude. Tu n'as jamais à toucher une API."
    items={['Produits Stripe créés automatiquement', 'Checkout sécurisé · Webhook OK', 'Premier test de paiement : succès']}
  />
}

export function InstaPost2Slide6() {
  return <DaySlide n={6} dark={false} day="Jour 5 & 6 — Lancer"
    title="Live en prod. Premier client."
    desc="Vercel déploie en 2 minutes. Tu envoies le lien. Le premier paiement arrive."
    items={['Déployé · Domaine connecté', 'Emails automatiques actifs', 'Premier client payant — J6 ✓']}
    tag="OBJECTIF"
  />
}

/* ── SLIDE 7 — CTA mot-clé ── */
export function InstaPost2Slide7() {
  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: '#09090b', fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 40%, rgba(77,150,255,0.07) 0%, transparent 60%)' }} />

      <div style={{ position: 'absolute', top: 48, left: 52 }}><Logo /></div>
      <div style={{ position: 'absolute', top: 52, right: 52 }}><Counter n={7} total={TOTAL} dark={false} /></div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        <h2 style={{ fontSize: '66px', fontWeight: '800', letterSpacing: '-0.045em', color: '#fafafa', lineHeight: '1.05', margin: '0 0 20px' }}>
          Tu veux suivre cette méthode pas à pas ?
        </h2>

        <p style={{ fontSize: '20px', color: '#52525b', lineHeight: '1.5', letterSpacing: '-0.01em', margin: '0 0 48px' }}>
          J'ai condensé les 6 jours en un guide complet avec tous les prompts Claude à copier-coller.
        </p>

        {/* CTA */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '18px',
          padding: '36px 40px', textAlign: 'center',
        }}>
          <p style={{ fontSize: '16px', color: '#71717a', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Pour recevoir le guide gratuitement
          </p>
          <p style={{ fontSize: '34px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.04em', margin: '0 0 12px', lineHeight: '1.15' }}>
            Écris{' '}
            <span style={{ backgroundColor: '#09090b', color: '#ffffff', padding: '3px 14px', borderRadius: '8px' }}>6 JOURS</span>
            {' '}en commentaire
          </p>
          <p style={{ fontSize: '15px', color: '#a1a1aa', margin: 0 }}>
            Je t'envoie tout en DM
          </p>
        </div>
      </div>
    </div>
  )
}
