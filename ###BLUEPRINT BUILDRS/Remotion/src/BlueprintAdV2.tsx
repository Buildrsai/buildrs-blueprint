import React from 'react';
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
  interpolate,
  spring,
} from 'remotion';
import {
  loadFont as loadGeist,
  fontFamily as geistFamily,
} from '@remotion/google-fonts/Geist';
import {
  loadFont as loadSerif,
  fontFamily as serifFamily,
} from '@remotion/google-fonts/InstrumentSerif';
import { BG, WHITE, GREEN, ORANGE, RED, Dots, Glow, Badge, fi, fo, su, pop, tw, Cursor } from './shared';

const { waitUntilDone: waitGeist } = loadGeist('normal', { weights: ['400','600','700','800'], subsets: ['latin'] });
const { waitUntilDone: waitSerif } = loadSerif('italic', { weights: ['400'], subsets: ['latin'] });

const SANS  = `'${geistFamily}', system-ui, sans-serif`;
const SERIF = `'${serifFamily}', Georgia, serif`;

// ─── Buildrs Hash Icon ──────────────────────────────────────────────────────
const BuildrsHashIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="1" y="1" width="26" height="26" rx="6" stroke={WHITE} strokeWidth="1.8" />
    <line x1="9" y1="5" x2="9" y2="23" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="19" y1="5" x2="19" y2="23" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="5" y1="10" x2="23" y2="10" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="5" y1="18" x2="23" y2="18" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// SCÈNE 1 — HOOK  (0–150 / 5s)
