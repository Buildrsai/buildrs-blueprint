'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const badgeRef = useRef<HTMLAnchorElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRowRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [
      { el: badgeRef.current, delay: 0 },
      { el: headingRef.current, delay: 80 },
      { el: descRowRef.current, delay: 160 },
      { el: mockupRef.current, delay: 240 },
    ];

    // Set initial state
    elements.forEach(({ el }) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'none';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          elements.forEach(({ el, delay }) => {
            if (!el) return;
            setTimeout(() => {
              el.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay);
          });
        });
      },
      { threshold: 0.1 }
    );

    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        background: 'rgb(8,9,10)',
        paddingTop: '160px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1436px',
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Badge */}
        <Link
          ref={badgeRef}
          href="https://linear.app/next"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 510,
            color: 'rgb(138,143,152)',
            marginBottom: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
            padding: '4px 12px',
            background: 'rgba(255,255,255,0.02)',
            textDecoration: 'none',
            fontFamily: 'var(--font-inter)',
            transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgb(247,248,248)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgb(138,143,152)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          Issue tracking is dead  →
        </Link>

        {/* H1 */}
        <h1
          ref={headingRef}
          style={{
            fontSize: '64px',
            fontWeight: 510,
            lineHeight: '64px',
            letterSpacing: '-1.408px',
            color: 'rgb(247,248,248)',
            marginBottom: '32px',
            fontFamily: 'var(--font-inter)',
          }}
          className="hero-heading"
        >
          The product development
          <br />
          system for teams and agents
        </h1>

        {/* Description row */}
        <div
          ref={descRowRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '64px',
          }}
          className="hero-desc-row"
        >
          <p
            style={{
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: '24px',
              letterSpacing: '-0.165px',
              color: 'rgb(138,143,152)',
              maxWidth: '380px',
              margin: 0,
              fontFamily: 'var(--font-inter)',
            }}
          >
            Purpose-built for planning and building products. Designed for the AI era.
          </p>

          {/* Feature link — desktop only */}
          <Link
            href="https://linear.app/next"
            className="hide-mobile"
            style={{
              fontSize: '13px',
              fontWeight: 510,
              color: 'rgb(138,143,152)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter)',
              transition: 'color 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(247,248,248)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(138,143,152)';
            }}
          >
            Issue tracking is dead  linear.app/next →
          </Link>
        </div>

        {/* Mockup wrapper */}
        <div
          ref={mockupRef}
          style={{
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgb(14,15,16)',
            position: 'relative',
          }}
        >
          <Image
            src="/images/hero-mockup-v2.png"
            alt="Linear app screenshot"
            width={1404}
            height={880}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            priority
          />
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-heading {
            font-size: 36px !important;
            line-height: 40px !important;
          }
          .hero-desc-row {
            flex-direction: column !important;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
