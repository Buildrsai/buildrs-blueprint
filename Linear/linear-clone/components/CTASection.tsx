'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CTASection() {
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  return (
    <section
      style={{
        background: 'rgb(8,9,10)',
        padding: '80px 32px',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1344px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
        }}
      >
        <h2
          className="cta-heading"
          style={{
            fontSize: '64px',
            fontWeight: 510,
            lineHeight: '64px',
            letterSpacing: '-1.408px',
            color: 'rgb(247,248,248)',
            textAlign: 'center',
            margin: 0,
            fontFamily: 'var(--font-inter)',
          }}
        >
          Built for the future. Available today.
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <Link
            href="#"
            onMouseEnter={() => setPrimaryHovered(true)}
            onMouseLeave={() => setPrimaryHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              padding: '0 16px',
              background: primaryHovered ? 'rgb(255,255,255)' : 'rgb(230,230,230)',
              color: 'rgb(8,9,10)',
              fontSize: '15px',
              fontWeight: 510,
              borderRadius: '4px',
              border: '1px solid rgb(230,230,230)',
              boxShadow:
                'rgba(0,0,0,0) 0px 8px 2px, rgba(0,0,0,0.01) 0px 5px 2px, rgba(0,0,0,0.04) 0px 3px 2px, rgba(0,0,0,0.07) 0px 1px 1px, rgba(0,0,0,0.08) 0px 0px 1px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter)',
              transition: 'background 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Get started
          </Link>

          <Link
            href="#"
            onMouseEnter={() => setSecondaryHovered(true)}
            onMouseLeave={() => setSecondaryHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              padding: '0 16px',
              background: secondaryHovered ? 'rgb(50,50,54)' : 'rgb(40,40,44)',
              color: 'rgb(247,248,248)',
              fontSize: '15px',
              fontWeight: 510,
              borderRadius: '4px',
              border: '1px solid rgb(62,62,68)',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter)',
              transition: 'background 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            Contact sales
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cta-heading {
            font-size: 32px !important;
            line-height: 36px !important;
          }
        }
      `}</style>
    </section>
  );
}