// "Tu rêves de lancer un business avec l'IA mais tu sais pas par où démarrer ?"
// ════════════════════════════════════════════════════════════════════════════
const HOOK_LINE1 = "Tu rêves de lancer un business avec l'IA";
const HOOK_LINE2 = "mais tu sais pas par où démarrer ?";

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowPulse = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1], [0.04, 0.12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const line1Opacity = fi(frame, 10, 14);
  const line1Y       = su(frame, 10, 14, 50);
  const line2Opacity = fi(frame, 30, 14);
  const line2Y       = su(frame, 30, 14, 50);

  const line1Words = tw(frame, HOOK_LINE1, 10, 60);
  const line2Words = tw(frame, HOOK_LINE2, 35, 90);

  // Fade out last 20 frames
  const fadeOut = fo(frame, 130, 20);

  return (
    <AbsoluteFill style={{ background: BG, opacity: frame > 130 ? fadeOut : 1 }}>
      <Dots opacity={0.6} />
      <Glow color={`rgba(250,250,250,${glowPulse})`} size={1000} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 24,
        textAlign: 'center',
      }}>
        <div style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          fontFamily: SANS, fontSize: 80, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE,
          lineHeight: 1.05,
        }}>
          {line1Words}
          {line1Words.length < HOOK_LINE1.length && <Cursor frame={frame} />}
        </div>
        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          fontFamily: SANS, fontSize: 80, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE,
          lineHeight: 1.05,
        }}>
          {line2Words}
          {line2Words.length < HOOK_LINE2.length && <Cursor frame={frame} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCÈNE 2 — RAFALE  (150–510 / 12s)
// 8 bullets × 45 frames chacun — plein écran, spring pop-in
// ════════════════════════════════════════════════════════════════════════════
const BULLETS: Array<{ text: string; color: string }> = [
  { text: "SaaS · app · logiciel",                  color: WHITE  },
  { text: "Sans écrire une ligne de code",            color: WHITE  },
  { text: "Moins de 100€ de budget",                 color: WHITE  },
  { text: "Rentable dès le premier mois",             color: WHITE  },
  { text: "Revenus récurrents — chaque mois",         color: GREEN  },
  { text: "Devenir un chef d'orchestre IA",           color: WHITE  },
  { text: "Bosser d'où tu veux, quand tu veux",      color: WHITE  },
  { text: "Tes IA travaillent pendant que tu dors",  color: GREEN  },
];

const BULLET_DURATION = 45;

const SceneRafale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentIndex = Math.min(
    Math.floor(frame / BULLET_DURATION),
    BULLETS.length - 1
  );
  const localFrame = frame - currentIndex * BULLET_DURATION;
  const bullet = BULLETS[currentIndex];
  const isLast = currentIndex === BULLETS.length - 1;

  const scaleVal  = pop(localFrame, fps, 0, 180);
  const opacityVal = fi(localFrame, 0, 8);
  const fadeOut   = !isLast && localFrame > BULLET_DURATION - 10
    ? fo(localFrame, BULLET_DURATION - 10, 8)
    : 1;

  const glowOpacity = interpolate(
    Math.sin((frame / 20) * Math.PI),
    [-1, 1], [0.06, 0.18],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow
        color={`rgba(34,197,94,${glowOpacity})`}
        size={800}
        opacity={currentIndex >= 4 ? 1 : 0.4}
      />
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 72px',
      }}>
        {/* Flèche verte */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: 72,
          fontFamily: SANS, fontSize: 72, color: GREEN,
          opacity: opacityVal * fadeOut,
          transform: `scale(${scaleVal})`,
          fontWeight: 800,
        }}>→</div>

        {/* Texte bullet */}
        <div style={{
          opacity: opacityVal * fadeOut,
          transform: `scale(${scaleVal})`,
          fontFamily: SANS,
          fontSize: isLast ? 88 : 76,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: bullet.color,
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 900,
        }}>
          {bullet.text}
        </div>

        {/* Numéro discret */}
        <div style={{
          position: 'absolute', bottom: 80, right: 72,
          fontFamily: SANS, fontSize: 24, color: 'rgba(250,250,250,0.18)',
          fontWeight: 600,
        }}>
          {currentIndex + 1}/8
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCÈNE 3 — PIVOT  (510–690 / 6s)
// "Comment j'ai lancé mon app en 6 jours — sans savoir coder."
// Logo Buildrs + badges Claude + Blueprint
// ════════════════════════════════════════════════════════════════════════════
const ScenePivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const LINE1 = "Comment j'ai lancé mon app en 6 jours —";
  const LINE2 = "sans savoir coder.";

  const logoScale   = pop(frame, fps, 0, 200);
  const logoOpacity = fi(frame, 0, 12);
  const l1Opacity   = fi(frame, 18, 14);
  const l1Y         = su(frame, 18, 14, 40);
  const l2Opacity   = fi(frame, 36, 14);
  const l2Y         = su(frame, 36, 14, 40);
  const badge1Opacity = fi(frame, 70, 12);
  const badge1Y       = su(frame, 70, 12, 30);
  const badge2Opacity = fi(frame, 84, 12);
  const badge2Y       = su(frame, 84, 12, 30);

  // Fade out last 20 frames
  const fadeOut = frame > 160 ? fo(frame, 160, 20) : 1;

  return (
    <AbsoluteFill style={{ background: BG, opacity: frame > 160 ? fadeOut : 1 }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.12)" size={900} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 32, textAlign: 'center',
      }}>
        {/* Logo Buildrs */}
        <div style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 16,
        }}>
          <BuildrsHashIcon size={48} />
          <span style={{
            fontFamily: SANS, fontSize: 44, fontWeight: 800,
            letterSpacing: '-0.04em', color: WHITE,
          }}>Buildrs</span>
        </div>

        {/* Ligne 1 */}
        <div style={{
          opacity: l1Opacity, transform: `translateY(${l1Y}px)`,
          fontFamily: SANS, fontSize: 68, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE, lineHeight: 1.05,
        }}>
          {LINE1}
        </div>

        {/* Ligne 2 — en vert */}
        <div style={{
          opacity: l2Opacity, transform: `translateY(${l2Y}px)`,
          fontFamily: SANS, fontSize: 68, fontWeight: 800,
          letterSpacing: '-0.04em', color: GREEN, lineHeight: 1.05,
        }}>
          {LINE2}
        </div>

        {/* Badges */}
        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center',
          marginTop: 16,
        }}>
          <div style={{ opacity: badge1Opacity, transform: `translateY(${badge1Y}px)` }}>
            <Badge
              text="⚡ Claude comme moteur"
              color={ORANGE}
              borderColor="rgba(250,134,54,0.30)"
              bgColor="rgba(250,134,54,0.08)"
            />
          </div>
          <div style={{ opacity: badge2Opacity, transform: `translateY(${badge2Y}px)` }}>
            <Badge text="Buildrs Blueprint" />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCÈNE 4 — TIMELINE  (690–1140 / 15s)
// J1→J6 · chaque ligne s'allume + checkmark vert · 75 frames/jour
// ════════════════════════════════════════════════════════════════════════════
const DAYS = [
  { label: 'J1', text: 'Idée validée · brief produit',                   isOrange: false },
  { label: 'J2', text: 'Design + stack (Supabase · Vercel · Stripe)',     isOrange: false },
  { label: 'J3', text: 'Build avec Claude — feature principale',          isOrange: true  },
  { label: 'J4', text: 'Auth + paiement Stripe',                          isOrange: false },
  { label: 'J5', text: 'Deploy live · domaine · emails',                  isOrange: false },
  { label: 'J6', text: 'Lancement · premiers €',                          isOrange: false },
];

