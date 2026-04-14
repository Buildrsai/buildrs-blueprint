'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { FeatureSection } from '../types/index';

interface FeatureSectionProps {
  section: FeatureSection;
}

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

export default function FeatureSection({ section }: FeatureSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [badgeHovered, setBadgeHovered] = useState(false);

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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mockup = section.mockupImages[0];

  return (
    <section
      ref={ref}
      style={{
        background: 'rgb(8,9,10)',
        padding: '160px 0',
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 700ms ease-out, transform 700ms ease-out',
      }}
    >
      {/* Inner grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: '80px',
          alignItems: 'start',
        }}
        className="feature-inner"
      >
        {/* Left: sticky text column */}
        <div
          style={{
            position: 'sticky',
            top: '120px',
          }}
          className="feature-text"
        >
          {/* Badge */}
          <Link
            href={section.linkHref}
            onMouseEnter={() => setBadgeHovered(true)}
            onMouseLeave={() => setBadgeHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 510,
              color: badgeHovered ? 'rgb(247,248,248)' : 'rgb(138,143,152)',
              marginBottom: '24px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
          >
            {section.number} {section.label} &rarr;
          </Link>

          {/* Heading */}
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 510,
              lineHeight: '48px',
              letterSpacing: '-1.056px',
              color: 'rgb(247,248,248)',
              marginBottom: '24px',
              whiteSpace: 'pre-line',
            }}
            className="feature-heading"
          >
            {section.heading}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: '24px',
              letterSpacing: '-0.165px',
              color: 'rgb(138,143,152)',
              maxWidth: '380px',
              margin: 0,
            }}
          >
            {section.description}
          </p>
        </div>

        {/* Right: mockup column */}
        <div
          style={{
            position: 'relative',
          }}
          className="feature-mockup"
        >
          {/* Glow behind mockup */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '400px',
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 90%)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />

          {/* Mockup frame */}
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              background: 'rgb(18,19,20)',
              position: 'relative',
            }}
          >
            {mockup && (
              <Image
                src={mockup.src}
                alt={mockup.alt}
                width={mockup.width ?? 1200}
                height={mockup.height ?? 800}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            )}

            {/* Grain overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.15,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
                backgroundImage: GRAIN_SVG,
                backgroundRepeat: 'repeat',
                backgroundSize: '200px 200px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Responsive styles via a scoped style tag */}
      <style>{`
        @media (max-width: 900px) {
          .feature-inner {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .feature-text {
            position: static !important;
          }
          .feature-heading {
            font-size: 28px !important;
            line-height: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
