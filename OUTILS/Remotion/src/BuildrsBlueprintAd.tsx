import React, { useState, useEffect } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  delayRender,
  continueRender,
} from 'remotion';
import { loadFont as loadGeist, fontFamily as geistFamily } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono, fontFamily as geistMonoFamily } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadSerif, fontFamily as serifFamily } from '@remotion/google-fonts/InstrumentSerif';

// ─── Font Loading (module scope) ──────────────────────────────────────────────
const { waitUntilDone: waitGeist } = loadGeist('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});
const { waitUntilDone: waitMono } = loadGeistMono('normal', {
  weights: ['600', '700', '800'],
  subsets: ['latin'],
});
const { waitUntilDone: waitSerif } = loadSerif('normal', {
  weights: ['400'],
  subsets: ['latin'],
});

// ─── Design Tokens ────────────────────────────────────────────────────────────
const BG = '#09090b';
const WHITE = '#fafafa';
const GREEN = '#22c55e';
const GRAY = 'rgba(250,250,250,0.55)';
const GRAY_DIM = 'rgba(250,250,250,0.28)';
const BORDER = 'rgba(250,250,250,0.08)';

const FONT_SANS = `'${geistFamily}', system-ui, sans-serif`;
const FONT_MONO = `'${geistMonoFamily}', 'Courier New', monospace`;
const FONT_SERIF = `'${serifFamily}', Georgia, serif`;

// ─── Dots Pattern Background ──────────────────────────────────────────────────
// Obligatoire sur toutes les pages buildrs
const DotsBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      opacity,
    }}
  />
);

// ─── Radial Glow ──────────────────────────────────────────────────────────────
const RadialGlow: React.FC<{
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  opacity?: number;
}> = ({ color = 'rgba(34,197,94,0.12)', size = 900, top = '50%', left = '50%', opacity = 1 }) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  </AbsoluteFill>
);

// ─── Animation Helpers ────────────────────────────────────────────────────────
const fadeIn = (frame: number, from = 0, dur = 18) =>
  interpolate(frame - from, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const slideUp = (frame: number, from = 0, dur = 18, dist = 60) =>
  interpolate(frame - from, [0, dur], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const pop = (frame: number, fps: number, from = 0, stiffness = 110) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness } });

const typewriter = (frame: number, text: string, start: number, end: number) => {
  const n = Math.floor(
    interpolate(frame, [start, end], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
  return text.slice(0, n);
};

// ─── Cursor clignotant ────────────────────────────────────────────────────────
const Cursor: React.FC<{ frame: number; char?: string; color?: string }> = ({
  frame,
  char = '|',
  color = WHITE,
}) => <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color }}>{char}</span>;

// ─── SVG Checkmark ────────────────────────────────────────────────────────────
const CheckIcon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" stroke={GREEN} strokeWidth="2" />
    <path
      d="M13 22L19.5 28.5L31 17"
      stroke={GREEN}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Tag badge (style buildrs) ────────────────────────────────────────────────
