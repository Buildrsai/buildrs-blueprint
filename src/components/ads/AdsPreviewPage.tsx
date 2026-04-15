/**
 * AdsPreviewPage — preview des 2 créas à 50% pour navigation,
 * avec liens pour voir chaque créa en plein 1080×1080 (zoom manuel).
 */
import { AdCreativeA } from './AdCreativeA'
import { AdCreativeB } from './AdCreativeB'
import { AdCreativeC } from './AdCreativeC'
import { AdCreativeD } from './AdCreativeD'
import { AdCreativeE } from './AdCreativeE'

const SCALE = 0.44

function ScaledAd({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <p style={{
        fontSize: '12px', fontWeight: '600', color: '#71717a',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: '10px', fontFamily: "'Geist', system-ui, sans-serif",
      }}>
        {label}
      </p>
      <div style={{
        width: `${1080 * SCALE}px`,
        height: `${1080 * SCALE}px`,
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        border: '1px solid #e4e4e7',
        position: 'relative',
      }}>
        <div style={{
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          width: '1080px',
          height: '1080px',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function AdsPreviewPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f4f5',
      fontFamily: "'Geist', system-ui, sans-serif",
      padding: '48px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            BUILDRS · ADS PREVIEW
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Nouvelles créas — Semaine 2
          </h1>
          <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
            Pour screenshoter à 1080×1080 : ouvrir chaque créa en plein écran via les boutons ci-dessous, puis capturer.
          </p>
        </div>

        {/* Boutons plein écran */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          {[
            { label: 'Créa A — Résultat Chiffré', hash: 'ads-full-a' },
            { label: 'Créa B — Before/After', hash: 'ads-full-b' },
            { label: 'Créa C — Fond Noir Dashboard', hash: 'ads-full-c' },
            { label: 'Créa D — Terminal Blanc', hash: 'ads-full-d' },
            { label: 'Créa E — 6 Jours Roadmap Noir', hash: 'ads-full-e' },
          ].map(item => (
            <a
              key={item.hash}
              href={`#/${item.hash}`}
              style={{
                display: 'inline-block',
                backgroundColor: '#09090b',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              {item.label} — Plein écran →
            </a>
          ))}
        </div>

        {/* Previews côte à côte */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <ScaledAd label="Créa A — Résultat Chiffré (S5)">
            <AdCreativeA />
          </ScaledAd>
          <ScaledAd label="Créa B — Before/After (S6)">
            <AdCreativeB />
          </ScaledAd>
          <ScaledAd label="Créa C — Fond Noir Dashboard">
            <AdCreativeC />
          </ScaledAd>
          <ScaledAd label="Créa D — Terminal Blanc">
            <AdCreativeD />
          </ScaledAd>
          <ScaledAd label="Créa E — 6 Jours Roadmap Noir">
            <AdCreativeE />
          </ScaledAd>
        </div>

        {/* Légende */}
        <div style={{ marginTop: '48px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#09090b', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Copy ads (à copier dans Meta Ads Manager)
          </h2>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>CRÉA A</p>
              <pre style={{
                fontSize: '12px', color: '#374151', lineHeight: '1.7',
                backgroundColor: '#f4f4f5', padding: '16px', borderRadius: '8px',
                whiteSpace: 'pre-wrap', fontFamily: "'Geist Mono', monospace", margin: 0,
              }}>{`Il a lancé son premier SaaS en 5 jours.
Sans écrire une ligne de code.

Le Buildrs Blueprint : 6 modules pour passer de
l'idée au MVP monétisé avec Claude comme moteur.

→ Architecture complète générée par l'IA
→ Prompts exacts à chaque étape
→ Stack pro configuré (Supabase, Stripe, Vercel)

27€. Offre de lancement. Paiement unique.`}</pre>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>CRÉA B</p>
              <pre style={{
                fontSize: '12px', color: '#374151', lineHeight: '1.7',
                backgroundColor: '#f4f4f5', padding: '16px', borderRadius: '8px',
                whiteSpace: 'pre-wrap', fontFamily: "'Geist Mono', monospace", margin: 0,
              }}>{`À gauche : toi qui galères seul avec ChatGPT.
À droite : toi avec un système complet.

Le Buildrs Blueprint transforme Claude en
associé technique qui construit avec toi.

→ 6 modules de l'idée au lancement
→ Prompts, stack, checklist — tout est prêt
→ Zéro code requis

27€. Paiement unique. Accès à vie.`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Page plein écran pour screenshotter à 1080×1080 */
export function AdFullscreenA() {
  return (
    <div style={{ backgroundColor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AdCreativeA />
    </div>
  )
}

export function AdFullscreenB() {
  return (
    <div style={{ backgroundColor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AdCreativeB />
    </div>
  )
}

export function AdFullscreenC() {
  return (
    <div style={{ backgroundColor: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AdCreativeC />
    </div>
  )
}

export function AdFullscreenD() {
  return (
    <div style={{ backgroundColor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AdCreativeD />
    </div>
  )
}

export function AdFullscreenE() {
  return (
    <div style={{ backgroundColor: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AdCreativeE />
    </div>
  )
}
