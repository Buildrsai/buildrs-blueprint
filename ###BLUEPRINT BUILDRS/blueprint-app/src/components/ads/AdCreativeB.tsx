import { BLUEPRINT_PRICE } from '../../lib/pricing'

/**
 * AdCreativeB — "ChatGPT vs Claude Buildrs"
 * Format : 1080×1080px (carré Meta)
 * Angle : ChatGPT (vague, perdu) vs Claude avec méthode Buildrs (structuré, qui construit)
 */

const BuildrsHashIcon = ({ color = '#09090b', size = 22 }: { color?: string; size?: number }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="16" y1="6" x2="16" y2="42" /><line x1="32" y1="6" x2="32" y2="42" />
    <line x1="6" y1="16" x2="42" y2="16" /><line x1="6" y1="32" x2="42" y2="32" />
    <rect x="16" y="16" width="16" height="16" />
  </svg>
)

/** Panel gauche — ChatGPT, vague, sans structure */
const ChatGPTPanel = () => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column',
    backgroundColor: '#fafafa', borderRadius: '12px',
    border: '1px solid #e5e7eb', overflow: 'hidden',
    filter: 'grayscale(30%)',
  }}>
    {/* Header */}
    <div style={{
      padding: '11px 14px', borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff',
    }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#10a37f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
        </svg>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>ChatGPT — GPT-4o</span>
      <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#9ca3af', border: '1px solid #e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>Aucun plan</span>
    </div>

    {/* Messages */}
    <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ backgroundColor: '#374151', color: '#ffffff', borderRadius: '10px 10px 2px 10px', padding: '8px 11px', fontSize: '10.5px', maxWidth: '90%', lineHeight: '1.4' }}>
          Comment je crée un SaaS qui génère des revenus récurrents ?
        </div>
      </div>
      <div style={{ display: 'flex', gap: '7px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10a37f', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '10.5px', color: '#374151', lineHeight: '1.6' }}>
          Pour créer un SaaS rentable, vous devez d'abord identifier votre marché cible et valider votre idée. Ensuite, il faut développer un MVP en vous concentrant sur les fonctionnalités essentielles. Vous pouvez utiliser React, Vue.js ou Angular pour le front-end. Pour la base de données, PostgreSQL ou MongoDB sont de bonnes options selon vos besoins spécifiques...
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ backgroundColor: '#374151', color: '#ffffff', borderRadius: '10px 10px 2px 10px', padding: '8px 11px', fontSize: '10.5px', maxWidth: '90%', lineHeight: '1.4' }}>
          Par quoi je commence concrètement ?
        </div>
      </div>
      <div style={{ display: 'flex', gap: '7px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10a37f', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '10.5px', color: '#374151', lineHeight: '1.6' }}>
          La première étape serait de définir clairement votre proposition de valeur unique. Identifiez un problème que votre SaaS va résoudre...
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ backgroundColor: '#374151', color: '#ffffff', borderRadius: '10px 10px 2px 10px', padding: '8px 11px', fontSize: '10.5px', maxWidth: '90%', lineHeight: '1.4' }}>
          Et le code, comment je fais ?
        </div>
      </div>
      <div style={{ display: 'flex', gap: '7px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10a37f', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '10.5px', color: '#9ca3af', lineHeight: '1.6' }}>
          Je vous recommande d'apprendre les bases de la programmation. Des ressources comme freeCodeCamp ou The Odin Project peuvent vous aider à commencer...
        </div>
      </div>
    </div>

    {/* Input */}
    <div style={{ padding: '10px 14px', borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
      <div style={{ border: '1px solid #d1d5db', borderRadius: '7px', padding: '7px 10px', fontSize: '10.5px', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
        <span>Envoyer un message...</span>
      </div>
    </div>

    {/* Résultat */}
    <div style={{ padding: '8px 14px', backgroundColor: '#fef2f2', borderTop: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '12px' }}>✗</span>
      <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '600' }}>3 semaines de prompts. Rien de construit.</span>
    </div>
  </div>
)

/** Panel droite — Claude avec méthode Buildrs, structuré, qui produit */
const ClaudeBuildrsPanel = () => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column',
    backgroundColor: '#09090b', borderRadius: '12px',
    border: '1.5px solid #22c55e', overflow: 'hidden',
  }}>
    {/* Header */}
    <div style={{
      padding: '11px 14px', borderBottom: '1px solid #1f1f23',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#fafafa' }}>Claude — Méthode Buildrs</span>
      <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: '700', color: '#22c55e', border: '1px solid #22c55e', padding: '2px 6px', borderRadius: '4px' }}>PLAN ACTIF</span>
    </div>

    {/* Messages */}
    <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '9px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ backgroundColor: '#27272a', color: '#fafafa', borderRadius: '10px 10px 2px 10px', padding: '8px 11px', fontSize: '10.5px', maxWidth: '90%', lineHeight: '1.4' }}>
          Je veux créer un SaaS de facturation auto pour freelances.
        </div>
      </div>

      {/* Claude réponse structurée */}
      <div style={{ display: 'flex', gap: '7px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '10.5px', color: '#d4d4d8', lineHeight: '1.6', flex: 1 }}>
          Parfait. Voici ton plan d'exécution 72h :
        </div>
      </div>

      {/* Etapes construites */}
      {[
        { step: '01', label: 'Validation idée', detail: 'Score 89/100 · Marché 2.4M€ · Vert', done: true },
        { step: '02', label: 'Architecture Supabase', detail: 'Schema DB généré · 3 tables · Auth', done: true },
        { step: '03', label: 'Build dashboard', detail: '847 lignes · Deploy Vercel · app.fr', done: true },
        { step: '04', label: 'Stripe branché', detail: '49€/mois · Webhook configuré', done: true },
        { step: '05', label: 'Emails Resend', detail: 'Welcome + relance · DKIM actif', done: false },
      ].map(item => (
        <div key={item.step} style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '7px 10px', borderRadius: '7px',
          backgroundColor: item.done ? 'rgba(34,197,94,0.08)' : '#18181b',
          border: `1px solid ${item.done ? 'rgba(34,197,94,0.2)' : '#27272a'}`,
        }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
            backgroundColor: item.done ? '#22c55e' : '#3f3f46',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '800', color: item.done ? '#09090b' : '#71717a',
            fontFamily: "'Geist Mono', monospace",
          }}>
            {item.done ? '✓' : item.step}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10.5px', fontWeight: '600', color: item.done ? '#fafafa' : '#71717a' }}>{item.label}</div>
            <div style={{ fontSize: '9px', color: item.done ? '#71717a' : '#52525b' }}>{item.detail}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Résultat */}
    <div style={{ padding: '8px 14px', backgroundColor: 'rgba(34,197,94,0.1)', borderTop: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '10px', fontWeight: '700', color: '#22c55e' }}>✓ SaaS live en 68h · Premiers paiements reçus</span>
    </div>
  </div>
)

