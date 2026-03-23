import React, { useState, useEffect } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  delayRender,
  continueRender,
} from 'remotion';
import { loadFont as loadGeist, fontFamily as geistFamily } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono, fontFamily as geistMonoFamily } from '@remotion/google-fonts/GeistMono';

// ─── Font Loading ─────────────────────────────────────────────────────────────
const { waitUntilDone: waitGeist } = loadGeist('normal', {
  weights: ['600', '700', '800'],
  subsets: ['latin'],
});
const { waitUntilDone: waitGeistMono } = loadGeistMono('normal', {
  weights: ['600', '700', '800'],
  subsets: ['latin'],
});

// ─── Design Tokens ────────────────────────────────────────────────────────────
const BG = '#09090b';
const WHITE = '#fafafa';
const GREEN = '#22c55e';
const GRAY = 'rgba(250,250,250,0.55)';
const GRAY_DIM = 'rgba(250,250,250,0.3)';
const FONT = `'${geistFamily}', system-ui, sans-serif`;
const MONO = `'${geistMonoFamily}', 'Courier New', monospace`;

// ─── Typography Base ──────────────────────────────────────────────────────────
const T: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1.1,
};

// ─── Animation Helpers ────────────────────────────────────────────────────────
const fadeIn = (frame: number, from = 0, duration = 20) =>
  interpolate(frame - from, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const slideUp = (frame: number, from = 0, duration = 18, dist = 60) =>
  interpolate(frame - from, [0, duration], [dist, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const typewriter = (frame: number, text: string, start: number, end: number): string => {
  const chars = Math.floor(
    interpolate(frame, [start, end], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  return text.slice(0, chars);
};

const pop = (frame: number, fps: number, from = 0, stiffness = 120) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness } });

// ─── SVG Checkmark ────────────────────────────────────────────────────────────
const CheckIcon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" stroke={GREEN} strokeWidth="2.5" />
    <path
      d="M13 22L19.5 28.5L31 17"
      stroke={GREEN}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Cursor clignotant ────────────────────────────────────────────────────────
const Cursor: React.FC<{ frame: number; char?: string }> = ({ frame, char = '|' }) => (
  <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color: WHITE }}>{char}</span>
);

