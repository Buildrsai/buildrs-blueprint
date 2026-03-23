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
import { loadFont as loadGeist,     fontFamily as geistFamily    } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono, fontFamily as geistMonoFamily } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadSerif,     fontFamily as serifFamily     } from '@remotion/google-fonts/InstrumentSerif';

// ─── Font Loading ─────────────────────────────────────────────────────────────
const { waitUntilDone: waitGeist } = loadGeist('normal',    { weights: ['400','500','600','700','800'], subsets: ['latin'] });
const { waitUntilDone: waitMono  } = loadGeistMono('normal',{ weights: ['600','700','800'],             subsets: ['latin'] });
const { waitUntilDone: waitSerif } = loadSerif('normal',    { weights: ['400'],                        subsets: ['latin'] });

// ─── Design Tokens ────────────────────────────────────────────────────────────
const BG         = '#09090b';
const WHITE      = '#fafafa';
const GREEN      = '#22c55e';
const GRAY       = 'rgba(250,250,250,0.55)';
const GRAY_DIM   = 'rgba(250,250,250,0.28)';
const BORDER     = 'rgba(250,250,250,0.09)';

const SANS  = `'${geistFamily}',    system-ui, sans-serif`;
const MONO  = `'${geistMonoFamily}','Courier New', monospace`;
const SERIF = `'${serifFamily}',    Georgia, serif`;

// ─── Shared Visual Layers ─────────────────────────────────────────────────────
const Dots: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    opacity,
  }} />
);

const Glow: React.FC<{ color?: string; size?: number; top?: string; left?: string; opacity?: number }> = ({
  color = 'rgba(34,197,94,0.1)', size = 900, top = '50%', left = '50%', opacity = 1,
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

// ─── Animation Helpers ────────────────────────────────────────────────────────
const fi  = (frame: number, from = 0, dur = 18) =>
  interpolate(frame - from, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const su  = (frame: number, from = 0, dur = 18, dist = 60) =>
  interpolate(frame - from, [0, dur], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const pop = (frame: number, fps: number, from = 0, stiffness = 110) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness } });

const tw  = (frame: number, text: string, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

const Cursor: React.FC<{ frame: number; char?: string; color?: string }> = ({ frame, char = '|', color = WHITE }) =>
  <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color }}>{char}</span>;