export function AdCreativeB() {
  const PAD = 52

  return (
    <div style={{
      width: '1080px', height: '1080px', backgroundColor: '#ffffff',
      fontFamily: "'Geist', system-ui, sans-serif",
      padding: `${PAD}px`, display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
        <BuildrsHashIcon color="#09090b" size={22} />
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }}>Buildrs</span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: '56px', fontWeight: '800', lineHeight: '1.04',
        letterSpacing: '-0.04em', color: '#09090b', margin: '0 0 14px',
      }}>
        Arrête de demander à ChatGPT.{' '}
        <span style={{ backgroundColor: '#09090b', color: '#ffffff', padding: '2px 12px', borderRadius: '8px' }}>
          Commence à construire avec Claude.
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize: '18px', color: '#71717a', margin: '0 0 20px', lineHeight: '1.5' }}>
        La méthode Buildrs transforme Claude en chef de projet qui construit ton SaaS étape par étape.
      </p>

      {/* Labels AVANT / APRÈS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '9px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid #e4e4e7', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>SANS BUILDRS</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '9px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid #22c55e', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>AVEC BUILDRS</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
        </div>
      </div>

      {/* Two panels */}
      <div style={{ flex: 1, display: 'flex', gap: '14px', minHeight: 0, marginBottom: '18px' }}>
        <ChatGPTPanel />
        <ClaudeBuildrsPanel />
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        {["Sans savoir coder", "Moins de 50€ d'outils", "En solo, sans équipe"].map(b => (
          <span key={b} style={{
            fontSize: '13px', fontWeight: '500', padding: '7px 16px',
            borderRadius: '999px', border: '1.5px solid #e4e4e7', color: '#09090b', whiteSpace: 'nowrap',
          }}>· {b}</span>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '18px', borderTop: '1.5px solid #e4e4e7',
      }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>BUILDRS BLUEPRINT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '34px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.04em', lineHeight: '1' }}>{BLUEPRINT_PRICE}€</span>
            <span style={{ fontSize: '14px', color: '#71717a' }}>Paiement unique · Accès à vie</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px' }}>
          <button style={{
            backgroundColor: '#09090b', color: '#ffffff', padding: '15px 30px',
            borderRadius: '12px', fontSize: '15px', fontWeight: '600', border: 'none',
            cursor: 'pointer', fontFamily: "'Geist', system-ui, sans-serif",
          }}>Je prends ma place →</button>
          <span style={{ fontSize: '11px', color: '#a1a1aa' }}>{BLUEPRINT_PRICE}€ · Offre de lancement · buildrs.fr</span>
        </div>
      </div>
    </div>
  )
}
