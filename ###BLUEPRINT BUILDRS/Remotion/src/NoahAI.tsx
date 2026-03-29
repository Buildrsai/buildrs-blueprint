import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const DARK = '#0a0a0a';
const DARK2 = '#111111';
const WHITE = '#ffffff';
const GRAY = '#999999';
const GRAY2 = '#666666';
const ACCENT = '#635bff';
const GREEN = '#16a34a';
const GRADIENT = 'linear-gradient(135deg, #f97316, #ec4899, #a78bfa)';
const FONT = 'Inter, -apple-system, system-ui, sans-serif';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fadeIn = (frame: number, from = 0, duration = 20) =>
  interpolate(frame - from, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const slideUp = (frame: number, from = 0, duration = 25, dist = 40) =>
  interpolate(frame - from, [0, duration], [dist, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const scaleIn = (frame: number, fps: number, from = 0) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness: 80 } });

// ─── Gradient Text ────────────────────────────────────────────────────────────
const GradientText: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, fontSize = 96, style }) => (
  <span
    style={{
      fontSize,
      fontWeight: 800,
      fontFamily: FONT,
      backgroundImage: GRADIENT,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
      display: 'inline-block',
      ...style,
    }}
  >
    {children}
  </span>
);

// ─── Scene 1 : Hero ───────────────────────────────────────────────────────────
const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = scaleIn(frame, fps, 0);
  const logoOpacity = fadeIn(frame, 0, 15);
  const tag = fadeIn(frame, 10, 20);
  const tagY = slideUp(frame, 10, 20);
  const h1Opacity = fadeIn(frame, 20, 25);
  const h1Y = slideUp(frame, 20, 25);
  const subOpacity = fadeIn(frame, 40, 25);
  const subY = slideUp(frame, 40, 25);
  const badgeOpacity = fadeIn(frame, 55, 20);

  // Pulsing glow
  const glow = interpolate(Math.sin((frame / 45) * Math.PI), [-1, 1], [0.3, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: DARK, fontFamily: FONT }}>
      {/* Background glow */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 900,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(236,72,153,${glow * 0.18}) 0%, rgba(249,115,22,${glow * 0.08}) 50%, transparent 80%)`,
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          padding: '0 120px',
        }}
      >
        {/* Tag */}
        <div
          style={{
            opacity: tag,
            transform: `translateY(${tagY}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100,
            padding: '10px 22px',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: GRADIENT,
              borderRadius: 4,
              width: 8,
              height: 8,
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, fontWeight: 500, letterSpacing: 0.3 }}>
            Pour ceux qui veulent monétiser leur savoir en ligne
          </span>
        </div>

        {/* H1 */}
        <div
          style={{
            opacity: h1Opacity,
            transform: `translateY(${h1Y}px)`,
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.1,
              color: WHITE,
              letterSpacing: -2,
            }}
          >
            <GradientText fontSize={96}>Noah AI</GradientText>
            {' '}génère tes 4 offres
            <br />
            et t'aide à faire ta 1ère vente{' '}
            <span style={{ fontStyle: 'italic', color: WHITE }}>en moins de 24h</span>
            <br />
            pour viser{' '}
            <span
              style={{
                backgroundImage: GRADIENT,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              +4000€/mois
            </span>
          </h1>
        </div>

        {/* Sub */}
        <p
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontSize: 28,
            color: GRAY,
            textAlign: 'center',
            maxWidth: 860,
            margin: 0,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Ton savoir, ton expertise, tes offres — générés en quelques minutes.
          <br />
          Simple. Prédictif. Prêt à vendre.
        </p>

        {/* Social badge */}
        <div
          style={{
            opacity: badgeOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 52,
          }}
        >
          <div style={{ display: 'flex' }}>
            {['#f97316', '#ec4899', '#a78bfa', '#635bff', '#16a34a'].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: c,
                  border: '2px solid #0a0a0a',
                  marginLeft: i === 0 ? 0 : -10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: WHITE,
                  fontWeight: 700,
                }}
              >
                {['S', 'M', 'A', 'J', 'É'][i]}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ color: '#f97316', fontSize: 22 }}>★</span>
            ))}
          </div>
          <span style={{ color: GRAY, fontSize: 22, fontWeight: 500 }}>
            +500 créateurs ont lancé leur business
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2 : Features ───────────────────────────────────────────────────────
const features = [
  { icon: '⚡', title: '4 offres structurées', desc: 'Low-ticket, mid, supérieure, premium — avec les prix optimaux.' },
  { icon: '💬', title: 'Messages de vente', desc: 'Complètement personnalisés pour faire tes premières ventes.' },
  { icon: '📅', title: 'Plan d\'action 7 jours', desc: 'Étape par étape, 100% personnalisé à ton profil et tes objectifs.' },
  { icon: '📊', title: 'Analyse de marché', desc: 'Validation de ton idée et étude de marché complète.' },
  { icon: '👥', title: 'Avatars clients', desc: 'Profils détaillés de tes clients idéaux avec les stratégies.' },
  { icon: '🎮', title: 'Dashboard gamifié', desc: 'Suis ta progression et reste motivé jusqu\'à ta première vente.' },
];

