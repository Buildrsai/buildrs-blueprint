function RobotJarvis({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="5" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
      <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="7" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="15" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
      <rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
    </svg>
  )
}

export function JarvisThinkingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ flexShrink: 0, marginTop: 4 }}>
        <RobotJarvis size={28} />
      </div>
      <div style={{
        background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))',
        borderRadius: '2px 14px 14px 14px',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>Jarvis analyse</span>
        <span style={{ display: 'flex', gap: 4, marginLeft: 2 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#6366f1', display: 'inline-block',
                animation: `jv-think 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </span>
      </div>
      <style>{`
        @keyframes jv-think { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes jv-msgin { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
