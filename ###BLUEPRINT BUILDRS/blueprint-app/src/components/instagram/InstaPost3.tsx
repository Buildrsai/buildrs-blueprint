/**
 * InstaPost3 — "Avant / Après" — 4 slides 1080×1080
 * ChatGPT circulaire vs Claude Code qui produit · CTA CLAUDE
 */

import React from 'react'

const BuildrsHashIcon = ({ color = '#09090b', size = 22 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

function Dots({ dark = false }) {
  const c = dark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.07)'
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle, ${c} 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
}

const TOTAL = 4

/* ── SLIDE 1 — Hook cover ── */
export function InstaPost3Slide1() {
  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: '#ffffff', fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots dark />

      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#09090b" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#a1a1aa', fontFamily: "'Geist Mono', monospace" }}>1 / {TOTAL}</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', border: '1px solid #e4e4e7', borderRadius: '999px', padding: '6px 14px', marginBottom: '28px', width: 'fit-content' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#09090b' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#71717a', letterSpacing: '0.02em' }}>AVANT / APRÈS</span>
        </div>

        <h1 style={{ fontSize: '72px', fontWeight: '800', lineHeight: '1.0', letterSpacing: '-0.045em', color: '#09090b', margin: '0 0 24px' }}>
          Ce que tu fais avec ChatGPT.
        </h1>

        <div style={{ width: '100%', height: '3px', backgroundColor: '#09090b', marginBottom: '24px', borderRadius: '2px' }} />

        <h1 style={{ fontSize: '72px', fontWeight: '800', lineHeight: '1.0', letterSpacing: '-0.045em', margin: '0 0 32px' }}>
          <span style={{ backgroundColor: '#09090b', color: '#ffffff', padding: '4px 14px', borderRadius: '8px' }}>Ce que tu construis</span>{' '}
          <span style={{ color: '#09090b' }}>avec Claude Code.</span>
        </h1>

        <p style={{ fontSize: '20px', color: '#71717a', lineHeight: '1.5', letterSpacing: '-0.01em', margin: 0 }}>
          Ce n'est pas la même IA. Ce n'est pas le même résultat.
        </p>
      </div>

      <div style={{ padding: '0 52px 40px' }}>
        <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '500' }}>Swipe →</span>
      </div>
    </div>
  )
}

/* ── SLIDE 2 — AVANT : ChatGPT circulaire ── */
export function InstaPost3Slide2() {
  const messages = [
    { user: true,  text: 'Comment je crée un SaaS rentable ?' },
    { user: false, text: 'Pour créer un SaaS rentable, vous devez identifier votre marché cible, valider votre idée, puis développer un MVP en vous concentrant sur les fonctionnalités essentielles...' },
    { user: true,  text: 'Ok mais par quoi je commence concrètement ?' },
    { user: false, text: 'Je recommande de commencer par définir votre proposition de valeur unique. Identifiez un problème que votre SaaS résoudra mieux que la concurrence...' },
    { user: true,  text: 'Et le code, tu peux le faire pour moi ?' },
    { user: false, text: 'Je peux vous aider à écrire du code, mais vous aurez besoin de connaissances en développement pour le mettre en production...' },
  ]

  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: '#ffffff', fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots dark />

      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#09090b" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#a1a1aa', fontFamily: "'Geist Mono', monospace" }}>2 / {TOTAL}</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '100px 52px 0' }}>

        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AVANT — Sans méthode</span>
        </div>

        <h2 style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.04em', color: '#09090b', lineHeight: '1.1', margin: '0 0 24px' }}>
          Des réponses. Pas de produit.
        </h2>

        {/* Chat mockup */}
        <div style={{
          backgroundColor: '#fafafa', borderRadius: '14px',
          border: '1px solid #e4e4e7', overflow: 'hidden',
          flex: 1, display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#10a37f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: 'white', fontWeight: '700' }}>G</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>ChatGPT — Nouvelle conversation</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#9ca3af', border: '1px solid #e5e7eb', padding: '2px 8px', borderRadius: '4px' }}>Semaine 3...</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.user ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '8px 12px', borderRadius: m.user ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  backgroundColor: m.user ? '#374151' : '#ffffff',
                  border: m.user ? 'none' : '1px solid #e5e7eb',
                  fontSize: '11px', color: m.user ? '#ffffff' : '#374151', lineHeight: '1.5',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Footer résultat */}
          <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', borderTop: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '700' }}>3 semaines de conversations. Toujours rien de construit.</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 52px 32px' }}>
        <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: '500' }}>Swipe →</span>
      </div>
    </div>
  )
}

