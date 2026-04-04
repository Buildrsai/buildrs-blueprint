import { useState, useEffect } from 'react'
import { ChevronRight, Copy, Check } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PRODUCTS_CATALOG } from '../../../data/products-catalog'

interface BrickData {
  id: string
  title: string
  content_md: string
  template_code: string | null
  external_links: { label: string; url: string }[] | null
  bloc_id: string
}

interface BlocData {
  id: string
  title: string
  product_slug: string
}

interface Props {
  productSlug: string
  brickId: string
  navigate: (hash: string) => void
  isBrickCompleted: (id: string) => boolean
  markBrickComplete: (id: string) => Promise<void>
}

function MarkdownContent({ md }: { md: string }) {
  // Minimal markdown renderer: bold, italic, headings, paragraphs, newlines
  const lines = md.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-[15px] font-bold text-foreground mb-2 mt-5">{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-[17px] font-extrabold text-foreground mb-2 mt-6">{line.slice(3)}</h2>)
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-[20px] font-extrabold text-foreground mb-3 mt-6">{line.slice(2)}</h1>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="text-[13px] text-muted-foreground leading-relaxed mb-1 ml-4 list-disc">
          {renderInline(line.slice(2))}
        </li>
      )
    } else {
      elements.push(
        <p key={i} className="text-[13px] text-muted-foreground leading-relaxed mb-3">
          {renderInline(line)}
        </p>
      )
    }
    i++
  }
  return <div>{elements}</div>
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="text-[12px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))' }}>{part.slice(1, -1)}</code>
    return part
  })
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border"
        style={{ background: 'hsl(var(--secondary))' }}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prompt</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.5} />}
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre className="px-4 py-3 text-[12px] font-mono text-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap"
        style={{ background: 'hsl(var(--background))' }}>
        {code}
      </pre>
    </div>
  )
}

export function BrickPage({ productSlug, brickId, navigate, isBrickCompleted, markBrickComplete }: Props) {
  const [brick, setBrick]   = useState<BrickData | null>(null)
  const [bloc, setBloc]     = useState<BlocData | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  const product = PRODUCTS_CATALOG.find(p => p.slug === productSlug)
  const done    = isBrickCompleted(brickId)

  useEffect(() => {
    ;(async () => {
      const { data: brickData } = await supabase
        .from('content_bricks')
        .select('id, title, content_md, template_code, external_links, bloc_id')
        .eq('id', brickId)
        .maybeSingle()

      if (brickData) {
        setBrick(brickData)
        const { data: blocData } = await supabase
          .from('content_blocs')
          .select('id, title, product_slug')
          .eq('id', brickData.bloc_id)
          .maybeSingle()
        if (blocData) setBloc(blocData)
      }
      setLoading(false)
    })()
  }, [brickId])

  const handleMarkComplete = async () => {
    setMarking(true)
    await markBrickComplete(brickId)
    setMarking(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
          ))}
        </div>
      </div>
    )
  }

  if (!brick) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Brique introuvable.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-6 flex-wrap">
        <button onClick={() => navigate('#/dashboard/produits')} className="hover:text-foreground transition-colors">
          Nos produits
        </button>
        <ChevronRight size={10} strokeWidth={1.5} />
        <button onClick={() => navigate(`#/dashboard/produit/${productSlug}`)} className="hover:text-foreground transition-colors">
          {product?.shortName ?? productSlug}
        </button>
        {bloc && (
          <>
            <ChevronRight size={10} strokeWidth={1.5} />
            <span>{bloc.title}</span>
          </>
        )}
        <ChevronRight size={10} strokeWidth={1.5} />
        <span className="text-foreground font-medium truncate max-w-[160px]">{brick.title}</span>
      </div>

      {/* Title */}
      <h1 className="text-[22px] font-extrabold text-foreground tracking-tight mb-5">{brick.title}</h1>

      {/* Content */}
      {brick.content_md && (
        <div className="mb-6">
          <MarkdownContent md={brick.content_md} />
        </div>
      )}

      {/* Template / Prompt */}
      {brick.template_code && (
        <div className="mb-6">
          <CodeBlock code={brick.template_code} />
        </div>
      )}

      {/* External links */}
      {brick.external_links && brick.external_links.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Liens utiles</p>
          <div className="flex flex-col gap-2">
            {brick.external_links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] font-medium text-foreground hover:opacity-75 transition-opacity"
              >
                <ChevronRight size={13} strokeWidth={1.5} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mark complete */}
      <div className="pt-6 border-t border-border">
        {done ? (
          <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: '#22c55e' }}>
            <Check size={16} strokeWidth={2} />
            Brique terminée
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={marking}
            className="w-full rounded-xl py-3.5 text-[14px] font-bold transition-all duration-150"
            style={{
              background: marking ? 'hsl(var(--secondary))' : 'hsl(var(--foreground))',
              color: marking ? 'hsl(var(--muted-foreground))' : 'hsl(var(--background))',
            }}
          >
            {marking ? 'Enregistrement...' : 'Marquer comme terminé →'}
          </button>
        )}

        <button
          onClick={() => navigate(`#/dashboard/produit/${productSlug}`)}
          className="mt-3 w-full text-center text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Retour au produit
        </button>
      </div>
    </div>
  )
}
