import React from 'react';
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
import { loadFont as loadGeist,     fontFamily as geistFamily    } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono, fontFamily as geistMonoFamily } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadSerif,     fontFamily as serifFamily     } from '@remotion/google-fonts/InstrumentSerif';

// ─── Font Loading ─────────────────────────────────────────────────────────────
const { waitUntilDone: waitGeist } = loadGeist('normal',    { weights: ['400','600','700','800'], subsets: ['latin'] });
const { waitUntilDone: waitMono  } = loadGeistMono('normal',{ weights: ['600','700'],             subsets: ['latin'] });
const { waitUntilDone: waitSerif } = loadSerif('italic',    { weights: ['400'],                   subsets: ['latin'] });

// ─── Design Tokens ─────────────────────────────────────────────────────────
const BG       = '#09090b';
const WHITE    = '#fafafa';
const GREEN    = '#22c55e';
const GRAY     = 'rgba(250,250,250,0.55)';
const GRAY_DIM = 'rgba(250,250,250,0.28)';
const BORDER   = 'rgba(250,250,250,0.09)';
const BORDER_M = 'rgba(250,250,250,0.15)';

const SANS  = `'${geistFamily}', system-ui, sans-serif`;
const MONO  = `'${geistMonoFamily}', 'Courier New', monospace`;
const SERIF = `'${serifFamily}', Georgia, serif`;

// ─── Shared Visual Layers ──────────────────────────────────────────────────
const Dots: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    opacity,
  }} />
);

const Glow: React.FC<{ color?: string; size?: number; top?: string; left?: string; opacity?: number }> = ({
  color = 'rgba(34,197,94,0.10)', size = 900, top = '50%', left = '50%', opacity = 1,
}) => (
  <AbsoluteFill>
    <div style={{
      position: 'absolute', top, left,
      width: size, height: size,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity, pointerEvents: 'none',
    }} />
  </AbsoluteFill>
);

// ─── Animation Helpers ─────────────────────────────────────────────────────
const fi = (frame: number, from = 0, dur = 18) =>
  interpolate(frame - from, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const fo = (frame: number, from = 0, dur = 14) =>
  interpolate(frame - from, [0, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const su = (frame: number, from = 0, dur = 18, dist = 60) =>
  interpolate(frame - from, [0, dur], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const pop = (frame: number, fps: number, from = 0, stiffness = 120) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness } });

const tw = (frame: number, text: string, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

const Cursor: React.FC<{ frame: number; color?: string }> = ({ frame, color = WHITE }) =>
  <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color }}>|</span>;

// ─── Pill Badge ────────────────────────────────────────────────────────────
const Badge: React.FC<{ text: string; opacity?: number; translateY?: number }> = ({ text, opacity = 1, translateY = 0 }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.28)',
    borderRadius: 999,
    padding: '12px 28px',
    fontFamily: SANS, fontSize: 28, fontWeight: 500,
    letterSpacing: '-0.01em', color: GREEN,
    whiteSpace: 'nowrap',
  }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, display: 'inline-block', flexShrink: 0 }} />
    {text}
  </div>
);

