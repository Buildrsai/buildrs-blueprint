import React from 'react';
import { AbsoluteFill, interpolate, spring } from 'remotion';

// ─── Design Tokens ───────────────────────────────────────────────────────────
export const BG       = '#09090b';
export const WHITE    = '#fafafa';
export const GREEN    = '#22c55e';
export const ORANGE   = 'rgba(250,134,54,0.9)';
export const RED      = '#ef4444';
export const GRAY     = 'rgba(250,250,250,0.55)';
export const GRAY_DIM = 'rgba(250,250,250,0.28)';
export const BORDER   = 'rgba(250,250,250,0.09)';

// ─── Animation Helpers ───────────────────────────────────────────────────────
/** fade in */
export const fi = (frame: number, from = 0, dur = 18) =>
  interpolate(frame - from, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** fade out */
export const fo = (frame: number, from = 0, dur = 14) =>
  interpolate(frame - from, [0, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** slide up */
export const su = (frame: number, from = 0, dur = 18, dist = 60) =>
  interpolate(frame - from, [0, dur], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** spring pop */
export const pop = (frame: number, fps: number, from = 0, stiffness = 120) =>
  spring({ fps, frame: frame - from, config: { damping: 200, stiffness } });

/** typewriter */
export const tw = (frame: number, text: string, start: number, end: number) =>
  text.slice(0, Math.floor(interpolate(frame, [start, end], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

// ─── Cursor ───────────────────────────────────────────────────────────────────
export const Cursor: React.FC<{ frame: number; color?: string }> = ({ frame, color = WHITE }) =>
  <span style={{ opacity: frame % 14 < 7 ? 1 : 0, color }}>|</span>;

// ─── Dots Pattern ────────────────────────────────────────────────────────────
export const Dots: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    opacity,
  }} />
);

// ─── Glow ────────────────────────────────────────────────────────────────────
export const Glow: React.FC<{
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  opacity?: number;
}> = ({ color = 'rgba(34,197,94,0.10)', size = 900, top = '50%', left = '50%', opacity = 1 }) => (
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

// ─── Badge Pill ───────────────────────────────────────────────────────────────
export const Badge: React.FC<{
  text: string;
  opacity?: number;
  translateY?: number;
  color?: string;
  borderColor?: string;
  bgColor?: string;
}> = ({ text, opacity = 1, translateY = 0, color = GREEN, borderColor = 'rgba(34,197,94,0.28)', bgColor = 'rgba(34,197,94,0.08)' }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 999,
    padding: '12px 28px',
    fontFamily: "'Geist', system-ui, sans-serif",
    fontSize: 28, fontWeight: 500,
    letterSpacing: '-0.01em', color,
    whiteSpace: 'nowrap',
  }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
    {text}
  </div>
);
