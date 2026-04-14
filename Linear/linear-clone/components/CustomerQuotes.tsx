import Image from 'next/image';

export default function CustomerQuotes() {
  return (
    <section
      style={{
        background: 'rgb(8,9,10)',
        padding: '80px 0',
        width: '100%',
      }}
    >
      {/* Quotes grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          marginBottom: '48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
        className="quotes-grid"
      >
        {/* Dark card */}
        <div
          style={{
            background: 'rgb(18,19,22)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '280px',
          }}
        >
          <p
            style={{
              fontSize: '28px',
              fontWeight: 510,
              lineHeight: '36px',
              letterSpacing: '-0.56px',
              color: 'rgb(247,248,248)',
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}
          >
            You just have to use it and you will see, you will just feel it.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Image
              src="/images/avatar-gabriel.png"
              alt="Gabriel Peal"
              width={36}
              height={36}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 510,
                  lineHeight: '20px',
                  color: 'rgb(247,248,248)',
                }}
              >
                Gabriel Peal
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgb(138,143,152)',
                }}
              >
                OpenAI
              </div>
            </div>
          </div>
        </div>

        {/* Yellow card */}
        <div
          style={{
            background: 'rgb(255,230,0)',
            borderRadius: '12px',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '280px',
          }}
        >
          <p
            style={{
              fontSize: '28px',
              fontWeight: 510,
              lineHeight: '36px',
              letterSpacing: '-0.56px',
              color: 'rgb(8,9,10)',
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}
          >
            Our speed is intense and Linear helps us be action biased.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Image
              src="/images/avatar-nik.png"
              alt="Nik Koblov"
              width={36}
              height={36}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 510,
                  lineHeight: '20px',
                  color: 'rgb(8,9,10)',
                }}
              >
                Nik Koblov
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(8,9,10,0.6)',
                }}
              >
                Head of Engineering, Ramp
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social proof bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="social-proof-bar"
      >
        <p
          style={{
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgb(138,143,152)',
            margin: 0,
          }}
        >
          Linear powers over{' '}
          <span style={{ fontWeight: 590, color: 'rgb(247,248,248)' }}>
            25,000
          </span>{' '}
          product teams. From ambitious startups to major enterprises.
        </p>
        <a
          href="/customers"
          className="customer-stories-link"
          style={{
            fontSize: '14px',
            fontWeight: 510,
            color: 'rgb(138,143,152)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            marginLeft: '32px',
            transition: 'color 0.15s',
          }}
        >
          Customer stories →
        </a>
      </div>
    </section>
  );
}
