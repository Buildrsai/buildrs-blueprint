'use client';

import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      'Intake',
      'Plan',
      'Build',
      'Diffs',
      'Monitor',
      'Pricing',
      'Security',
    ],
  },
  {
    title: 'Features',
    links: [
      'Asks',
      'Agents',
      'Customer Requests',
      'Insights',
      'Mobile',
      'Integrations',
      'Changelog',
    ],
  },
  {
    title: 'Company',
    links: [
      'About',
      'Customers',
      'Careers',
      'Blog',
      'Method',
      'Quality',
      'Brand',
    ],
  },
  {
    title: 'Resources',
    links: [
      'Switch',
      'Download',
      'Docs',
      'Developers',
      'Status',
      'Enterprise',
      'Startups',
    ],
  },
  {
    title: 'Connect',
    links: [
      'Contact us',
      'Community',
      'X (Twitter)',
      'GitHub',
      'YouTube',
    ],
  },
];

function FooterLink({ label }: { label: string }) {
  return (
    <Link
      href="#"
      style={{
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '28px',
        color: 'rgb(98,102,109)',
        display: 'block',
        textDecoration: 'none',
        fontFamily: 'var(--font-inter)',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'rgb(247,248,248)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgb(98,102,109)';
      }}
    >
      {label}
    </Link>
  );
}

function LegalLink({ label }: { label: string }) {
  return (
    <Link
      href="#"
      style={{
        fontSize: '13px',
        color: 'rgb(62,66,72)',
        textDecoration: 'none',
        fontFamily: 'var(--font-inter)',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'rgb(138,143,152)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgb(62,66,72)';
      }}
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: 'rgb(8,9,10)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '64px 0 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Top: logo + columns */}
        <div
          className="footer-top"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '80px',
            marginBottom: '64px',
            alignItems: 'flex-start',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '16px',
              fontWeight: 590,
              color: 'rgb(247,248,248)',
              fontFamily: 'var(--font-inter)',
              flexShrink: 0,
            }}
          >
            Linear
          </div>

          {/* Columns grid */}
          <div
            className="footer-columns"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '32px',
              flex: 1,
            }}
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3
                  style={{
                    fontSize: '12px',
                    fontWeight: 510,
                    lineHeight: '20px',
                    letterSpacing: '0.12px',
                    color: 'rgb(247,248,248)',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    marginTop: 0,
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  {col.title}
                </h3>
                {col.links.map((link) => (
                  <FooterLink key={link} label={link} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: copyright + legal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              color: 'rgb(62,66,72)',
              fontFamily: 'var(--font-inter)',
            }}
          >
            2025 Linear Orbit, Inc.
          </span>

          <div
            style={{
              display: 'flex',
              gap: '24px',
            }}
          >
            <LegalLink label="Privacy" />
            <LegalLink label="Terms" />
            <LegalLink label="DPA" />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column !important;
            gap: 40px !important;
          }
          .footer-columns {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  );
}
