import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import type { Project } from '../../hooks/useActiveProject'

const C = {
  s1: '#0f1015', s2: '#15161d', b1: '#1e2030',
  t: '#f0f0f5', tm: '#9399b2', td: '#5b6078',
  green: '#22c55e',
} as const

const STATUS_LABEL: Record<Project['status'], string> = {
  idea: 'Idée', building: 'En construction', live: 'Live',
}
const STATUS_COLOR: Record<Project['status'], string> = {
  idea: '#eab308', building: '#6366f1', live: '#22c55e',
}

interface Props {
  activeProject: Project | null
  projects: Project[]
  setActiveProject: (p: Project) => Promise<void>
  loading?: boolean
}

export function ProjectSwitcher({ activeProject, projects, setActiveProject, loading }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  if (loading) {
    return <div style={{ height: 36, borderRadius: 8, background: C.b1, opacity: 0.5 }} />
  }

  if (projects.length === 0) {
    return (
      <div style={{ padding: '9px 12px', borderRadius: 8, background: C.s2, border: `1px solid ${C.b1}`, fontSize: 12, color: C.td, fontFamily: 'Geist, sans-serif' }}>
        Aucun projet — crée-en un dans Mes Projets
      </div>
    )
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: 8,
          background: C.s2, border: `1px solid ${open ? '#2a2d3e' : C.b1}`,
          cursor: 'pointer', transition: '.2s', textAlign: 'left',
        }}
      >
        {activeProject ? (
          <>
            <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: STATUS_COLOR[activeProject.status] }} />
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: C.t, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Geist, sans-serif' }}>
              {activeProject.name}
            </span>
            <ChevronDown size={12} style={{ flexShrink: 0, color: C.td, transform: open ? 'rotate(180deg)' : 'none', transition: '.2s' }} />
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontSize: 12, color: C.td, fontFamily: 'Geist, sans-serif' }}>Choisir un projet…</span>
            <ChevronDown size={12} style={{ flexShrink: 0, color: C.td }} />
          </>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: C.s1, border: `1px solid ${C.b1}`, borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 200,
          overflow: 'hidden',
        }}>
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => { setActiveProject(p); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', background: 'none', border: 'none',
                borderBottom: idx < projects.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer', textAlign: 'left', transition: '.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: STATUS_COLOR[p.status] }} />
              <span style={{ flex: 1, fontSize: 12, color: C.t, fontFamily: 'Geist, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </span>
              <span style={{ fontSize: 10, color: STATUS_COLOR[p.status], fontFamily: 'Geist Mono, monospace', flexShrink: 0, marginRight: 4 }}>
                {STATUS_LABEL[p.status]}
              </span>
              {activeProject?.id === p.id && <Check size={11} style={{ color: C.green, flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