const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 20);
  const titleY = slideUp(frame, 0, 20);

  return (
    <AbsoluteFill style={{ background: DARK, fontFamily: FONT }}>
      {/* Subtle grid bg */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 100px',
          gap: 0,
        }}
      >
        {/* Label */}
        <div
          style={{
            opacity: fadeIn(frame, 0, 15),
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 100,
            padding: '8px 20px',
            marginBottom: 24,
          }}
        >
          <span style={{ color: GRAY, fontSize: 18, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
            LA SOLUTION
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontWeight: 800,
            color: WHITE,
            textAlign: 'center',
            margin: '0 0 52px 0',
            letterSpacing: -1.5,
          }}
        >
          Notre IA fait{' '}
          <GradientText fontSize={72} style={{ fontStyle: 'italic' }}>
            tout le travail
          </GradientText>{' '}
          pour toi
        </h2>

        {/* Feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            width: '100%',
            maxWidth: 1500,
          }}
        >
          {features.map((f, i) => {
            const delay = 10 + i * 8;
            const cardOpacity = fadeIn(frame, delay, 18);
            const cardY = slideUp(frame, delay, 18, 30);
            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  padding: '32px 32px',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: WHITE, marginBottom: 8 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 18, color: GRAY2, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3 : Social Proof ───────────────────────────────────────────────────
const SceneSocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countOpacity = fadeIn(frame, 0, 20);
  const countScale = scaleIn(frame, fps, 0);
  const quoteOpacity = fadeIn(frame, 20, 25);
  const quoteY = slideUp(frame, 20, 25);
  const authorOpacity = fadeIn(frame, 40, 20);

  // Animated counter for +500
  const count = Math.round(
    interpolate(frame, [0, 40], [0, 500], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <AbsoluteFill style={{ background: DARK, fontFamily: FONT }}>
      {/* Glow */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(99,91,255,0.15) 0%, transparent 70%)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 140px',
        }}
      >
        {/* Counter */}
        <div
          style={{
            opacity: countOpacity,
            transform: `scale(${countScale})`,
            textAlign: 'center',
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              backgroundImage: GRADIENT,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            +{count}
          </div>
          <div style={{ fontSize: 28, color: GRAY, fontWeight: 500, marginTop: 8 }}>
            créateurs ont lancé leur business avec NOAH™
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: '48px 60px',
            maxWidth: 1100,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 42,
              color: WHITE,
              fontWeight: 600,
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            "En 20 minutes, j'avais mes 4 offres, mes prix, mes messages de vente
            et mon plan d'action. J'ai lancé ma première vente le lendemain."
          </div>
          <div
            style={{
              opacity: authorOpacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              marginTop: 32,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: WHITE,
              }}
            >
              M
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: WHITE, fontSize: 22, fontWeight: 700 }}>Marine D.</div>
              <div style={{ color: GRAY, fontSize: 18 }}>Coach bien-être</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4 : How It Works ───────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Réponds à quelques questions',
    desc: '5 minutes pour décrire ton expertise et tes objectifs.',
  },
  {
    num: '02',
    title: 'NOAH™ analyse et génère',
    desc: "L'IA crée tes 4 offres, valide ton marché et rédige tous tes contenus.",
  },
  {
    num: '03',
    title: 'Lance ta première vente',
    desc: 'Suis le plan d\'action jour par jour et fais ta première vente.',
  },
];