const Tag: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <div
    style={{
      opacity,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(250,250,250,0.05)',
      border: `1px solid ${BORDER}`,
      borderRadius: 100,
      padding: '10px 22px',
    }}
  >
    <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN }} />
    <span
      style={{
        fontFamily: FONT_SANS,
        fontSize: 28,
        fontWeight: 500,
        color: GRAY,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — Hook Typewriter  (frames 0–90 / 3s)
// ════════════════════════════════════════════════════════════════════════════
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();

  const LINE1 = "T'as des idées.";
  const LINE2 = "C'est tout ce qu'il te faut.";

  const text1 = typewriter(frame, LINE1, 0, 40);
  const text2 = typewriter(frame, LINE2, 56, 86);
  const op1 = fadeIn(frame, 0, 6);
  const op2 = fadeIn(frame, 54, 6);

  // Glow pulsé
  const glow = interpolate(Math.sin((frame / 30) * Math.PI), [-1, 1], [0.6, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <DotsBackground opacity={0.7} />
      <RadialGlow color={`rgba(34,197,94,${0.08 * glow})`} size={1100} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 90px',
          gap: 40,
        }}
      >
        {/* Ligne 1 — Instrument Serif, massif */}
        <div
          style={{
            opacity: op1,
            fontFamily: FONT_SERIF,
            fontSize: 108,
            fontWeight: 400,
            fontStyle: 'italic',
            color: WHITE,
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          {text1}
          {text1.length < LINE1.length && <Cursor frame={frame} />}
        </div>

        {/* Ligne 2 — Geist bold */}
        {frame >= 52 && (
          <div
            style={{
              opacity: op2,
              fontFamily: FONT_SANS,
              fontSize: 58,
              fontWeight: 700,
              color: GRAY,
              textAlign: 'center',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            {text2}
            {text2.length < LINE2.length && <Cursor frame={frame} color={GRAY} />}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — Réalité d'avant  (frames 0–150 dans séquence)
// ════════════════════════════════════════════════════════════════════════════
const StrikeLine: React.FC<{
  text: string;
  enterFrame: number;
  strikeFrame: number;
  exitFrame: number;
}> = ({ text, enterFrame, strikeFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const enterOp = fadeIn(frame, enterFrame, 14);
  const enterY = slideUp(frame, enterFrame, 14, 80);
  const strikeP = interpolate(frame, [strikeFrame, strikeFrame + 24], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exitOp = interpolate(frame, [exitFrame, exitFrame + 14], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: enterOp * exitOp,
        transform: `translateY(${enterY}px)`,
        position: 'relative',
        display: 'inline-block',
        padding: '0 4px',
      }}
    >
      <span
        style={{
          fontFamily: FONT_SANS,
          fontSize: 54,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: frame >= strikeFrame ? GRAY_DIM : WHITE,
        }}
      >
        {text}
      </span>
      {/* Barre animée */}
      {frame >= strikeFrame && (
        <div style={{ position: 'absolute', top: '54%', left: 0, right: 0, height: 2, overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'rgba(250,250,250,0.45)',
              transformOrigin: 'left center',
              transform: `scaleX(${strikeP})`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const SceneReality: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <DotsBackground opacity={0.5} />
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        gap: 60,
      }}
    >
      <StrikeLine text="Pas de budget pour un développeur" enterFrame={4}  strikeFrame={46}  exitFrame={106} />
      <StrikeLine text="Pas d'expérience technique"        enterFrame={20} strikeFrame={60}  exitFrame={118} />
      <StrikeLine text="Pas le temps de tout apprendre"    enterFrame={36} strikeFrame={74}  exitFrame={130} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — Le Tournant  (0–180)
// ════════════════════════════════════════════════════════════════════════════
const SceneTurnover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagOp = fadeIn(frame, 0, 14);
  const mainScale = pop(frame, fps, 10, 100);
  const mainOp = fadeIn(frame, 10, 14);
  const sub1Op = fadeIn(frame, 40, 14);
  const sub1Y  = slideUp(frame, 40, 14);
  const sub2Op = fadeIn(frame, 75, 14);
  const sub2Y  = slideUp(frame, 75, 14);
  const sub3Op = fadeIn(frame, 115, 14);
  const sub3Y  = slideUp(frame, 115, 14);

  const glowPulse = interpolate(Math.sin((frame / 25) * Math.PI), [-1, 1], [0.7, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <DotsBackground opacity={0.6} />
      <RadialGlow color={`rgba(34,197,94,${0.1 * glowPulse})`} size={1000} top="55%" />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 40,
        }}
      >
        <div style={{ opacity: tagOp }}>
          <Tag>Buildrs Blueprint</Tag>
        </div>

        {/* Titre principal — Instrument Serif italic */}
        <div
          style={{
            opacity: mainOp,
            transform: `scale(${mainScale})`,
            fontFamily: FONT_SERIF,
            fontSize: 96,
            fontWeight: 400,
            fontStyle: 'italic',
            color: WHITE,
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          Claude code à ta place.
        </div>

        <div
          style={{
            opacity: sub1Op,
            transform: `translateY(${sub1Y}px)`,
            fontFamily: FONT_SANS,
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: GRAY,
            textAlign: 'center',
          }}
        >
          Toi tu décides. Lui il exécute.
        </div>

        <div
          style={{
            opacity: sub2Op,
            transform: `translateY(${sub2Y}px)`,
            fontFamily: FONT_SANS,
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: WHITE,
            textAlign: 'center',
          }}
        >
          Tu deviens chef d'orchestre d'IA.
        </div>

        <div
          style={{
            opacity: sub3Op,
            transform: `translateY(${sub3Y}px)`,
            fontFamily: FONT_SANS,
            fontSize: 46,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: GRAY,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Ta propre équipe. Mais seul.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — La Liberté  (0–150)
// ════════════════════════════════════════════════════════════════════════════
const SceneFreedom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: 'Depuis ton ordi.',                              color: WHITE, serif: false, size: 84 },
    { text: '2h par jour.',                                  color: WHITE, serif: false, size: 84 },
    { text: "D'où tu veux.",                                 color: WHITE, serif: false, size: 84 },
    { text: 'Pour enfin lancer ce projet\nqui te ressemble.', color: GREEN, serif: true,  size: 52 },
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      <DotsBackground opacity={0.55} />
      <RadialGlow color="rgba(34,197,94,0.07)" size={900} top="60%" />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 40,
        }}
      >
        {lines.map((line, i) => {
          const delay = i * 22;
          const op    = fadeIn(frame, delay, 14);
          const scale = pop(frame, fps, delay);

          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `scale(${scale})`,
                fontFamily: line.serif ? FONT_SERIF : FONT_SANS,
                fontSize: line.size,
                fontWeight: line.serif ? 400 : 800,
                fontStyle: line.serif ? 'italic' : 'normal',
                letterSpacing: line.serif ? '-0.01em' : '-0.04em',
                color: line.color,
                textAlign: 'center',
                whiteSpace: 'pre-line',
                lineHeight: 1.1,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 — L'Urgence  (0–150)
// ════════════════════════════════════════════════════════════════════════════
const SceneUrgency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fond qui pulse légèrement
  const pulse = interpolate(Math.sin((frame / 18) * Math.PI), [-1, 1], [0, 0.03], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const line1Scale = pop(frame, fps, 5, 100);
  const line1Op    = fadeIn(frame, 5, 12);
  const line2Op    = fadeIn(frame, 46, 14);
  const line2Y     = slideUp(frame, 46, 14);
  const line3Scale = pop(frame, fps, 88, 110);
  const line3Op    = fadeIn(frame, 88, 14);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <DotsBackground opacity={0.5} />
      <AbsoluteFill style={{ background: `rgba(250,250,250,${pulse})` }} />
      <RadialGlow color="rgba(250,250,250,0.04)" size={1100} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 52,
        }}
      >
        <div
          style={{
            opacity: line1Op,
            transform: `scale(${line1Scale})`,
            fontFamily: FONT_SERIF,
            fontSize: 92,
            fontWeight: 400,
            fontStyle: 'italic',
            color: WHITE,
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          La fenêtre est historique.
        </div>

        <div
          style={{
            opacity: line2Op,
            transform: `translateY(${line2Y}px)`,
            fontFamily: FONT_SANS,
            fontSize: 46,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: GRAY,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Ceux qui se lancent maintenant
          <br />
          ont 3 ans d'avance.
        </div>

        <div
          style={{
            opacity: line3Op,
            transform: `scale(${line3Scale})`,
            fontFamily: FONT_MONO,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: GREEN,
            textAlign: 'center',
          }}
        >
          Dans 6 jours, ton app est live.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6 — Social Proof  (0–150)
// ════════════════════════════════════════════════════════════════════════════
const SceneSocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    'Sans savoir coder',
    'SaaS · App · Logiciel',
    'Stack pro : Supabase, Stripe, Vercel',
    'Dashboard complet — accès à vie',
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      <DotsBackground opacity={0.55} />
      <RadialGlow color="rgba(34,197,94,0.09)" size={900} top="50%" />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 56,
        }}
      >
        {items.map((item, i) => {
          const delay   = i * 18;
          const op      = fadeIn(frame, delay, 12);
          const x       = interpolate(frame - delay, [0, 16], [80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const cScale  = pop(frame, fps, delay);

          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `translateX(${x}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
              }}
            >
              <div style={{ transform: `scale(${cScale})`, flexShrink: 0 }}>
                <CheckIcon size={50} />
              </div>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 52,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: WHITE,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 7 — Prix + CTA  (0–210)
// ════════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOp    = fadeIn(frame, 5, 14);
  const priceScale = pop(frame, fps, 22, 95);
  const priceOp    = fadeIn(frame, 22, 14);
  const oldOp      = fadeIn(frame, 55, 14);
  const strikeP    = interpolate(frame, [70, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOp      = fadeIn(frame, 125, 20);
  const subY       = slideUp(frame, 125, 20, 40);

  // Glow pulsé sur le prix
  const glow = interpolate(Math.sin((frame / 22) * Math.PI), [-1, 1], [0.5, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <DotsBackground opacity={0.45} />
      <RadialGlow color={`rgba(34,197,94,${0.12 * glow})`} size={1100} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 24,
        }}
      >
        {/* Label */}
        <div
          style={{
            opacity: labelOp,
            fontFamily: FONT_SANS,
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: GRAY,
          }}
        >
          Prix de lancement
        </div>

        {/* 27€ — massif, Geist Mono */}
        <div
          style={{
            opacity: priceOp,
            transform: `scale(${priceScale})`,
            fontFamily: FONT_MONO,
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: WHITE,
            filter: `drop-shadow(0 0 ${40 * glow}px rgba(34,197,94,0.25))`,
          }}
        >
          27€
        </div>

        {/* Ancien prix barré */}
        <div style={{ opacity: oldOp, position: 'relative', display: 'inline-block' }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: GRAY_DIM,
            }}
          >
            197€
          </span>
          <div style={{ position: 'absolute', top: '52%', left: '-6px', right: '-6px', height: 2, overflow: 'hidden' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(250,250,250,0.4)',
                transformOrigin: 'left center',
                transform: `scaleX(${strikeP})`,
              }}
            />
          </div>
        </div>

        {/* Sous-texte */}
        <div
          style={{
            opacity: subOp,
            transform: `translateY(${subY}px)`,
            fontFamily: FONT_SERIF,
            fontSize: 46,
            fontWeight: 400,
            fontStyle: 'italic',
            color: GRAY,
            textAlign: 'center',
            maxWidth: 750,
            lineHeight: 1.4,
          }}
        >
          "Tu n'es plus seul à partir de maintenant."
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 8 — URL Fade  (0–120)
// ════════════════════════════════════════════════════════════════════════════
const SceneURL: React.FC = () => {
  const frame = useCurrentFrame();

  const URL_TEXT = 'www.buildrs.fr';
  const text    = typewriter(frame, URL_TEXT, 8, 54);
  const op      = fadeIn(frame, 8, 10);
  const globalFade = interpolate(frame, [88, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG, opacity: globalFade }}>
      <DotsBackground opacity={0.5} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            opacity: op,
            fontFamily: FONT_MONO,
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: WHITE,
          }}
        >
          {text}
          {text.length < URL_TEXT.length && <Cursor frame={frame} char="_" />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Font Loader Wrapper ──────────────────────────────────────────────────────
const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Loading fonts'));

  useEffect(() => {
    Promise.all([waitGeist(), waitMono(), waitSerif()]).then(() => continueRender(handle));
  }, [handle]);

  return <>{children}</>;
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export const BuildrsBlueprintAd: React.FC = () => {
  // Durées en frames @30fps
  const S1 = 90;   // 3s  — Hook
  const S2 = 150;  // 5s  — Réalité d'avant
  const S3 = 180;  // 6s  — Tournant
  const S4 = 150;  // 5s  — Liberté
  const S5 = 150;  // 5s  — Urgence
  const S6 = 150;  // 5s  — Social Proof
  const S7 = 210;  // 7s  — Prix + CTA
  const S8 = 120;  // 4s  — URL + Fade out
  // Total = 1200 frames = 40s

  const t1 = 0;
  const t2 = t1 + S1;
  const t3 = t2 + S2;
  const t4 = t3 + S3;
  const t5 = t4 + S4;
  const t6 = t5 + S5;
  const t7 = t6 + S6;
  const t8 = t7 + S7;

  return (
    <FontLoader>
      <AbsoluteFill style={{ background: BG }}>

        {/* ── MUSIQUE DE FOND ─────────────────────────────────────────────
            Placer music.mp3 dans le dossier public/
            Volume -15dB ≈ 0.18 (1.0 = 0dB)
        */}
        <Audio
          src={staticFile('music.mp3')}
          volume={0.18}
          startFrom={0}
        />

        {/* ── VOIX OFF ────────────────────────────────────────────────────
            Placer voiceover.mp3 dans le dossier public/
            Calée dès le début, suit le rythme des scènes
        */}
        <Audio
          src={staticFile('voiceover.mp3')}
          volume={1}
          startFrom={0}
        />

        {/* ── SCÈNES ──────────────────────────────────────────────────── */}
        <Sequence from={t1} durationInFrames={S1}><SceneHook /></Sequence>
        <Sequence from={t2} durationInFrames={S2}><SceneReality /></Sequence>
        <Sequence from={t3} durationInFrames={S3}><SceneTurnover /></Sequence>
        <Sequence from={t4} durationInFrames={S4}><SceneFreedom /></Sequence>
        <Sequence from={t5} durationInFrames={S5}><SceneUrgency /></Sequence>
        <Sequence from={t6} durationInFrames={S6}><SceneSocialProof /></Sequence>
        <Sequence from={t7} durationInFrames={S7}><SceneCTA /></Sequence>
        <Sequence from={t8} durationInFrames={S8}><SceneURL /></Sequence>

      </AbsoluteFill>
    </FontLoader>
  );
};
