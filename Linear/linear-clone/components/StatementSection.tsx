'use client';

import { useEffect, useRef, useState } from 'react';

const BENEFITS = [
  {
    title: 'Built for purpose',
    description: 'Linear is shaped by the practices and principles of world-class product teams.',
  },
  {
    title: 'Powered by AI agents',
    description: 'Designed for workflows shared by humans and agents. From drafting PRDs to pushing PRs.',
  },
  {
    title: 'Designed for speed',
    description: 'Reduces noise and restores momentum to help teams ship with high velocity and focus.',
  },
];

// Isometric shape SVGs for each benefit card
function IsometricShape({ index }: { index: number }) {
  const shapes = [
    // Pyramid / diamond
    <svg key={0} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8L72 28V52L40 72L8 52V28L40 8Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none"/>
      <path d="M40 8L72 28L40 48L8 28L40 8Z" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      <path d="M40 48V72M8 28V52L40 72M72 28V52L40 72" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    </svg>,
    // Hexagon
    <svg key={1} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8L68 24V56L40 72L12 56V24L40 8Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none"/>
      <path d="M40 8L68 24L40 40L12 24L40 8Z" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      <path d="M40 40V72M12 24V56M68 24V56" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    </svg>,
    // Cube
    <svg key={2} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 12L68 28V56L40 72L12 56V28L40 12Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none"/>
      <path d="M40 12L68 28L40 44L12 28L40 12Z" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      <path d="M40 44L40 72" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <path d="M12 28L12 56L40 72" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <path d="M68 28L68 56L40 72" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    </svg>,
  ];
  return shapes[index] ?? shapes[0];
}

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: 'rgb(8,9,10)',
        padding: '96px 0 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 700ms ease-out, transform 700ms ease-out',
      }}
    >
      {/* Statement */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          marginBottom: '80px',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: '-0.5px',
            color: 'rgb(138,143,152)',
            maxWidth: '720px',
            margin: 0,
            fontFamily: 'var(--font-inter)',
          }}
          className="statement-text"
        >
          <span style={{ color: 'rgb(247,248,248)' }}>A new species of product tool.</span>{' '}
          Purpose-built for modern teams with AI workflows at its core, Linear sets a new
          standard for planning and building products.
        </p>
      </div>

      {/* Benefits row */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
        className="benefits-grid"
      >
        {BENEFITS.map((benefit, i) => (
          <div
            key={benefit.title}
            style={{
              padding: '48px 0 48px',
              paddingRight: i < 2 ? '40px' : '0',
              paddingLeft: i > 0 ? '40px' : '0',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            {/* Isometric shape */}
            <div style={{ marginBottom: '32px', opacity: 0.7 }}>
              <IsometricShape index={i} />
            </div>

            <h3
              style={{
                fontSize: '14px',
                fontWeight: 510,
                lineHeight: '20px',
                letterSpacing: '-0.1px',
                color: 'rgb(247,248,248)',
                marginBottom: '8px',
                fontFamily: 'var(--font-inter)',
              }}
            >
              {benefit.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '22px',
                color: 'rgb(98,102,109)',
                margin: 0,
                maxWidth: '280px',
                fontFamily: 'var(--font-inter)',
              }}
            >
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
          .statement-text {
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}