/* ── SLIDE 3 — APRÈS : Claude Code qui produit ── */
export function InstaPost3Slide3() {
  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: '#09090b', fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots />

      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#ffffff" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#fafafa', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#3f3f46', fontFamily: "'Geist Mono', monospace" }}>3 / {TOTAL}</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '100px 52px 0' }}>

        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>APRÈS — Méthode Buildrs</span>
        </div>

        <h2 style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.04em', color: '#fafafa', lineHeight: '1.1', margin: '0 0 24px' }}>
          Un logiciel livré en 6 jours.
        </h2>

        {/* Terminal */}
        <div style={{ backgroundColor: '#18181b', borderRadius: '14px', overflow: 'hidden', border: '1px solid #27272a', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#111113', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid #27272a' }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#eab308' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ fontSize: '10px', color: '#52525b', fontFamily: "'Geist Mono', monospace", marginLeft: '8px' }}>claude — buildrs</span>
          </div>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '14px', color: '#fafafa', marginBottom: '4px' }}>
              <span style={{ color: '#4d96ff' }}>❯</span> claude <span style={{ color: '#22c55e' }}>"Lance mon logiciel de pricing Shopify"</span>
            </div>
            {[
              ['✓', 'Idée validée', '· Score 91/100'],
              ['✓', 'Architecture générée', '· Supabase · Vercel'],
              ['✓', 'Dashboard construit', '· 1 247 fichiers'],
              ['✓', 'Stripe branché', '· 49€/mois actif'],
              ['✓', 'Déployé en prod', '· buildrs.fr live'],
            ].map(([icon, label, detail], i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 12px', borderRadius: '7px', backgroundColor: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.1)' }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", color: '#22c55e', fontWeight: '800', fontSize: '13px' }}>{icon}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '13px', color: '#fafafa', fontWeight: '600' }}>{label}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: '#52525b' }}>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe notif */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '14px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', backgroundColor: '#635bff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#09090b' }}>Paiement reçu — Jour 6</div>
            <div style={{ fontSize: '11px', color: '#71717a' }}>PricerShop · Abonnement mensuel · Client #1</div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#22c55e', fontFamily: "'Geist Mono', monospace", letterSpacing: '-0.04em' }}>+49€</div>
        </div>
      </div>

      <div style={{ padding: '16px 52px 32px' }}>
        <span style={{ fontSize: '12px', color: '#3f3f46', fontWeight: '500' }}>Swipe →</span>
      </div>
    </div>
  )
}

/* ── SLIDE 4 — CTA mot-clé ── */
export function InstaPost3Slide4() {
  return (
    <div style={{ width: '1080px', height: '1080px', backgroundColor: '#ffffff', fontFamily: "'Geist', system-ui, sans-serif", display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Dots dark />

      <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <BuildrsHashIcon color="#09090b" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 52, fontSize: '12px', fontWeight: '600', color: '#a1a1aa', fontFamily: "'Geist Mono', monospace" }}>4 / {TOTAL}</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px' }}>

        <h2 style={{ fontSize: '64px', fontWeight: '800', letterSpacing: '-0.045em', color: '#09090b', lineHeight: '1.05', margin: '0 0 20px' }}>
          Tu veux la liste des outils qu'on utilise ?
        </h2>

        <p style={{ fontSize: '20px', color: '#71717a', lineHeight: '1.5', letterSpacing: '-0.01em', margin: '0 0 48px' }}>
          Claude Code · Supabase · Vercel · Stripe · Resend — la stack complète, avec les configs qu'on utilise chez Buildrs.
        </p>

        {/* Stack pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {['Claude Code', 'Supabase', 'Vercel', 'Stripe', 'Resend', 'Cloudflare', 'GitHub'].map((tool) => (
            <span key={tool} style={{
              fontSize: '14px', fontWeight: '600', padding: '8px 18px',
              border: '1.5px solid #e4e4e7', borderRadius: '999px', color: '#09090b',
            }}>{tool}</span>
          ))}
        </div>

        {/* CTA encadré */}
        <div style={{ backgroundColor: '#09090b', borderRadius: '18px', padding: '36px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#52525b', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Pour recevoir la liste complète + configs
          </p>
          <p style={{ fontSize: '34px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.04em', margin: '0 0 12px', lineHeight: '1.15' }}>
            Écris{' '}
            <span style={{ backgroundColor: '#ffffff', color: '#09090b', padding: '3px 14px', borderRadius: '8px' }}>CLAUDE</span>
            {' '}en commentaire
          </p>
          <p style={{ fontSize: '15px', color: '#52525b', margin: 0 }}>
            Je t'envoie tout en DM
          </p>
        </div>
      </div>
    </div>
  )
}
