'use client';

import { useState } from 'react';

// Company logos as text-based marks (matching the original linear.app muted style)
const LOGOS = [
  { name: 'Vercel', symbol: '▲' },
  { name: 'Cursor', symbol: null },
  { name: 'oscar', symbol: null },
  { name: 'OpenAI', symbol: null },
  { name: 'coinbase', symbol: null },
  { name: 'Cash App', symbol: null },
  { name: 'boom', symbol: null },
  { name: 'ramp', symbol: null },
];

export default function LogoBar() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 0',
        background: 'rgb(8,9,10)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        {LOGOS.map((logo) => (
          <span
            key={logo.name}
            onMouseEnter={() => setHovered(logo.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontSize: logo.name === 'oscar' ? '13px' : '14px',
              fontWeight: logo.name === 'Vercel' ? 600 : 510,
              color: hovered === logo.name ? 'rgb(138,143,152)' : 'rgb(62,66,72)',
              letterSpacing: logo.name === 'OpenAI' ? '-0.2px' : '0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.15s ease',
              cursor: 'default',
              userSelect: 'none',
              fontFamily: 'var(--font-inter)',
              whiteSpace: 'nowrap',
            }}
          >
            {logo.symbol && <span>{logo.symbol}</span>}
            {logo.name}
          </span>
        ))}
      </div>
    </div>
  );
}
