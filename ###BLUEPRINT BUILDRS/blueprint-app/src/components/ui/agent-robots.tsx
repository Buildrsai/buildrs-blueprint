// LEGACY : ces 6 robots (Validator/Planner/Designer/Architect/Builder/Launcher)
// datent de l'ancien système de 6 agents. Ils sont conservés comme illustrations
// décoratives sur la LP et les pages checkout. Pour le nouveau Pack Agents V1
// (Jarvis/Planner/Designer/DB Architect/Builder/Connector/Launcher), utiliser
// les 7 SVG situés dans /public/agents-logos/.
//
// Pixel-art SVG robots (space invader style, viewBox 0 0 24 24).
// Historique : partagés avec AgentsPage / AgentHandoffBlock / AgentChatPage —
// ces trois consommateurs ont été archivés le 2026-04-17 (Phase 0).
// Consommateurs actifs restants : LandingPage.tsx, CheckoutPage.tsx,
// ClaudeOTOPage.tsx (illustrations only).

export function RobotValidator({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="2" height="4" fill="#4ade80"/>
      <rect x="18" y="0" width="2" height="4" fill="#4ade80"/>
      <rect x="3" y="0" width="4" height="2" fill="#22c55e"/>
      <rect x="17" y="0" width="4" height="2" fill="#22c55e"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#22c55e"/>
      <rect x="6" y="7" width="4" height="3" rx="1" fill="#dcfce7"/>
      <rect x="14" y="7" width="4" height="3" rx="1" fill="#dcfce7"/>
      <rect x="8" y="8" width="2" height="2" fill="#14532d"/>
      <rect x="16" y="8" width="2" height="2" fill="#14532d"/>
      <rect x="8" y="12" width="2" height="2" fill="#15803d"/>
      <rect x="10" y="13" width="4" height="2" fill="#15803d"/>
      <rect x="14" y="12" width="2" height="2" fill="#15803d"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#15803d"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#15803d"/>
    </svg>
  )
}

export function RobotPlanner({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="0" width="4" height="2" fill="#93c5fd"/>
      <rect x="11" y="1" width="2" height="4" fill="#60a5fa"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#3b82f6"/>
      <rect x="5" y="6" width="14" height="5" rx="1" fill="#1e3a5f"/>
      <rect x="6" y="7" width="4" height="3" fill="#bfdbfe"/>
      <rect x="14" y="7" width="4" height="3" fill="#bfdbfe"/>
      <rect x="8" y="13" width="8" height="2" rx="1" fill="#1d4ed8"/>
      <rect x="10" y="13" width="1" height="2" fill="#3b82f6"/>
      <rect x="13" y="13" width="1" height="2" fill="#3b82f6"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#1d4ed8"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#1d4ed8"/>
      <rect x="1" y="6" width="3" height="6" rx="1" fill="#1d4ed8"/>
      <rect x="20" y="6" width="3" height="6" rx="1" fill="#1d4ed8"/>
    </svg>
  )
}

export function RobotDesigner({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="1" width="2" height="4" fill="#fb7185"/>
      <rect x="9" y="0" width="2" height="2" fill="#fda4af"/>
      <rect x="13" y="0" width="2" height="2" fill="#fda4af"/>
      <rect x="11" y="0" width="2" height="1" fill="#fecdd3"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#f43f5e"/>
      <circle cx="9" cy="9" r="3" fill="#ffe4e6"/>
      <circle cx="15" cy="9" r="3" fill="#ffe4e6"/>
      <circle cx="9" cy="9" r="1.5" fill="#881337"/>
      <circle cx="15" cy="9" r="1.5" fill="#881337"/>
      <circle cx="10" cy="8" r="0.7" fill="white"/>
      <circle cx="16" cy="8" r="0.7" fill="white"/>
      <rect x="8" y="13" width="8" height="2" rx="1" fill="#9f1239"/>
      <rect x="1" y="7" width="3" height="4" rx="1" fill="#e11d48"/>
      <rect x="20" y="7" width="3" height="4" rx="1" fill="#e11d48"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#be123c"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#be123c"/>
    </svg>
  )
}

export function RobotArchitect({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0" width="2" height="4" fill="#fdba74"/>
      <rect x="11" y="0" width="2" height="3" fill="#fb923c"/>
      <rect x="15" y="0" width="2" height="4" fill="#fdba74"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#f97316"/>
      <rect x="5" y="7" width="5" height="4" rx="1" fill="#fff7ed"/>
      <rect x="14" y="7" width="5" height="4" rx="1" fill="#fff7ed"/>
      <rect x="7" y="8" width="2" height="2" fill="#7c2d12"/>
      <rect x="16" y="8" width="2" height="2" fill="#7c2d12"/>
      <rect x="7" y="13" width="10" height="2" fill="#c2410c"/>
      <rect x="9" y="13" width="1.5" height="2" fill="#f97316"/>
      <rect x="12" y="13" width="1.5" height="2" fill="#f97316"/>
      <rect x="1" y="5" width="3" height="8" rx="1" fill="#c2410c"/>
      <rect x="20" y="5" width="3" height="8" rx="1" fill="#c2410c"/>
      <rect x="5" y="17" width="5" height="5" rx="1" fill="#c2410c"/>
      <rect x="14" y="17" width="5" height="5" rx="1" fill="#c2410c"/>
    </svg>
  )
}

export function RobotBuilder({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="0" width="2" height="5" fill="#a78bfa"/>
      <rect x="9" y="1" width="6" height="2" fill="#8b5cf6"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#8b5cf6"/>
      <line x1="6" y1="7" x2="10" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="7" x2="6" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="14" y1="7" x2="18" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18" y1="7" x2="14" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 14 L9 12.5 L11 14 L13 12.5 L15 14 L17 12.5" stroke="#5b21b6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="1" y="6" width="3" height="6" rx="1" fill="#7c3aed"/>
      <rect x="20" y="6" width="3" height="6" rx="1" fill="#7c3aed"/>
      <rect x="5" y="17" width="4" height="5" rx="1" fill="#6d28d9"/>
      <rect x="15" y="17" width="4" height="5" rx="1" fill="#6d28d9"/>
      <rect x="2" y="13" width="2" height="3" rx="1" fill="#7c3aed"/>
      <rect x="20" y="13" width="2" height="3" rx="1" fill="#7c3aed"/>
    </svg>
  )
}

export function RobotLauncher({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,0 14,3 10,3" fill="#5eead4"/>
      <rect x="11" y="2" width="2" height="3" fill="#2dd4bf"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#14b8a6"/>
      <polygon points="8,9 10,7 12,9 10,11" fill="#ccfbf1"/>
      <polygon points="12,9 14,7 16,9 14,11" fill="#ccfbf1"/>
      <circle cx="10" cy="9" r="1" fill="#134e4a"/>
      <circle cx="14" cy="9" r="1" fill="#134e4a"/>
      <rect x="8" y="13" width="8" height="2" rx="1" fill="#0d9488"/>
      <rect x="10" y="13.5" width="4" height="1" rx="0.5" fill="#5eead4"/>
      <rect x="1" y="6" width="3" height="7" rx="1" fill="#0f766e"/>
      <rect x="20" y="6" width="3" height="7" rx="1" fill="#0f766e"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#0f766e"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#0f766e"/>
      <rect x="6" y="21" width="2" height="2" fill="#2dd4bf"/>
      <rect x="16" y="21" width="2" height="2" fill="#2dd4bf"/>
    </svg>
  )
}

export function RobotJarvis({ size = 48 }: { size?: number }) {
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