const SceneHowItWorks: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 20);
  const titleY = slideUp(frame, 0, 20);

  return (
    <AbsoluteFill style={{ background: '#f8f8f8', fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 120px',
        }}
      >
        {/* Label */}
        <div
          style={{
            opacity: fadeIn(frame, 0, 15),
            fontSize: 18,
            fontWeight: 600,
            color: GRAY2,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          COMMENT ÇA MARCHE
        </div>

        {/* Title */}
        <h2
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 80,
            fontWeight: 800,
            color: DARK,
            textAlign: 'center',
            margin: '0 0 72px 0',
            letterSpacing: -2,
            lineHeight: 1.15,
          }}
        >
          3 étapes.{' '}
          <span style={{ fontStyle: 'italic' }}>5 minutes.</span>
          <br />
          Tout est prêt.
        </h2>

        {/* Steps */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            width: '100%',
            maxWidth: 1500,
          }}
        >
          {steps.map((s, i) => {
            const delay = 15 + i * 12;
            const op = fadeIn(frame, delay, 20);
            const y = slideUp(frame, delay, 20);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  opacity: op,
                  transform: `translateY(${y}px)`,
                  background: WHITE,
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 24,
                  padding: '44px 44px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: GRAY,
                    letterSpacing: 2,
                    marginBottom: 20,
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 100,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.num}
                </div>
                {/* Step line accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: GRADIENT,
                    opacity: 0.7,
                  }}
                />
                <div style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 12, lineHeight: 1.3 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 20, color: GRAY2, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5 : CTA ────────────────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagOpacity = fadeIn(frame, 0, 15);
  const titleOpacity = fadeIn(frame, 10, 25);
  const titleY = slideUp(frame, 10, 25);
  const subOpacity = fadeIn(frame, 25, 20);
  const ctaOpacity = fadeIn(frame, 35, 20);
  const ctaScale = scaleIn(frame, fps, 35);
  const priceOpacity = fadeIn(frame, 30, 20);

  // Animated border glow
  const borderGlow = interpolate(
    Math.sin((frame / 40) * Math.PI),
    [-1, 1],
    [0.4, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: DARK, fontFamily: FONT }}>
      {/* Background glow */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(249,115,22,${0.1 * borderGlow}) 0%, rgba(236,72,153,${0.08 * borderGlow}) 40%, transparent 70%)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 120px',
        }}
      >
        {/* Tag */}
        <div
          style={{
            opacity: tagOpacity,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 100,
            padding: '10px 22px',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              backgroundImage: GRADIENT,
              borderRadius: 4,
              padding: '3px 10px',
              fontSize: 14,
              fontWeight: 700,
              color: WHITE,
              letterSpacing: 0.5,
            }}
          >
            NOAH™
          </div>
          <span style={{ color: GRAY, fontSize: 20, fontWeight: 500 }}>Ton copilote IA</span>
        </div>

        {/* Title */}
        <h2
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 96,
            fontWeight: 900,
            color: WHITE,
            textAlign: 'center',
            margin: '0 0 20px 0',
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          Transforme ton savoir en{' '}
          <GradientText fontSize={96} style={{ fontStyle: 'italic' }}>
            revenus
          </GradientText>
        </h2>

        {/* Sub */}
        <p
          style={{
            opacity: subOpacity,
            fontSize: 26,
            color: GRAY,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.6,
            margin: '0 0 48px 0',
          }}
        >
          Rejoins +500 créateurs. Offres, prix, messages de vente —<br />
          tout est généré pour toi.
        </p>

        {/* Price + CTA */}
        <div
          style={{
            opacity: priceOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Old price */}
          <div style={{ fontSize: 24, color: GRAY2, textDecoration: 'line-through', fontWeight: 500 }}>
            97€
          </div>

          {/* CTA Button */}
          <div
            style={{
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
              background: WHITE,
              borderRadius: 100,
              padding: '22px 52px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: `0 0 ${40 * borderGlow}px rgba(236,72,153,0.3), 0 0 ${80 * borderGlow}px rgba(249,115,22,0.15)`,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: DARK,
                letterSpacing: -0.5,
              }}
            >
              Accéder à NOAH™ — 29€
            </span>
            <span style={{ fontSize: 26, color: DARK }}>→</span>
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 4, opacity: ctaOpacity }}>
            <span style={{ color: GRAY2, fontSize: 18 }}>🔒 Paiement sécurisé</span>
            <span style={{ color: GRAY2, fontSize: 18 }}>·</span>
            <span style={{ color: GRAY2, fontSize: 18 }}>Garantie 30 jours</span>
            <span style={{ color: GRAY2, fontSize: 18 }}>·</span>
            <span style={{ color: GRAY2, fontSize: 18 }}>Sans engagement</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Transition ───────────────────────────────────────────────────────────────
const TRANSITION_FRAMES = 20;

const SceneTransition: React.FC<{
  from: React.FC;
  to: React.FC;
  durationInFrames: number;
}> = ({ from: From, to: To, durationInFrames }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [durationInFrames - TRANSITION_FRAMES, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - progress }}>
        <From />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress }}>
        <To />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const NoahAI: React.FC = () => {
  // Scene durations (frames at 30fps)
  const S1 = 90;  // Hero: 3s
  const S2 = 90;  // Features: 3s
  const S3 = 90;  // Social proof: 3s
  const S4 = 90;  // How it works: 3s
  const S5 = 90;  // CTA: 3s

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={S1}>
        <SceneHero />
      </Sequence>
      <Sequence from={S1} durationInFrames={S2}>
        <SceneFeatures />
      </Sequence>
      <Sequence from={S1 + S2} durationInFrames={S3}>
        <SceneSocialProof />
      </Sequence>
      <Sequence from={S1 + S2 + S3} durationInFrames={S4}>
        <SceneHowItWorks />
      </Sequence>
      <Sequence from={S1 + S2 + S3 + S4} durationInFrames={S5}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
