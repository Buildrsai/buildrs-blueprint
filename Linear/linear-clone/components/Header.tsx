'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Product', href: '/product' },
  { label: 'Resources', href: '/resources' },
  { label: 'Customers', href: '/customers' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Now', href: '/now' },
  { label: 'Contact', href: '/contact' },
  { label: 'Docs', href: '/docs' },
];

export default function Header() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [loginHovered, setLoginHovered] = useState(false);
  const [signupHovered, setSignupHovered] = useState(false);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '73px',
        background:
          'linear-gradient(rgba(11,11,11,0.8) 0%, rgba(11,11,11,0.762) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1436px',
          margin: '0 auto',
          padding: '0 32px',
          height: '73px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="8" fill="rgb(247,248,248)" />
          </svg>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 590,
              color: 'rgb(247,248,248)',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '-0.2px',
            }}
          >
            Linear
          </span>
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: '8px',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredNav(item.label)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                fontSize: '14px',
                fontWeight: 510,
                color:
                  hoveredNav === item.label
                    ? 'rgb(247,248,248)'
                    : 'rgb(138,143,152)',
                padding: '0 12px',
                height: '73px',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
                fontFamily: 'var(--font-inter)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '0',
            flexShrink: 0,
          }}
        >
          {/* Open app — hidden on mobile */}
          <Link
            href="/app"
            className="hide-mobile"
            style={{
              fontSize: '14px',
              fontWeight: 510,
              color: 'rgb(247,248,248)',
              padding: '0 12px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter)',
              whiteSpace: 'nowrap',
            }}
          >
            Open app
          </Link>

          {/* Log in */}
          <Link
            href="/login"
            onMouseEnter={() => setLoginHovered(true)}
            onMouseLeave={() => setLoginHovered(false)}
            style={{
              fontSize: '14px',
              fontWeight: 510,
              color: loginHovered ? 'rgb(247,248,248)' : 'rgb(138,143,152)',
              padding: '0 8px',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              fontFamily: 'var(--font-inter)',
              whiteSpace: 'nowrap',
            }}
          >
            Log in
          </Link>

          {/* Sign up */}
          <Link
            href="/signup"
            onMouseEnter={() => setSignupHovered(true)}
            onMouseLeave={() => setSignupHovered(false)}
            style={{
              fontSize: '13px',
              fontWeight: 510,
              lineHeight: '32px',
              height: '32px',
              padding: '0 12px',
              background: signupHovered ? 'rgb(255,255,255)' : 'rgb(230,230,230)',
              color: 'rgb(8,9,10)',
              borderRadius: '4px',
              border: '1px solid rgb(230,230,230)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
              fontFamily: 'var(--font-inter)',
              marginLeft: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