const DAY_DURATION = 75;

const SceneTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeDay   = Math.min(Math.floor(frame / DAY_DURATION), DAYS.length - 1);
  const dayProgress = (frame - activeDay * DAY_DURATION) / DAY_DURATION;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <Glow color="rgba(34,197,94,0.08)" size={1100} top="60%" />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 80px',
        gap: 0,
      }}>
        {/* Titre */}
        <div style={{
          opacity: fi(frame, 0, 14),
          fontFamily: SANS, fontSize: 36, fontWeight: 600,
          color: 'rgba(250,250,250,0.4)',
          letterSpacing: '-0.02em',
          marginBottom: 48,
        }}>
          Le plan en 6 jours
        </div>

        {DAYS.map((day, i) => {
          const isActive  = i === activeDay;
          const isPast    = i < activeDay;
          const lineFrame = frame - i * DAY_DURATION;

          const rowOpacity  = isPast ? 1 : isActive ? fi(lineFrame, 0, 12) : 0.18;
          const rowY        = isActive ? su(lineFrame, 0, 12, 20) : 0;
          const showCheck   = isPast || (isActive && dayProgress > 0.7);
          const checkScale  = showCheck
            ? pop(Math.max(lineFrame - Math.floor(DAY_DURATION * 0.7), 0), fps, 0, 300)
            : 0;

          const textColor = isPast
            ? 'rgba(250,250,250,0.45)'
            : isActive
              ? (day.isOrange ? ORANGE : i === 5 ? GREEN : WHITE)
              : 'rgba(250,250,250,0.18)';

          const labelBg    = isPast || isActive ? 'rgba(34,197,94,0.20)' : 'rgba(250,250,250,0.04)';
          const labelColor = isPast || isActive ? GREEN : 'rgba(250,250,250,0.3)';
          const labelBorder = isPast || isActive ? 'rgba(34,197,94,0.25)' : 'rgba(250,250,250,0.08)';

          return (
            <div key={day.label} style={{
              display: 'flex', alignItems: 'center', gap: 24,
              opacity: rowOpacity,
              transform: `translateY(${rowY}px)`,
              padding: '20px 0',
              borderBottom: i < DAYS.length - 1 ? '1px solid rgba(250,250,250,0.06)' : 'none',
            }}>
              <div style={{
                background: labelBg,
                border: `1px solid ${labelBorder}`,
                borderRadius: 8, padding: '8px 16px',
                fontFamily: SANS, fontSize: 26, fontWeight: 800,
                color: labelColor, width: 72, textAlign: 'center', flexShrink: 0,
              }}>
                {day.label}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 38, fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.02em', color: textColor, flex: 1,
              }}>
                {day.text}
              </div>
              <div style={{
                opacity: showCheck ? 1 : 0,
                transform: `scale(${checkScale})`,
                color: GREEN, fontSize: 42, flexShrink: 0,
              }}>
                ✓
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCÈNE 5 — RÉSULTAT  (1140–1290 / 5s)
// Compteur MRR · "0 patron · 0 dev · 0 bureau." · stats · stack logos
// ════════════════════════════════════════════════════════════════════════════
const STACK_LOGOS = ['Claude', 'Lovable', 'Supabase', 'Stripe', 'Vercel', 'GitHub'];

const SceneResultat: React.FC = () => {
  const frame = useCurrentFrame();

  const mrrValue = Math.floor(
    interpolate(frame, [10, 90], [0, 890], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  const liberteOpacity = fi(frame, 80, 14);
  const liberteY       = su(frame, 80, 14, 30);
  const statsOpacity   = fi(frame, 100, 12);
  const statsY         = su(frame, 100, 12, 30);
  const logosOpacity   = fi(frame, 120, 12);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <Glow color="rgba(34,197,94,0.15)" size={1000} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 36, textAlign: 'center',
      }}>
        {/* MRR Counter */}
        <div style={{ opacity: fi(frame, 0, 12) }}>
          <div style={{
            fontFamily: SANS, fontSize: 28, fontWeight: 600,
            color: 'rgba(250,250,250,0.4)', letterSpacing: '-0.01em',
            marginBottom: 8,
          }}>
            MRR mensuel
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 120, fontWeight: 800,
            letterSpacing: '-0.06em', color: GREEN, lineHeight: 1,
          }}>
            +{mrrValue}€
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 28, fontWeight: 500,
            color: 'rgba(250,250,250,0.35)', marginTop: 8,
          }}>
            /mois
          </div>
        </div>

        {/* Liberté */}
        <div style={{
          opacity: liberteOpacity, transform: `translateY(${liberteY}px)`,
          fontFamily: SANS, fontSize: 52, fontWeight: 800,
          letterSpacing: '-0.03em', color: WHITE,
        }}>
          0 patron · 0 dev · 0 bureau.
        </div>

        {/* Stats */}
        <div style={{
          opacity: statsOpacity, transform: `translateY(${statsY}px)`,
          display: 'flex', gap: 36, alignItems: 'center', justifyContent: 'center',
        }}>
          {[
            { value: '27€', label: 'Prix unique', color: WHITE },
            { value: '6j',  label: "De l'idée au live", color: GREEN },
            { value: '0',   label: 'Ligne de code', color: WHITE },
          ].map(stat => (
            <div key={stat.value} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: SANS, fontSize: 64, fontWeight: 800,
                letterSpacing: '-0.04em', color: stat.color,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 24, fontWeight: 500,
                color: 'rgba(250,250,250,0.4)',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stack logos */}
        <div style={{ opacity: logosOpacity }}>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {STACK_LOGOS.map(logo => (
              <div key={logo} style={{
                background: 'rgba(250,250,250,0.04)',
                border: '1px solid rgba(250,250,250,0.10)',
                borderRadius: 10, padding: '10px 20px',
                fontFamily: SANS, fontSize: 24, fontWeight: 600,
                color: 'rgba(250,250,250,0.6)',
              }}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCÈNE 6 — CTA  (1290–1350 / 2s)
// buildrs.fr · bouton rainbow · prix 27€
// ════════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = fi(frame, 0, 10);
  const logoScale   = pop(frame, fps, 0, 250);
  const textOpacity = fi(frame, 12, 10);
  const textY       = su(frame, 12, 10, 30);
  const btnScale    = pop(frame, fps, 20, 220);
  const btnOpacity  = fi(frame, 20, 10);
  const hue         = interpolate(frame, [0, 60], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.18)" size={800} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 72px', gap: 36, textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          opacity: logoOpacity, transform: `scale(${logoScale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <BuildrsHashIcon size={44} />
          <span style={{
            fontFamily: SANS, fontSize: 40, fontWeight: 800,
            letterSpacing: '-0.04em', color: WHITE,
          }}>Buildrs</span>
        </div>

        {/* URL */}
        <div style={{
          opacity: textOpacity, transform: `translateY(${textY}px)`,
          fontFamily: SANS, fontSize: 88, fontWeight: 800,
          letterSpacing: '-0.05em', color: WHITE,
        }}>
          buildrs.fr
        </div>

        {/* Prix */}
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          <span style={{ fontFamily: SANS, fontSize: 36, fontWeight: 600, color: GREEN }}>
            Accès complet — 27€ seulement
          </span>
        </div>

        {/* Bouton Rainbow CTA */}
        <div style={{ opacity: btnOpacity, transform: `scale(${btnScale})`, position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: -3, borderRadius: 20,
            background: `conic-gradient(from ${hue}deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)`,
            filter: 'blur(14px)', opacity: 0.6,
          }} />
          <div style={{
            position: 'relative',
            background: WHITE, color: BG,
            borderRadius: 18, padding: '28px 72px',
            fontFamily: SANS, fontSize: 44, fontWeight: 800,
            letterSpacing: '-0.03em',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            Commencer maintenant →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// COMPOSITION PRINCIPALE
// ════════════════════════════════════════════════════════════════════════════
export const BlueprintAdV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Music — décommenter quand public/music.mp3 est présent */}
      {/* <Audio src={staticFile('music.mp3')} volume={0.18} /> */}

      <Sequence from={0}    durationInFrames={150}><SceneHook /></Sequence>
      <Sequence from={150}  durationInFrames={360}><SceneRafale /></Sequence>
      <Sequence from={510}  durationInFrames={180}><ScenePivot /></Sequence>
      <Sequence from={690}  durationInFrames={450}><SceneTimeline /></Sequence>
      <Sequence from={1140} durationInFrames={150}><SceneResultat /></Sequence>
      <Sequence from={1290} durationInFrames={60}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};
