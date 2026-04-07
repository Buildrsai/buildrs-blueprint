/**
 * InstaPreviewPage — preview de tous les posts Instagram
 * Accès : /#/insta-preview  |  slides plein écran : /#/insta-p1s1, etc.
 */

import {
  InstaPost1Slide1, InstaPost1Slide2, InstaPost1Slide3,
} from './InstaPost1'
import {
  InstaPost2Slide1, InstaPost2Slide2, InstaPost2Slide3,
  InstaPost2Slide4, InstaPost2Slide5, InstaPost2Slide6, InstaPost2Slide7,
} from './InstaPost2'
import {
  InstaPost3Slide1, InstaPost3Slide2, InstaPost3Slide3, InstaPost3Slide4,
} from './InstaPost3'

const SCALE = 0.32

const posts = [
  {
    label: 'Post 1 — Le Manifeste',
    keyword: 'BUILDR',
    slides: [
      { id: 'insta-p1s1', el: <InstaPost1Slide1 /> },
      { id: 'insta-p1s2', el: <InstaPost1Slide2 /> },
      { id: 'insta-p1s3', el: <InstaPost1Slide3 /> },
    ],
  },
  {
    label: 'Post 2 — La Méthode 6 Jours',
    keyword: '6 JOURS',
    slides: [
      { id: 'insta-p2s1', el: <InstaPost2Slide1 /> },
      { id: 'insta-p2s2', el: <InstaPost2Slide2 /> },
      { id: 'insta-p2s3', el: <InstaPost2Slide3 /> },
      { id: 'insta-p2s4', el: <InstaPost2Slide4 /> },
      { id: 'insta-p2s5', el: <InstaPost2Slide5 /> },
      { id: 'insta-p2s6', el: <InstaPost2Slide6 /> },
      { id: 'insta-p2s7', el: <InstaPost2Slide7 /> },
    ],
  },
  {
    label: 'Post 3 — Avant / Après',
    keyword: 'CLAUDE',
    slides: [
      { id: 'insta-p3s1', el: <InstaPost3Slide1 /> },
      { id: 'insta-p3s2', el: <InstaPost3Slide2 /> },
      { id: 'insta-p3s3', el: <InstaPost3Slide3 /> },
      { id: 'insta-p3s4', el: <InstaPost3Slide4 /> },
    ],
  },
]

function ScaledSlide({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: `${1080 * SCALE}px`, height: `${1080 * SCALE}px`,
      overflow: 'hidden', borderRadius: '8px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #e4e4e7',
      position: 'relative', flexShrink: 0,
    }}>
      <div style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left', width: '1080px', height: '1080px' }}>
        {children}
      </div>
    </div>
  )
}