// ─── SVG Arrow ─────────────────────────────────────────────────────────────
const Arrow: React.FC<{ progress: number; color?: string; length?: number }> = ({ progress, color = GRAY, length = 110 }) => (
  <svg width={length + 30} height={40} viewBox={`0 0 ${length + 30} 40`} fill="none" style={{ overflow: 'visible' }}>
    <line
      x1="0" y1="20" x2={length} y2="20"
      stroke={color} strokeWidth="2.5" strokeLinecap="round"
      strokeDasharray={`${length}`}
      strokeDashoffset={`${(1 - progress) * length}`}
    />
    {progress > 0.8 && (
      <path
        d={`M${length - 12} 12 L${length + 6} 20 L${length - 12} 28`}
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        opacity={interpolate(progress, [0.8, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
    )}
  </svg>
);

// ─── Diagram Box ───────────────────────────────────────────────────────────
const DiagBox: React.FC<{
  label: string;
  sublabel?: string;
  color?: string;
  scale?: number;
  opacity?: number;
  icon?: React.ReactNode;
  accent?: boolean;
  width?: number;
}> = ({ label, sublabel, color = WHITE, scale = 1, opacity = 1, icon, accent = false, width = 260 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    background: accent ? 'rgba(34,197,94,0.06)' : 'rgba(250,250,250,0.04)',
    border: `1.5px solid ${accent ? 'rgba(34,197,94,0.30)' : BORDER}`,
    borderRadius: 20,
    padding: '32px 36px',
    width,
  }}>
    {icon && <div style={{ marginBottom: 4 }}>{icon}</div>}
    <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', color }}>{label}</div>
    {sublabel && <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', color: GRAY, textAlign: 'center' }}>{sublabel}</div>}
  </div>
);

// ─── Tool Chip (for tools row) ─────────────────────────────────────────────
const ToolChip: React.FC<{ name: string; color?: string; scale?: number; opacity?: number }> = ({
  name, color = GREEN, scale = 1, opacity = 1,
}) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(250,250,250,0.04)',
    border: `1px solid ${BORDER_M}`,
    borderRadius: 12,
    padding: '14px 24px',
    fontFamily: MONO, fontSize: 26, fontWeight: 600,
    color,
  }}>
    {name}
  </div>
);

// ─── SVG Icons ─────────────────────────────────────────────────────────────
const IconPerson: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="15" r="9" stroke={WHITE} strokeWidth="2.5" />
    <path d="M6 42c0-10 8-17 18-17s18 7 18 17" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconAI: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="12" width="36" height="26" rx="8" stroke={GREEN} strokeWidth="2.5" />
    <circle cx="16" cy="25" r="4" fill={GREEN} opacity={0.7} />
    <circle cx="24" cy="25" r="4" fill={GREEN} />
    <circle cx="32" cy="25" r="4" fill={GREEN} opacity={0.7} />
    <line x1="16" y1="12" x2="16" y2="7" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="12" x2="24" y2="5" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="12" x2="32" y2="7" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconRocket: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M24 5C24 5 36 9 36 24L24 44L12 24C12 9 24 5 24 5Z" stroke={WHITE} strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="24" cy="24" r="5" fill={WHITE} />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — HOOK  (0–90 / 3s)
