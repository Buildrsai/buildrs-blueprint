'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const ENTRIES = [
  {
    title: 'Multi-level sub-teams',
    description: 'Structure your teams in Linear to match how your organization works.',
    date: 'Apr 8, 2026',
  },
  {
    title: 'Web forms for Linear Asks',
    description: 'Linear Asks allows you to capture internal requests and bring them into Linear seamlessly.',
    date: 'Apr 1, 2026',
  },
  {
    title: 'Introducing Linear Agent',
    description: 'An AI agent that autonomously works on issues, writes code, and opens pull requests.',
    date: 'Mar 23, 2026',
  },
  {
    title: 'UI refresh',
    description: 'Introducing a calmer, more consistent interface.',
    date: 'Mar 11, 2026',
  },
];

export default function ChangelogSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);
  const [hoveredEntry, setHoveredEntry] = useState<number | null>(null);

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
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '96px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 700ms ease-out, transform 700ms ease-out',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'row',
          gap: '80px',
          alignItems: 'flex-start',
        }}
        className="changelog-inner"
      >
        {/* Left: heading + "See all" link */}
        <div style={{ flexShrink: 0 }}>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 510,
              lineHeight: '48px',
              letterSpacing: '-1.056px',
              color: 'rgb(247,248,248)',
              marginBottom: '24px',
              fontFamily: 'var(--font-inter)',
            }}
          >
            Changelog
          </h2>
          <Link
            href="#"
            onMouseEnter={() => setHoveredLink(true)}
            onMouseLeave={() => setHoveredLink(false)}
            style={{
              fontSize: '14px',
              fontWeight: 510,
              color: hoveredLink ? 'rgb(247,248,248)' : 'rgb(98,102,109)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color 0.15s ease',
              fontFamily: 'var(--font-inter)',
            }}
          >
            See all releases &rarr;
          </Link>
        </div>

        {/* Right: 4-column grid of changelog entries */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}
          className="changelog-grid"
        >
          {ENTRIES.map((entry, i) => (
            <div
              key={entry.title}
              onMouseEnter={() => setHoveredEntry(i)}
              onMouseLeave={() => setHoveredEntry(null)}
              style={{
                background: hoveredEntry === i ? 'rgba(255,255,255,0.02)' : 'rgb(8,9,10)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              {/* Red dot */}
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'rgb(220,60,60)',
                  marginBottom: '12px',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 510,
                  color: 'rgb(247,248,248)',
                  lineHeight: '20px',
                  letterSpacing: '-0.1px',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                {entry.title}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgb(98,102,109)',
                  lineHeight: '20px',
                  fontFamily: 'var(--font-inter)',
                  flex: 1,
                }}
              >
                {entry.description}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'rgb(62,66,72)',
                  fontFamily: 'var(--font-inter)',
                  marginTop: '8px',
                }}
              >
                {entry.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .changelog-inner {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .changelog-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .changelog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