export function InstaPreviewPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: "'Geist', system-ui, sans-serif", padding: '48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>BUILDRS · INSTAGRAM</p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.03em', margin: '0 0 8px' }}>Posts Carrousel — 3 posts · 14 slides</h1>
          <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
            Ouvrir chaque slide en plein écran via les boutons → capturer à 1080×1080.
          </p>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div key={post.label} style={{ marginBottom: '64px' }}>
            {/* Post header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#09090b', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{post.label}</h2>
                <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
                  CTA final : Écris <strong style={{ color: '#09090b' }}>{post.keyword}</strong> en commentaire
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {post.slides.map((s, i) => (
                  <a key={s.id} href={`#/${s.id}`} style={{
                    backgroundColor: '#09090b', color: '#ffffff',
                    padding: '7px 14px', borderRadius: '6px',
                    fontSize: '12px', fontWeight: '600', textDecoration: 'none',
                  }}>
                    Slide {i + 1} →
                  </a>
                ))}
              </div>
            </div>

            {/* Slides row */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {post.slides.map((s, i) => (
                <div key={s.id}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', textAlign: 'center' }}>
                    {i + 1} / {post.slides.length}
                  </p>
                  <ScaledSlide>{s.el}</ScaledSlide>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Captions */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e4e4e7', padding: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#09090b', margin: '0 0 24px', letterSpacing: '-0.02em' }}>Captions Instagram (à copier)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {
                post: 'Post 1 — Le Manifeste',
                caption: `Tu utilises l'IA pour résumer des emails.

D'autres construisent des logiciels qui génèrent 3 000€/mois avec la même IA.

La différence ? Une méthode. Un système. Claude Code comme moteur.

→ Swipe pour voir ce qu'est vraiment un Buildr.

Écris BUILDR en commentaire et je t'envoie la méthode complète en DM.

#vibecoding #claudecode #microSaaS #buildr #IA #entrepreneuriat`,
              },
              {
                post: 'Post 2 — La Méthode',
                caption: `Jour 1 → idée validée.
Jour 3 → logiciel construit.
Jour 6 → premier client payant.

Sans savoir coder. Sans équipe. Avec Claude Code.

→ Swipe pour voir chaque étape en détail.

Écris 6 JOURS en commentaire et je t'envoie le guide complet en DM.

#claudecode #microSaaS #vibecoding #buildr #solopreneur #ia`,
              },
              {
                post: 'Post 3 — Avant/Après',
                caption: `3 semaines de prompts sur ChatGPT. Rien de construit.

6 jours avec Claude Code + la méthode Buildrs. Un logiciel live et des clients payants.

Ce n'est pas la même IA. Ce n'est pas le même résultat.

→ Swipe pour voir la différence.

Écris CLAUDE en commentaire et je t'envoie la liste de notre stack complète en DM.

#claudecode #chatgpt #microSaaS #vibecoding #buildr #ia`,
              },
            ].map((c) => (
              <div key={c.post}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{c.post}</p>
                <pre style={{ fontSize: '12px', color: '#374151', lineHeight: '1.7', backgroundColor: '#f4f4f5', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', fontFamily: "'Geist Mono', monospace", margin: 0 }}>
                  {c.caption}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* Fullscreen exports */
function FullWrap({ bg, children }: { bg: string; children: React.ReactNode }) {
  return <div style={{ backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>{children}</div>
}

export const InstaFullP1S1 = () => <FullWrap bg="#09090b"><InstaPost1Slide1 /></FullWrap>
export const InstaFullP1S2 = () => <FullWrap bg="#09090b"><InstaPost1Slide2 /></FullWrap>
export const InstaFullP1S3 = () => <FullWrap bg="#09090b"><InstaPost1Slide3 /></FullWrap>

export const InstaFullP2S1 = () => <FullWrap bg="#09090b"><InstaPost2Slide1 /></FullWrap>
export const InstaFullP2S2 = () => <FullWrap bg="#ffffff"><InstaPost2Slide2 /></FullWrap>
export const InstaFullP2S3 = () => <FullWrap bg="#09090b"><InstaPost2Slide3 /></FullWrap>
export const InstaFullP2S4 = () => <FullWrap bg="#ffffff"><InstaPost2Slide4 /></FullWrap>
export const InstaFullP2S5 = () => <FullWrap bg="#09090b"><InstaPost2Slide5 /></FullWrap>
export const InstaFullP2S6 = () => <FullWrap bg="#ffffff"><InstaPost2Slide6 /></FullWrap>
export const InstaFullP2S7 = () => <FullWrap bg="#09090b"><InstaPost2Slide7 /></FullWrap>

export const InstaFullP3S1 = () => <FullWrap bg="#ffffff"><InstaPost3Slide1 /></FullWrap>
export const InstaFullP3S2 = () => <FullWrap bg="#ffffff"><InstaPost3Slide2 /></FullWrap>
export const InstaFullP3S3 = () => <FullWrap bg="#09090b"><InstaPost3Slide3 /></FullWrap>
export const InstaFullP3S4 = () => <FullWrap bg="#ffffff"><InstaPost3Slide4 /></FullWrap>