// "Crée ton SaaS avec l'IA." + "En 6 jours."
// ════════════════════════════════════════════════════════════════════════════
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const L1 = 'Crée ton SaaS';
  const L2 = "avec l'IA.";
  const L3 = 'En 6 jours.';

  const glow = interpolate(Math.sin((frame / 30) * Math.PI), [-1, 1], [0.06, 0.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.65} />
      <Glow color={`rgba(34,197,94,${glow})`} size={1100} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 0 }}>
        {/* Badge */}
        <div style={{ opacity: fi(frame, 0, 10), transform: `translateY(${su(frame, 0, 10, 40)}px)`, marginBottom: 56 }}>
          <Badge text="Buildrs Blueprint" />
        </div>
        {/* Headline line 1 */}
        <div style={{
          opacity: fi(frame, 8, 10),
          transform: `translateY(${su(frame, 8, 10, 50)}px)`,
          fontFamily: SANS, fontSize: 106, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE,
          textAlign: 'center', lineHeight: 1.0,
        }}>
          {tw(frame, L1, 8, 40)}
          {tw(frame, L1, 8, 40).length < L1.length && <Cursor frame={frame} />}
        </div>
        {/* Headline line 2 */}
        <div style={{
          opacity: fi(frame, 30, 10),
          transform: `translateY(${su(frame, 30, 10, 40)}px)`,
          fontFamily: SANS, fontSize: 106, fontWeight: 800,
          letterSpacing: '-0.04em', color: WHITE,
          textAlign: 'center', lineHeight: 1.0, marginBottom: 40,
        }}>
          {tw(frame, L2, 30, 56)}
          {tw(frame, L2, 30, 56).length < L2.length && <Cursor frame={frame} />}
        </div>
        {/* "En 6 jours." — highlighted green */}
        {frame >= 52 && (
          <div style={{
            opacity: fi(frame, 52, 12),
            transform: `scale(${pop(frame, 30, 52, 90)})`,
            fontFamily: SANS, fontSize: 106, fontWeight: 800,
            letterSpacing: '-0.04em', color: GREEN,
            textAlign: 'center', lineHeight: 1.0,
          }}>
            {L3}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — PAIN POINTS  (0–120 / 4s)
// Strikethrough "Pas de dev", "Pas de code", "Pas de temps"
// ════════════════════════════════════════════════════════════════════════════
const StrikeLine: React.FC<{ text: string; enterFrame: number; strikeFrame: number; exitFrame?: number }> = ({
  text, enterFrame, strikeFrame, exitFrame = 9999,
}) => {
  const frame = useCurrentFrame();
  const sp   = interpolate(frame, [strikeFrame, strikeFrame + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitO = exitFrame < 9999 ? interpolate(frame, [exitFrame, exitFrame + 14], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;

  return (
    <div style={{
      opacity: fi(frame, enterFrame, 14) * exitO,
      transform: `translateY(${su(frame, enterFrame, 14, 70)}px)`,
      position: 'relative', display: 'inline-block',
    }}>
      <span style={{
        fontFamily: SANS, fontSize: 56, fontWeight: 700,
        letterSpacing: '-0.03em',
        color: frame >= strikeFrame ? GRAY_DIM : WHITE,
      }}>
        {text}
      </span>
      {frame >= strikeFrame && (
        <div style={{ position: 'absolute', top: '54%', left: 0, right: 0, height: 2.5, overflow: 'hidden' }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'rgba(250,250,250,0.40)',
            transformOrigin: 'left center',
            transform: `scaleX(${sp})`,
          }} />
        </div>
      )}
    </div>
  );
};

const ScenePainPoints: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Dots opacity={0.45} />
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 52 }}>
      <StrikeLine text="Pas de budget pour un dev"     enterFrame={4}  strikeFrame={38}  />
      <StrikeLine text="Pas d'expérience technique"    enterFrame={18} strikeFrame={52}  />
      <StrikeLine text="Pas le temps de tout apprendre" enterFrame={32} strikeFrame={66} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — FLOW DIAGRAM  (0–180 / 6s)
// Toi → Claude → (Vercel · Supabase · Stripe · Resend)
// ════════════════════════════════════════════════════════════════════════════
const SceneFlowDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleO  = fi(frame, 0, 14);
  const titleY  = su(frame, 0, 14);

  // Box 1 — Toi
  const box1S   = pop(frame, fps, 18);
  const box1O   = fi(frame, 18, 12);

  // Arrow 1
  const arr1P   = interpolate(frame, [36, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Box 2 — Claude IA
  const box2S   = pop(frame, fps, 60);
  const box2O   = fi(frame, 60, 12);

  // Arrow 2
  const arr2P   = interpolate(frame, [80, 102], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Box 3 — Ton App
  const box3S   = pop(frame, fps, 104);
  const box3O   = fi(frame, 104, 12);

  // Tools row
  const tools = ['Vercel', 'Supabase', 'Stripe', 'Resend'];
  const toolsO  = fi(frame, 128, 14);
  const toolsY  = su(frame, 128, 14, 40);

  // Subtitle
  const subO    = fi(frame, 148, 14);
  const subY    = su(frame, 148, 14);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <Glow color="rgba(34,197,94,0.07)" size={900} top="55%" />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px', gap: 48 }}>

        {/* Title */}
        <div style={{ opacity: titleO, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: SANS, fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em', color: GRAY }}>
            Tu n'as pas besoin de coder.
          </div>
          <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', color: WHITE, marginTop: 8 }}>
            Tu as besoin de <span style={{ color: GREEN }}>diriger.</span>
          </div>
        </div>

        {/* Diagram Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Box 1 — Toi */}
          <DiagBox
            label="Toi"
            sublabel="+ ton idée"
            icon={<IconPerson />}
            scale={box1S}
            opacity={box1O}
            width={220}
          />

          {/* Arrow 1 */}
          <div style={{ opacity: arr1P > 0 ? 1 : 0 }}>
            <Arrow progress={arr1P} color={GRAY} length={90} />
          </div>

          {/* Box 2 — Claude */}
          <DiagBox
            label="Claude"
            sublabel="ton co-fondateur IA"
            icon={<IconAI />}
            scale={box2S}
            opacity={box2O}
            accent
            width={260}
          />

          {/* Arrow 2 */}
          <div style={{ opacity: arr2P > 0 ? 1 : 0 }}>
            <Arrow progress={arr2P} color={GREEN} length={90} />
          </div>

          {/* Box 3 — App */}
          <DiagBox
            label="Ton App"
            sublabel="en production"
            icon={<IconRocket />}
            scale={box3S}
            opacity={box3O}
            width={220}
          />
        </div>

        {/* Tools row */}
        <div style={{ opacity: toolsO, transform: `translateY(${toolsY}px)`, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {tools.map((t, i) => (
            <ToolChip
              key={t}
              name={t}
              color={i === 0 ? WHITE : GREEN}
              scale={pop(frame, fps, 128 + i * 10)}
              opacity={fi(frame, 128 + i * 8, 10)}
            />
          ))}
        </div>

        {/* Subtitle */}
        <div style={{ opacity: subO, transform: `translateY(${subY}px)`, fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, fontWeight: 400, color: GRAY, textAlign: 'center' }}>
          "Le système utilisé en interne chez Buildrs."
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — 6 MODULES TIMELINE  (0–180 / 6s)
// Animated timeline: 6 steps each popping in sequence
// ════════════════════════════════════════════════════════════════════════════
const MODULES = [
  { day: '01', label: 'Fondations' },
  { day: '02', label: 'Trouver & Valider' },
  { day: '03', label: 'Design & Architecture' },
  { day: '04', label: 'Construire' },
  { day: '05', label: 'Déployer' },
  { day: '06', label: 'Monétiser & Lancer' },
];

const SceneModules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleO = fi(frame, 0, 14);
  const titleY = su(frame, 0, 14);

  // Timeline line progress: starts at frame 20, ends at frame 130
  const lineP  = interpolate(frame, [20, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const totalWidth = 900; // SVG width

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.45} />
      <Glow color="rgba(34,197,94,0.06)" size={800} top="40%" />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 60px', gap: 52 }}>

        {/* Title */}
        <div style={{ opacity: titleO, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: SANS, fontSize: 54, fontWeight: 800, letterSpacing: '-0.04em', color: WHITE }}>
            6 modules. 6 jours.{' '}
            <span style={{ color: GREEN }}>1 SaaS live.</span>
          </div>
        </div>

        {/* SVG Timeline */}
        <svg width={totalWidth} height={220} viewBox={`0 0 ${totalWidth} 220`} overflow="visible">
          {/* Base line (dim) */}
          <line x1="40" y1="60" x2={totalWidth - 40} y2="60" stroke={BORDER_M} strokeWidth="2" />

          {/* Animated green line */}
          <line
            x1="40" y1="60" x2={totalWidth - 40} y2="60"
            stroke={GREEN} strokeWidth="2.5"
            strokeDasharray={`${totalWidth - 80}`}
            strokeDashoffset={`${(1 - lineP) * (totalWidth - 80)}`}
          />

          {MODULES.map((mod, i) => {
            const xPos = 40 + i * ((totalWidth - 80) / (MODULES.length - 1));
            const dotFrom = 20 + i * 18;
            const s = pop(frame, fps, dotFrom, 160);
            const dotO = fi(frame, dotFrom, 10);
            const labelO = fi(frame, dotFrom + 8, 10);
            const labelY = su(frame, dotFrom + 8, 10, 30);

            const isLast = i === MODULES.length - 1;

            return (
              <g key={mod.day}>
                {/* Dot */}
                <circle
                  cx={xPos} cy={60}
                  r={12 * s}
                  fill={isLast ? GREEN : BG}
                  stroke={isLast ? GREEN : BORDER_M}
                  strokeWidth="2.5"
                  opacity={dotO}
                />
                <circle
                  cx={xPos} cy={60}
                  r={5 * s}
                  fill={isLast ? WHITE : GREEN}
                  opacity={dotO}
                />

                {/* Day number above */}
                <text
                  x={xPos} y={30}
                  textAnchor="middle"
                  style={{
                    fontFamily: MONO, fontSize: 22, fontWeight: 700,
                    fill: GREEN, opacity: labelO,
                    transform: `translateY(${labelY}px)`,
                  }}
                >
                  {`Jour ${mod.day}`}
                </text>

                {/* Module label below */}
                <text
                  x={xPos} y={102 + (i % 2 === 0 ? 0 : 40)}
                  textAnchor="middle"
                  style={{
                    fontFamily: SANS, fontSize: 24, fontWeight: 600,
                    fill: isLast ? WHITE : GRAY,
                    letterSpacing: '-0.02em',
                    opacity: labelO,
                  }}
                >
                  {mod.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tagline */}
        <div style={{
          opacity: fi(frame, 148, 14),
          transform: `translateY(${su(frame, 148, 14)}px)`,
          fontFamily: SERIF, fontStyle: 'italic', fontSize: 42, fontWeight: 400, color: GRAY, textAlign: 'center',
        }}>
          Pas une formation. Un système d'exécution.
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 — STATS  (0–120 / 4s)
// Big numbers: 27€ · 6 jours · 82/100 places · 100% solo
// ════════════════════════════════════════════════════════════════════════════
const StatCard: React.FC<{ value: string; label: string; scale?: number; opacity?: number; accent?: boolean }> = ({
  value, label, scale = 1, opacity = 1, accent = false,
}) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    background: accent ? 'rgba(34,197,94,0.06)' : 'rgba(250,250,250,0.04)',
    border: `1.5px solid ${accent ? 'rgba(34,197,94,0.28)' : BORDER}`,
    borderRadius: 20, padding: '32px 40px', minWidth: 220,
  }}>
    <div style={{ fontFamily: SANS, fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', color: accent ? GREEN : WHITE, lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: GRAY, textAlign: 'center' }}>
      {label}
    </div>
  </div>
);

const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: '27€',  label: 'accès à vie',       accent: true  },
    { value: '6',    label: 'jours pour lancer',  accent: false },
    { value: '100%', label: 'solo possible',       accent: false },
    { value: '<100€',label: 'budget tech total',   accent: false },
  ];

  const titleO = fi(frame, 0, 14);
  const titleY = su(frame, 0, 14);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <Glow color="rgba(34,197,94,0.09)" size={1000} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px', gap: 52 }}>

        <div style={{ opacity: titleO, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, fontWeight: 400, color: GRAY }}>
            Ce que tu obtiens
          </div>
          <div style={{ fontFamily: SANS, fontSize: 62, fontWeight: 800, letterSpacing: '-0.04em', color: WHITE, marginTop: 6 }}>
            pour moins qu'un déjeuner.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map((s, i) => (
            <StatCard
              key={s.value}
              value={s.value}
              label={s.label}
              accent={s.accent}
              scale={pop(frame, fps, 18 + i * 14)}
              opacity={fi(frame, 18 + i * 14, 12)}
            />
          ))}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6 — SOCIAL PROOF  (0–150 / 5s)
// 3 testimonials rotating in
// ════════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  { text: "J'ai lancé mon SaaS en 5 jours. Incroyable.", name: 'Marie A.' },
  { text: "27€ les mieux investis de ma vie de founder.", name: 'Thomas K.' },
  { text: "Le Blueprint m'a évité 6 mois d'erreurs.", name: 'Sophie B.' },
];

const SceneSocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleO = fi(frame, 0, 14);
  const titleY = su(frame, 0, 14);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.4} />
      <Glow color="rgba(34,197,94,0.06)" size={800} top="40%" />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 70px', gap: 40 }}>

        {/* Title */}
        <div style={{ opacity: titleO, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: SANS, fontSize: 50, fontWeight: 800, letterSpacing: '-0.04em', color: WHITE }}>
            Ils ont déjà lancé.{' '}
            <span style={{ color: GREEN }}>Toi aussi tu peux.</span>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {TESTIMONIALS.map((t, i) => {
            const fromF = 18 + i * 24;
            return (
              <div key={i} style={{
                opacity: fi(frame, fromF, 14),
                transform: `translateY(${su(frame, fromF, 14, 50)}px) scale(${pop(frame, fps, fromF, 100)})`,
                background: 'rgba(250,250,250,0.03)',
                border: `1px solid ${BORDER_M}`,
                borderRadius: 18,
                padding: '32px 44px',
              }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
                  {[0,1,2,3,4].map(s => (
                    <svg key={s} width="28" height="28" viewBox="0 0 28 28" fill={GREEN}>
                      <path d="M14 2l3.09 6.26L24 9.27l-5 4.87 1.18 6.88L14 17.77l-6.18 3.25L9 14.14 4 9.27l6.91-1.01L14 2z" />
                    </svg>
                  ))}
                </div>
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, fontWeight: 400, color: WHITE, lineHeight: 1.35, marginBottom: 18 }}>
                  "{t.text}"
                </div>
                <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: GREEN }}>
                  — {t.name}
                </div>
              </div>
            );
          })}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 7 — URGENCY  (0–120 / 4s)
// "82/100 places prises · Ensuite 297€"
// ════════════════════════════════════════════════════════════════════════════
const SceneUrgency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countO  = fi(frame, 0, 14);
  const countY  = su(frame, 0, 14);

  // Progress bar (82/100)
  const barW = interpolate(frame, [16, 60], [0, 0.82], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pulse = interpolate(Math.sin((frame / 20) * Math.PI), [-1, 1], [0.9, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.4} />
      <Glow color="rgba(239,68,68,0.07)" size={900} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 48 }}>

        {/* Counter */}
        <div style={{ opacity: countO, transform: `translateY(${countY}px) scale(${pop(frame, fps, 0, 80)})`, textAlign: 'center' }}>
          <div style={{ fontFamily: SANS, fontSize: 120, fontWeight: 800, letterSpacing: '-0.05em', color: WHITE, lineHeight: 1, transform: `scale(${pulse})` }}>
            <span style={{ color: GREEN }}>82</span>
            <span style={{ color: GRAY, fontSize: 72 }}>/100</span>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 42, fontWeight: 600, letterSpacing: '-0.03em', color: GRAY, marginTop: 8 }}>
            places déjà prises
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ opacity: fi(frame, 14, 12), width: '100%', height: 12, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${barW * 100}%`, height: '100%', background: GREEN, borderRadius: 99, transition: 'none' }} />
        </div>

        {/* Price jump warning */}
        <div style={{ opacity: fi(frame, 48, 14), transform: `translateY(${su(frame, 48, 14)}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 600, color: GRAY, letterSpacing: '-0.02em' }}>
            Ensuite le prix passe à{' '}
            <span style={{ color: '#ef4444', fontWeight: 700 }}>297€</span>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 400, color: GRAY_DIM, marginTop: 12 }}>
            Les 18 dernières places sont à 27€.
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCENE 8 — CTA  (0–240 / 8s)
// "Accéder au Blueprint — 27€ →" + buildrs.fr
// ════════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowA = interpolate(Math.sin((frame / 35) * Math.PI), [-1, 1], [0.08, 0.20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const titleO = fi(frame, 0, 14);
  const titleY = su(frame, 0, 14);

  const btnS   = pop(frame, fps, 22, 120);
  const btnO   = fi(frame, 22, 14);

  const subO   = fi(frame, 48, 14);
  const subY   = su(frame, 48, 14);

  const urlO   = fi(frame, 80, 14);
  const urlS   = pop(frame, fps, 80, 80);

  // Pulsing border on CTA button
  const borderGlow = interpolate(Math.sin((frame / 25) * Math.PI), [-1, 1], [0.25, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color={`rgba(34,197,94,${glowA})`} size={1100} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 48 }}>

        {/* Eyebrow */}
        <div style={{ opacity: titleO, transform: `translateY(${titleY}px)` }}>
          <Badge text="Offre de lancement · 18 places restantes" />
        </div>

        {/* Headline */}
        <div style={{
          opacity: fi(frame, 8, 14),
          transform: `translateY(${su(frame, 8, 14)}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: SANS, fontSize: 82, fontWeight: 800, letterSpacing: '-0.04em', color: WHITE, lineHeight: 1.0 }}>
            Crée ton SaaS.
          </div>
          <div style={{ fontFamily: SANS, fontSize: 82, fontWeight: 800, letterSpacing: '-0.04em', color: GREEN, lineHeight: 1.0 }}>
            En 6 jours.
          </div>
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: btnO, transform: `scale(${btnS})`,
          background: 'rgba(250,250,250,0.05)',
          border: `1.5px solid rgba(34,197,94,${borderGlow})`,
          borderRadius: 20,
          padding: '36px 72px',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <span style={{ fontFamily: SANS, fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', color: WHITE }}>
            Accéder au Blueprint
          </span>
          <span style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, color: GREEN }}>
            — 27€ →
          </span>
        </div>

        {/* Sub-copy */}
        <div style={{ opacity: subO, transform: `translateY(${subY}px)`, textAlign: 'center', display: 'flex', gap: 40 }}>
          {['Accès à vie', 'Mises à jour incluses', 'Remboursement 14j'].map((item, i) => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: SANS, fontSize: 28, fontWeight: 500, color: GRAY,
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11l5 5 9-9" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          opacity: urlO, transform: `scale(${urlS})`,
          fontFamily: MONO, fontSize: 44, fontWeight: 700,
          color: GRAY, letterSpacing: '-0.02em',
        }}>
          www.<span style={{ color: WHITE }}>buildrs</span>.fr
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// Total: 1200 frames = 40s @ 30fps
//
//  S1 Hook          0  – 90   (90f  / 3s)
//  S2 Pain Points  90  – 210  (120f / 4s)
//  S3 Flow Diagram 210 – 390  (180f / 6s)
//  S4 Modules      390 – 570  (180f / 6s)
//  S5 Stats        570 – 690  (120f / 4s)
//  S6 Social Proof 690 – 840  (150f / 5s)
//  S7 Urgency      840 – 960  (120f / 4s)
//  S8 CTA          960 – 1200 (240f / 8s)
// ════════════════════════════════════════════════════════════════════════════
export const BuildrsBlueprintAd: React.FC = () => {
  const handle = delayRender('fonts');

  React.useEffect(() => {
    Promise.all([waitGeist(), waitMono(), waitSerif()]).then(() => continueRender(handle));
  }, []);

  return (
    <AbsoluteFill style={{ background: BG }}>

      {/* Audio layers */}
      <Audio src={staticFile('music.mp3')}     volume={0.18} />
      <Audio src={staticFile('voiceover.mp3')} volume={1.0}  />

      <Sequence from={0}    durationInFrames={90}>  <SceneHook />       </Sequence>
      <Sequence from={90}   durationInFrames={120}> <ScenePainPoints /> </Sequence>
      <Sequence from={210}  durationInFrames={180}> <SceneFlowDiagram /></Sequence>
      <Sequence from={390}  durationInFrames={180}> <SceneModules />    </Sequence>
      <Sequence from={570}  durationInFrames={120}> <SceneStats />      </Sequence>
      <Sequence from={690}  durationInFrames={150}> <SceneSocialProof /></Sequence>
      <Sequence from={840}  durationInFrames={120}> <SceneUrgency />    </Sequence>
      <Sequence from={960}  durationInFrames={240}> <SceneCTA />        </Sequence>

    </AbsoluteFill>
  );
};
