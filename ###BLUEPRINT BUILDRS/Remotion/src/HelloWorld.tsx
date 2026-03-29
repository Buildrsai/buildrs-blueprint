import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

const Title: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = spring({
    fps,
    frame,
    config: {damping: 200},
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontSize: 96,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Helvetica, Arial, sans-serif',
        textAlign: 'center',
        textShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {text}
    </div>
  );
};

const Subtitle: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, 30], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: 48,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'Helvetica, Arial, sans-serif',
        textAlign: 'center',
        marginTop: 24,
      }}
    >
      {text}
    </div>
  );
};

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Background gradient color shift over time
  const hue = interpolate(frame, [0, durationInFrames], [220, 280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bg = `linear-gradient(135deg, hsl(${hue}, 80%, 30%), hsl(${hue + 40}, 70%, 20%))`;

  // Floating circle animation
  const circleY = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1],
    [0, 40],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{background: bg, justifyContent: 'center', alignItems: 'center'}}>
      {/* Decorative circle background */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            transform: `translateY(${circleY}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            transform: `translateY(${-circleY}px)`,
          }}
        />
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Sequence from={0} durationInFrames={120}>
          <Title text="Bonjour!" />
        </Sequence>
        <Sequence from={20}>
          <Subtitle text="Skill Remotion installé avec succès" />
        </Sequence>
        <Sequence from={50}>
          <div
            style={{
              marginTop: 48,
              opacity: interpolate(frame - 50, [0, 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              fontSize: 32,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'Helvetica, Arial, sans-serif',
              textAlign: 'center',
            }}
          >
            Créé avec Remotion + Claude
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