// ─── SCENE 1 : Hook Typewriter (0–90) ─────────────────────────────────────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();

  const LINE1 = "T'as des idées.";
  const LINE2 = "C'est tout ce qu'il te faut.";

  const text1 = typewriter(frame, LINE1, 0, 42);
  const text2 = typewriter(frame, LINE2, 58, 88);

  const op1 = fadeIn(frame, 0, 6);
  const op2 = fadeIn(frame, 56, 6);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 90px',
          gap: 36,
        }}
      >
        <div style={{ ...T, fontSize: 100, color: WHITE, opacity: op1, textAlign: 'center' }}>
          {text1}
          {text1.length < LINE1.length && <Cursor frame={frame} />}
        </div>

        {frame >= 55 && (
          <div style={{ ...T, fontSize: 66, color: WHITE, opacity: op2, textAlign: 'center' }}>
            {text2}
            {text2.length < LINE2.length && <Cursor frame={frame} />}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 : Réalité d'avant (0–150 dans la séquence) ──────────────────────
const StrikeLine: React.FC<{
  text: string;
  enterFrame: number;
  strikeFrame: number;
  exitFrame: number;
}> = ({ text, enterFrame, strikeFrame, exitFrame }) => {
  const frame = useCurrentFrame();

  const enterOp = fadeIn(frame, enterFrame, 14);
  const enterY = slideUp(frame, enterFrame, 14, 70);

  const strikeProgress = interpolate(frame, [strikeFrame, strikeFrame + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOp = interpolate(frame, [exitFrame, exitFrame + 14], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isStriked = frame >= strikeFrame;

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
          ...T,
          fontSize: 58,
          color: isStriked ? GRAY : WHITE,
          fontWeight: 700,
          transition: 'none',
        }}
      >
        {text}
      </span>
      {frame >= strikeFrame && (
        <div
          style={{
            position: 'absolute',
            top: '52%',
            left: 0,
            right: 0,
            height: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'rgba(250,250,250,0.55)',
              transformOrigin: 'left center',
              transform: `scaleX(${strikeProgress})`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const SceneReality: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
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
      <StrikeLine
        text="Pas de budget pour un développeur"
        enterFrame={5}
        strikeFrame={48}
        exitFrame={108}
      />
      <StrikeLine
        text="Pas d'expérience technique"
        enterFrame={20}
        strikeFrame={62}
        exitFrame={118}
      />
      <StrikeLine
        text="Pas le temps de tout apprendre"
        enterFrame={35}
        strikeFrame={76}
        exitFrame={128}
      />
    </AbsoluteFill>
  </AbsoluteFill>
);

// ─── SCENE 3 : Le Tournant (0–180 dans la séquence) ──────────────────────────
const SceneTurnover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainScale = pop(frame, fps, 5);
  const mainOp = fadeIn(frame, 5, 14);

  const sub1Op = fadeIn(frame, 35, 14);
  const sub1Y = slideUp(frame, 35, 14);

  const sub2Op = fadeIn(frame, 70, 14);
  const sub2Y = slideUp(frame, 70, 14);

  const sub3Op = fadeIn(frame, 108, 14);
  const sub3Y = slideUp(frame, 108, 14);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 44,
        }}
      >
        <div
          style={{
            ...T,
            fontSize: 90,
            color: WHITE,
            textAlign: 'center',
            opacity: mainOp,
            transform: `scale(${mainScale})`,
          }}
        >
          Claude code à ta place.
        </div>

        <div
          style={{
            ...T,
            fontSize: 46,
            color: GRAY,
            textAlign: 'center',
            fontWeight: 500,
            opacity: sub1Op,
            transform: `translateY(${sub1Y}px)`,
          }}
        >
          Toi tu décides. Lui il exécute.
        </div>

        <div
          style={{
            ...T,
            fontSize: 56,
            color: WHITE,
            textAlign: 'center',
            opacity: sub2Op,
            transform: `translateY(${sub2Y}px)`,
          }}
        >
          Tu deviens chef d'orchestre d'IA.
        </div>

        <div
          style={{
            ...T,
            fontSize: 48,
            color: GRAY,
            textAlign: 'center',
            fontWeight: 600,
            fontStyle: 'italic',
            opacity: sub3Op,
            transform: `translateY(${sub3Y}px)`,
          }}
        >
          Ta propre équipe. Mais seul.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 : La Liberté (0–150 dans la séquence) ───────────────────────────
const SceneFreedom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: 'Depuis ton ordi.', color: WHITE, italic: false, size: 80 },
    { text: '2h par jour.', color: WHITE, italic: false, size: 80 },
    { text: "D'où tu veux.", color: WHITE, italic: false, size: 80 },
    { text: 'Pour enfin lancer ce projet qui te ressemble.', color: GREEN, italic: true, size: 48 },
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 44,
        }}
      >
        {lines.map((line, i) => {
          const delay = i * 20;
          const op = fadeIn(frame, delay, 14);
          const scale = pop(frame, fps, delay);
          return (
            <div
              key={i}
              style={{
                ...T,
                fontSize: line.size,
                color: line.color,
                textAlign: 'center',
                fontStyle: line.italic ? 'italic' : 'normal',
                fontWeight: i === 3 ? 700 : 800,
                opacity: op,
                transform: `scale(${scale})`,
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

// ─── SCENE 5 : L'Urgence (0–150 dans la séquence) ────────────────────────────
const SceneUrgency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(
    Math.sin((frame / 18) * Math.PI),
    [-1, 1],
    [0, 0.035],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const line1Scale = pop(frame, fps, 5);
  const line1Op = fadeIn(frame, 5, 12);

  const line2Op = fadeIn(frame, 44, 14);
  const line2Y = slideUp(frame, 44, 14);

  const line3Scale = pop(frame, fps, 84);
  const line3Op = fadeIn(frame, 84, 14);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${pulse})` }} />
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
            ...T,
            fontSize: 88,
            color: WHITE,
            textAlign: 'center',
            opacity: line1Op,
            transform: `scale(${line1Scale})`,
          }}
        >
          La fenêtre est historique.
        </div>

        <div
          style={{
            ...T,
            fontSize: 46,
            color: GRAY,
            textAlign: 'center',
            fontWeight: 600,
            opacity: line2Op,
            transform: `translateY(${line2Y}px)`,
          }}
        >
          Ceux qui se lancent maintenant
          <br />
          ont 3 ans d'avance.
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: 54,
            color: GREEN,
            textAlign: 'center',
            opacity: line3Op,
            transform: `scale(${line3Scale})`,
          }}
        >
          Dans 6 jours, ton app est live.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 6 : Social Proof (0–150 dans la séquence) ─────────────────────────
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
        {items.map((item, i) => {
          const delay = i * 18;
          const op = fadeIn(frame, delay, 12);
          const x = interpolate(frame - delay, [0, 16], [70, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const checkScale = pop(frame, fps, delay);

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
              <div style={{ transform: `scale(${checkScale})`, flexShrink: 0 }}>
                <CheckIcon size={48} />
              </div>
              <span style={{ ...T, fontSize: 54, color: WHITE, fontWeight: 700 }}>
                {item}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 7 : Prix + CTA (0–210 dans la séquence) ───────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOp = fadeIn(frame, 5, 14);

  const priceScale = pop(frame, fps, 22, 100);
  const priceOp = fadeIn(frame, 22, 14);

  const oldOp = fadeIn(frame, 55, 14);
  const strikeProgress = interpolate(frame, [70, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subOp = fadeIn(frame, 120, 20);
  const subY = slideUp(frame, 120, 20, 40);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 28,
        }}
      >
        {/* Label */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 600,
            color: GRAY,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            opacity: labelOp,
          }}
        >
          Prix de lancement
        </div>

        {/* Prix principal */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 190,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            opacity: priceOp,
            transform: `scale(${priceScale})`,
          }}
        >
          27€
        </div>

        {/* Ancien prix barré */}
        <div
          style={{
            opacity: oldOp,
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 76,
              fontWeight: 600,
              color: GRAY_DIM,
              letterSpacing: '-0.02em',
            }}
          >
            197€
          </span>
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: '-6px',
              right: '-6px',
              height: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(250,250,250,0.5)',
                transformOrigin: 'left center',
                transform: `scaleX(${strikeProgress})`,
              }}
            />
          </div>
        </div>

        {/* Sous-texte */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 42,
            fontWeight: 600,
            color: WHITE,
            textAlign: 'center',
            fontStyle: 'italic',
            maxWidth: 720,
            lineHeight: 1.45,
            opacity: subOp,
            transform: `translateY(${subY}px)`,
          }}
        >
          "Tu n'es plus seul à partir de maintenant."
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 8 : URL (0–120 dans la séquence) ──────────────────────────────────
const SceneURL: React.FC = () => {
  const frame = useCurrentFrame();

  const URL_TEXT = 'www.buildrs.fr';
  const text = typewriter(frame, URL_TEXT, 8, 55);
  const op = fadeIn(frame, 8, 10);

  const globalFade = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: BG, opacity: globalFade }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 76,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: '-0.02em',
            opacity: op,
          }}
        >
          {text}
          {text.length < URL_TEXT.length && (
            <Cursor frame={frame} char="_" />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── FONT LOADER WRAPPER ──────────────────────────────────────────────────────
const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Loading Geist fonts'));

  useEffect(() => {
    Promise.all([waitGeist(), waitGeistMono()]).then(() => {
      continueRender(handle);
    });
  }, [handle]);

  return <>{children}</>;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const BuildrsBlueprintAd: React.FC = () => {
  // Durées en frames (30fps)
  const S1 = 90;   // 3s  — Hook typewriter
  const S2 = 150;  // 5s  — Réalité d'avant
  const S3 = 180;  // 6s  — Le Tournant
  const S4 = 150;  // 5s  — La Liberté
  const S5 = 150;  // 5s  — L'Urgence
  const S6 = 150;  // 5s  — Social Proof
  const S7 = 210;  // 7s  — Prix + CTA
  const S8 = 120;  // 4s  — URL + Fade

  // Calcul cumulatif des offsets
  const t1 = 0;
  const t2 = t1 + S1;
  const t3 = t2 + S2;
  const t4 = t3 + S3;
  const t5 = t4 + S4;
  const t6 = t5 + S5;
  const t7 = t6 + S6;
  const t8 = t7 + S7;
  // Total : t8 + S8 = 1200 frames = 40s

  return (
    <FontLoader>
      <AbsoluteFill style={{ background: BG }}>
        <Sequence from={t1} durationInFrames={S1}>
          <SceneHook />
        </Sequence>
        <Sequence from={t2} durationInFrames={S2}>
          <SceneReality />
        </Sequence>
        <Sequence from={t3} durationInFrames={S3}>
          <SceneTurnover />
        </Sequence>
        <Sequence from={t4} durationInFrames={S4}>
          <SceneFreedom />
        </Sequence>
        <Sequence from={t5} durationInFrames={S5}>
          <SceneUrgency />
        </Sequence>
        <Sequence from={t6} durationInFrames={S6}>
          <SceneSocialProof />
        </Sequence>
        <Sequence from={t7} durationInFrames={S7}>
          <SceneCTA />
        </Sequence>
        <Sequence from={t8} durationInFrames={S8}>
          <SceneURL />
        </Sequence>
      </AbsoluteFill>
    </FontLoader>
  );
};