// ─── SVG Arrow (tracé animé) ──────────────────────────────────────────────────
const Arrow: React.FC<{ progress: number; color?: string }> = ({ progress, color = GRAY }) => {
  const len = 120;
  return (
    <svg width="140" height="40" viewBox="0 0 140 40" fill="none" style={{ overflow: 'visible' }}>
      {/* Corps */}
      <line
        x1="0" y1="20" x2="110" y2="20"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={`${len}`}
        strokeDashoffset={`${(1 - progress) * len}`}
      />
      {/* Pointe */}
      {progress > 0.8 && (
        <path
          d="M98 12 L114 20 L98 28"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          fill="none"
          opacity={interpolate(progress, [0.8, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      )}
    </svg>
  );
};

// ─── Diagram Box ──────────────────────────────────────────────────────────────
const DiagBox: React.FC<{
  label: string;
  sublabel: string;
  color?: string;
  scale?: number;
  opacity?: number;
  icon?: React.ReactNode;
}> = ({ label, sublabel, color = WHITE, scale = 1, opacity = 1, icon }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    background: 'rgba(250,250,250,0.04)',
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: '36px 44px',
    minWidth: 240,
  }}>
    {icon && <div style={{ marginBottom: 4 }}>{icon}</div>}
    <div style={{ fontFamily: SANS, fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', color }}>{label}</div>
    <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: GRAY }}>{sublabel}</div>
  </div>
);

// ─── Check Icon ───────────────────────────────────────────────────────────────
const CheckIcon: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" stroke={GREEN} strokeWidth="2" />
    <path d="M13 22L19.5 28.5L31 17" stroke={GREEN} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ════════════════════════════════════════════════════════════════════════════
// S1 — HOOK TYPEWRITER  (90 frames / 3s)
// ════════════════════════════════════════════════════════════════════════════
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const LINE1 = "T'as des idées.";
  const LINE2 = "C'est tout ce qu'il te faut.";
  const glow  = interpolate(Math.sin((frame / 28) * Math.PI), [-1, 1], [0.07, 0.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.7} />
      <Glow color={`rgba(34,197,94,${glow})`} size={1000} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 90px', gap: 40 }}>
        <div style={{ opacity: fi(frame, 0, 6), fontFamily: SERIF, fontSize: 108, fontWeight: 400, fontStyle: 'italic', color: WHITE, textAlign: 'center', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
          {tw(frame, LINE1, 0, 40)}
          {tw(frame, LINE1, 0, 40).length < LINE1.length && <Cursor frame={frame} />}
        </div>
        {frame >= 52 && (
          <div style={{ opacity: fi(frame, 52, 8), fontFamily: SANS, fontSize: 56, fontWeight: 600, color: GRAY, textAlign: 'center', letterSpacing: '-0.03em' }}>
            {tw(frame, LINE2, 56, 86)}
            {tw(frame, LINE2, 56, 86).length < LINE2.length && <Cursor frame={frame} color={GRAY} />}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// S2 — RÉALITÉ D'AVANT  (120 frames / 4s)
// ════════════════════════════════════════════════════════════════════════════
const StrikeLine: React.FC<{ text: string; enterFrame: number; strikeFrame: number; exitFrame: number }> = ({ text, enterFrame, strikeFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const sp    = interpolate(frame, [strikeFrame, strikeFrame + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitO = interpolate(frame, [exitFrame,  exitFrame + 12],   [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ opacity: fi(frame, enterFrame, 13) * exitO, transform: `translateY(${su(frame, enterFrame, 13, 70)}px)`, position: 'relative', display: 'inline-block' }}>
      <span style={{ fontFamily: SANS, fontSize: 54, fontWeight: 700, letterSpacing: '-0.03em', color: frame >= strikeFrame ? GRAY_DIM : WHITE }}>
        {text}
      </span>
      {frame >= strikeFrame && (
        <div style={{ position: 'absolute', top: '54%', left: 0, right: 0, height: 2, overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'rgba(250,250,250,0.45)', transformOrigin: 'left center', transform: `scaleX(${sp})` }} />
        </div>
      )}
    </div>
  );
};

const SceneReality: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Dots opacity={0.5} />
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 56 }}>
      <StrikeLine text="Pas de budget pour un développeur" enterFrame={4}  strikeFrame={40}  exitFrame={94}  />
      <StrikeLine text="Pas d'expérience technique"        enterFrame={18} strikeFrame={52}  exitFrame={104} />
      <StrikeLine text="Pas le temps de tout apprendre"    enterFrame={32} strikeFrame={64}  exitFrame={114} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════════════════════════════
// S3 — FLOW DIAGRAM : Toi → Claude → App  (180 frames / 6s)
// ════════════════════════════════════════════════════════════════════════════
// Structure :
//   [Toi + ton idée]  ──────→  [Claude IA]  ──────→  [App Live]
//
// Animation :
//   - Titre apparaît slide-up
//   - Box 1 pop spring frame 20
//   - Flèche 1 se trace frames 40–60
//   - Box 2 pop spring frame 62
//   - Flèche 2 se trace frames 82–102
//   - Box 3 pop spring frame 104
//   - Sous-titre fade frame 130

// Icône "personne" SVG
const IconPerson: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="16" r="10" stroke={WHITE} strokeWidth="2.5" />
    <path d="M6 46c0-11 9-18 20-18s20 7 20 18" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Icône "IA / cerveau" SVG
const IconAI: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="8" y="14" width="36" height="26" rx="8" stroke={GREEN} strokeWidth="2.5" />
    <circle cx="18" cy="27" r="4" fill={GREEN} opacity={0.7} />
    <circle cx="26" cy="27" r="4" fill={GREEN} />
    <circle cx="34" cy="27" r="4" fill={GREEN} opacity={0.7} />
    <line x1="18" y1="14" x2="18" y2="8" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="14" x2="26" y2="6" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="34" y1="14" x2="34" y2="8" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Icône "rocket"
const IconRocket: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <path d="M26 6C26 6 38 10 38 26L26 46L14 26C14 10 26 6 26 6Z" stroke={WHITE} strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="26" cy="26" r="5" fill={WHITE} />
    <path d="M14 30L8 36" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 30L44 36" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SceneFlowDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp  = fi(frame, 0, 14);
  const titleY   = su(frame, 0, 14);

  const box1S    = pop(frame, fps, 20);
  const box1O    = fi(frame, 20, 12);

  const arrow1P  = interpolate(frame, [44, 66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const box2S    = pop(frame, fps, 68, 120);
  const box2O    = fi(frame, 68, 12);

  const arrow2P  = interpolate(frame, [90, 112], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const box3S    = pop(frame, fps, 114, 100);
  const box3O    = fi(frame, 114, 12);

  const subO     = fi(frame, 148, 18);
  const subY     = su(frame, 148, 18, 30);

  const glowPulse = interpolate(Math.sin((frame / 28) * Math.PI), [-1, 1], [0.07, 0.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.6} />
      <Glow color={`rgba(34,197,94,${glowPulse})`} size={1000} top="55%" />

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px', gap: 52 }}>

        {/* Titre */}
        <div style={{
          opacity: titleOp, transform: `translateY(${titleY}px)`,
          fontFamily: SERIF, fontSize: 72, fontWeight: 400, fontStyle: 'italic',
          color: WHITE, textAlign: 'center', letterSpacing: '-0.01em',
        }}>
          Comment ça marche ?
        </div>

        {/* Diagramme horizontal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Box 1 — Toi */}
          <DiagBox
            label="Toi"
            sublabel="ton idée"
            color={WHITE}
            scale={box1S}
            opacity={box1O}
            icon={<IconPerson />}
          />

          {/* Flèche 1 */}
          <div style={{ opacity: fi(frame, 42, 8) }}>
            <Arrow progress={arrow1P} color={GREEN} />
          </div>

          {/* Box 2 — Claude */}
          <DiagBox
            label="Claude"
            sublabel="IA associée"
            color={GREEN}
            scale={box2S}
            opacity={box2O}
            icon={<IconAI />}
          />

          {/* Flèche 2 */}
          <div style={{ opacity: fi(frame, 88, 8) }}>
            <Arrow progress={arrow2P} color={GREEN} />
          </div>

          {/* Box 3 — App Live */}
          <DiagBox
            label="App"
            sublabel="live en 6 jours"
            color={WHITE}
            scale={box3S}
            opacity={box3O}
            icon={<IconRocket />}
          />
        </div>

        {/* Sous-texte */}
        <div style={{
          opacity: subO, transform: `translateY(${subY}px)`,
          fontFamily: SANS, fontSize: 40, fontWeight: 500,
          letterSpacing: '-0.03em', color: GRAY, textAlign: 'center',
        }}>
          Tu décides. Lui il code. Toi tu lances.
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// S4 — LIBERTÉ  (120 frames / 4s)
// ════════════════════════════════════════════════════════════════════════════
const SceneFreedom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: 'Depuis ton ordi.',                              color: WHITE, serif: false, size: 84 },
    { text: '2h par jour.',                                  color: WHITE, serif: false, size: 84 },
    { text: "D'où tu veux.",                                 color: WHITE, serif: false, size: 84 },
    { text: 'Pour enfin lancer ce projet\nqui te ressemble.', color: GREEN, serif: true,  size: 50 },
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.08)" size={900} top="60%" />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 36 }}>
        {lines.map((line, i) => {
          const delay = i * 22;
          return (
            <div key={i} style={{
              opacity: fi(frame, delay, 13),
              transform: `scale(${pop(frame, fps, delay)})`,
              fontFamily: line.serif ? SERIF : SANS,
              fontSize: line.size, fontWeight: line.serif ? 400 : 800,
              fontStyle: line.serif ? 'italic' : 'normal',
              letterSpacing: line.serif ? '-0.01em' : '-0.04em',
              color: line.color, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.1,
            }}>{line.text}</div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// S5 — TIMELINE 6 JOURS  (180 frames / 6s)
// ════════════════════════════════════════════════════════════════════════════
// Visuel :
//   ●─────●─────●─────●─────●─────●
//  J1    J2    J3    J4    J5    J6🚀
// Setup Design Front Back  Test  Live

const days = [
  { num: 'J1', task: 'Setup',    color: GRAY },
  { num: 'J2', task: 'Design',   color: GRAY },
  { num: 'J3', task: 'Frontend', color: GRAY },
  { num: 'J4', task: 'Backend',  color: GRAY },
  { num: 'J5', task: 'Tests',    color: GRAY },
  { num: 'J6', task: 'Live',     color: GREEN },
];

const SceneTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleO = fi(frame, 0, 14);
  const titleY = su(frame, 0, 14);

  // Ligne qui se trace de gauche à droite (frames 25–110)
  const lineProgress = interpolate(frame, [25, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Chaque dot pop avec délai
  const dotDelay  = (i: number) => 30 + i * 14;
  const labelDelay = (i: number) => dotDelay(i) + 10;

  const subO = fi(frame, 150, 18);
  const subY = su(frame, 150, 18, 30);

  // Largeur de la timeline (en px, à 1080px de large)
  const TL_W = 860;
  const DOT_R = 14;
  const spacing = TL_W / (days.length - 1);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.1)" size={1000} top="55%" />

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 60 }}>

        {/* Titre */}
        <div style={{
          opacity: titleO, transform: `translateY(${titleY}px)`,
          fontFamily: SERIF, fontSize: 76, fontWeight: 400, fontStyle: 'italic',
          color: WHITE, textAlign: 'center', letterSpacing: '-0.01em',
        }}>
          6 jours. Ton app est live.
        </div>

        {/* Timeline SVG */}
        <div style={{ position: 'relative', width: TL_W, height: 160 }}>
          <svg width={TL_W} height={160} viewBox={`0 0 ${TL_W} 160`} overflow="visible">

            {/* Ligne grise (base) */}
            <line x1={DOT_R} y1="50" x2={TL_W - DOT_R} y2="50" stroke={BORDER} strokeWidth="2.5" />

            {/* Ligne verte animée */}
            <line
              x1={DOT_R} y1="50"
              x2={DOT_R + (TL_W - DOT_R * 2) * lineProgress} y2="50"
              stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"
              opacity={0.6}
            />

            {/* Dots + labels */}
            {days.map((day, i) => {
              const cx       = i * spacing + DOT_R;
              const dotScale = pop(frame, fps, dotDelay(i));
              const dotOp    = fi(frame, dotDelay(i), 10);
              const labOp    = fi(frame, labelDelay(i), 10);
              const isLive   = i === days.length - 1;

              return (
                <g key={i}>
                  {/* Dot */}
                  <circle
                    cx={cx} cy={50}
                    r={DOT_R * dotScale}
                    fill={isLive ? GREEN : BG}
                    stroke={isLive ? GREEN : GRAY}
                    strokeWidth="2.5"
                    opacity={dotOp}
                  />
                  {/* Numéro jour */}
                  <text
                    x={cx} y={20}
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize={26}
                    fontWeight={700}
                    fill={isLive ? GREEN : GRAY}
                    opacity={labOp}
                  >
                    {day.num}
                  </text>
                  {/* Tâche */}
                  <text
                    x={cx} y={92}
                    textAnchor="middle"
                    fontFamily={SANS}
                    fontSize={24}
                    fontWeight={600}
                    fill={isLive ? GREEN : GRAY}
                    opacity={labOp}
                  >
                    {day.task}
                  </text>
                  {/* Étoile "Live" */}
                  {isLive && frame >= dotDelay(i) && (
                    <text
                      x={cx} y={130}
                      textAnchor="middle"
                      fontFamily={MONO}
                      fontSize={28}
                      fontWeight={800}
                      fill={GREEN}
                      opacity={labOp}
                    >
                      LIVE
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sous-texte */}
        <div style={{
          opacity: subO, transform: `translateY(${subY}px)`,
          fontFamily: SANS, fontSize: 40, fontWeight: 500,
          letterSpacing: '-0.03em', color: GRAY, textAlign: 'center',
        }}>
          Pas de théorie. Pas de cours. Une app réelle.
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// S6 — URGENCE  (120 frames / 4s)
// ════════════════════════════════════════════════════════════════════════════
const SceneUrgency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(Math.sin((frame / 18) * Math.PI), [-1, 1], [0, 0.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.5} />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${pulse})` }} />
      <Glow color="rgba(250,250,250,0.04)" size={1100} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 48 }}>
        <div style={{
          opacity: fi(frame, 4, 12), transform: `scale(${pop(frame, fps, 4, 100)})`,
          fontFamily: SERIF, fontSize: 90, fontWeight: 400, fontStyle: 'italic',
          color: WHITE, textAlign: 'center', lineHeight: 1.05, letterSpacing: '-0.01em',
        }}>
          La fenêtre est historique.
        </div>
        <div style={{
          opacity: fi(frame, 44, 14), transform: `translateY(${su(frame, 44, 14)})`,
          fontFamily: SANS, fontSize: 46, fontWeight: 600, letterSpacing: '-0.03em',
          color: GRAY, textAlign: 'center', lineHeight: 1.4,
        }}>
          Ceux qui se lancent maintenant<br />ont 3 ans d'avance.
        </div>
        <div style={{
          opacity: fi(frame, 84, 14), transform: `scale(${pop(frame, fps, 84, 110)})`,
          fontFamily: MONO, fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em',
          color: GREEN, textAlign: 'center',
        }}>
          Dans 6 jours, ton app est live.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// S7 — SOCIAL PROOF + STACK  (150 frames / 5s)
// ════════════════════════════════════════════════════════════════════════════
// Partie haute : 4 checklist items
// Partie basse : 3 logos stack (Supabase · Stripe · Vercel)

// Logos stack (SVG minimaliste avec couleurs brand)
const SupabaseLogo: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M20 4L4 22H18L16 32L32 14H18L20 4Z" fill="#3FCF8E" />
  </svg>
);
const StripeLogo: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="4" width="28" height="28" rx="6" fill="#635BFF" />
    <path d="M16.5 14c0-1.1.9-1.5 2.3-1.5 2 0 4.6.6 6.6 1.7V9.1C23.1 8.2 20.6 8 18 8c-5 0-8.3 2.5-8.3 6.8 0 6.6 9.1 5.5 9.1 8.3 0 1.3-1.1 1.7-2.6 1.7-2.3 0-5.1-.9-7.4-2.2v5.2C11 28.7 13.8 29 16.2 29c5.1 0 8.6-2.4 8.6-6.8C24.8 15.5 16.5 16.7 16.5 14Z" fill="white" />
  </svg>
);
const VercelLogo: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M18 6L32 30H4L18 6Z" fill={WHITE} />
  </svg>
);

const stackItems = [
  { logo: <SupabaseLogo />, name: 'Supabase',  color: '#3FCF8E', desc: 'Database + Auth' },
  { logo: <StripeLogo />,   name: 'Stripe',    color: '#635BFF', desc: 'Paiements' },
  { logo: <VercelLogo />,   name: 'Vercel',    color: WHITE,     desc: 'Deploy' },
];

const checkItems = [
  'Sans savoir coder',
  'SaaS · App · Logiciel',
  'Stack pro incluse',
  'Dashboard complet — accès à vie',
];

const SceneSocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.55} />
      <Glow color="rgba(34,197,94,0.09)" size={900} top="45%" />

      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 40 }}>

        {/* Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
          {checkItems.map((item, i) => {
            const delay  = i * 16;
            const x      = interpolate(frame - delay, [0, 15], [80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{ opacity: fi(frame, delay, 12), transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ transform: `scale(${pop(frame, fps, delay)})`, flexShrink: 0 }}><CheckIcon size={48} /></div>
                <span style={{ fontFamily: SANS, fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', color: WHITE }}>{item}</span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        {frame >= 80 && (
          <div style={{ opacity: fi(frame, 80, 12), width: '100%', height: 1, background: BORDER }} />
        )}

        {/* Stack logos */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          {stackItems.map((s, i) => {
            const delay = 90 + i * 16;
            return (
              <div key={i} style={{
                opacity: fi(frame, delay, 12),
                transform: `scale(${pop(frame, fps, delay)})`,
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(250,250,250,0.04)',
                border: `1px solid ${BORDER}`,
                borderRadius: 14, padding: '16px 28px',
              }}>
                {s.logo}
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 700, color: s.color, letterSpacing: '-0.03em' }}>{s.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 400, color: GRAY }}>{s.desc}</div>
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
// S8 — PRIX + CTA  (180 frames / 6s)
// ════════════════════════════════════════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelO  = fi(frame, 4, 14);
  const pScale  = pop(frame, fps, 22, 95);
  const pOp     = fi(frame, 22, 14);
  const oldOp   = fi(frame, 55, 14);
  const strikeP = interpolate(frame, [70, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subO    = fi(frame, 125, 20);
  const subY    = su(frame, 125, 20, 40);

  const glow = interpolate(Math.sin((frame / 22) * Math.PI), [-1, 1], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Dots opacity={0.45} />
      <Glow color={`rgba(34,197,94,${0.12 * glow})`} size={1100} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', gap: 22 }}>

        <div style={{ opacity: labelO, fontFamily: SANS, fontSize: 30, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: GRAY }}>
          Prix de lancement
        </div>

        {/* 27€ */}
        <div style={{
          opacity: pOp, transform: `scale(${pScale})`,
          fontFamily: MONO, fontSize: 200, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
          color: WHITE, filter: `drop-shadow(0 0 ${40 * glow}px rgba(34,197,94,0.28))`,
        }}>
          27€
        </div>

        {/* Barré 197€ */}
        <div style={{ opacity: oldOp, position: 'relative', display: 'inline-block' }}>
          <span style={{ fontFamily: MONO, fontSize: 72, fontWeight: 500, letterSpacing: '-0.02em', color: GRAY_DIM }}>197€</span>
          <div style={{ position: 'absolute', top: '52%', left: '-6px', right: '-6px', height: 2, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'rgba(250,250,250,0.4)', transformOrigin: 'left center', transform: `scaleX(${strikeP})` }} />
          </div>
        </div>

        <div style={{
          opacity: subO, transform: `translateY(${subY}px)`,
          fontFamily: SERIF, fontSize: 46, fontWeight: 400, fontStyle: 'italic',
          color: GRAY, textAlign: 'center', maxWidth: 750, lineHeight: 1.4,
        }}>
          "Tu n'es plus seul à partir de maintenant."
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// S9 — URL FADE  (90 frames / 3s)
// ════════════════════════════════════════════════════════════════════════════
const SceneURL: React.FC = () => {
  const frame   = useCurrentFrame();
  const URL_TXT = 'www.buildrs.fr';
  const text    = tw(frame, URL_TXT, 8, 52);
  const fade    = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: BG, opacity: fade }}>
      <Dots opacity={0.45} />
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: fi(frame, 8, 10), fontFamily: MONO, fontSize: 76, fontWeight: 700, letterSpacing: '-0.02em', color: WHITE }}>
          {text}
          {text.length < URL_TXT.length && <Cursor frame={frame} char="_" />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Font Loader ──────────────────────────────────────────────────────────────
const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Loading fonts'));
  useEffect(() => {
    Promise.all([waitGeist(), waitMono(), waitSerif()]).then(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// Durées :  S1+S2+S3+S4+S5+S6+S7+S8+S9 = 90+120+180+120+180+120+150+180+90 = 1230
// → ajusté à 1200 : S6 raccourci à 90, S8 à 150
// Total réel ci-dessous = 1200 frames = 40s
// ════════════════════════════════════════════════════════════════════════════
export const BuildrsBlueprintAd: React.FC = () => {
  const S1 = 90;   // 3s  Hook typewriter
  const S2 = 120;  // 4s  Réalité d'avant
  const S3 = 180;  // 6s  Flow diagram
  const S4 = 120;  // 4s  Liberté
  const S5 = 180;  // 6s  Timeline 6 jours
  const S6 = 90;   // 3s  Urgence
  const S7 = 150;  // 5s  Social proof + stack
  const S8 = 180;  // 6s  Prix + CTA
  const S9 = 90;   // 3s  URL + fade out
  // Total : 1200 frames = 40s

  const t1 = 0;
  const t2 = t1 + S1;
  const t3 = t2 + S2;
  const t4 = t3 + S3;
  const t5 = t4 + S4;
  const t6 = t5 + S5;
  const t7 = t6 + S6;
  const t8 = t7 + S7;
  const t9 = t8 + S8;

  return (
    <FontLoader>
      <AbsoluteFill style={{ background: BG }}>

        {/* MUSIQUE — placer public/music.mp3 */}
        <Audio src={staticFile('music.mp3')}     volume={0.18} startFrom={0} />

        {/* VOIX OFF — placer public/voiceover.mp3 */}
        <Audio src={staticFile('voiceover.mp3')} volume={1}    startFrom={0} />

        <Sequence from={t1} durationInFrames={S1}><SceneHook         /></Sequence>
        <Sequence from={t2} durationInFrames={S2}><SceneReality      /></Sequence>
        <Sequence from={t3} durationInFrames={S3}><SceneFlowDiagram  /></Sequence>
        <Sequence from={t4} durationInFrames={S4}><SceneFreedom      /></Sequence>
        <Sequence from={t5} durationInFrames={S5}><SceneTimeline     /></Sequence>
        <Sequence from={t6} durationInFrames={S6}><SceneUrgency      /></Sequence>
        <Sequence from={t7} durationInFrames={S7}><SceneSocialProof  /></Sequence>
        <Sequence from={t8} durationInFrames={S8}><SceneCTA          /></Sequence>
        <Sequence from={t9} durationInFrames={S9}><SceneURL          /></Sequence>

      </AbsoluteFill>
    </FontLoader>
  );
};
