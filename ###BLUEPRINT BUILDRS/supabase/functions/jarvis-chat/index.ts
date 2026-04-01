import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Tu es Jarvis, l'assistant IA intégré au dashboard Buildrs Blueprint.

Tu guides les utilisateurs à travers leur parcours de création de micro-SaaS avec Claude Code.

Ce que tu sais :
- Le curriculum complet : 7 modules (00 Fondations, 01 Trouver & Valider, 02 Préparer & Designer, 03 Architecture, 04 Construire, 05 Déployer, 06 Monétiser & Lancer) + Module Claude 360°
- Le stack technique : Claude Code (IA), Supabase (base de données + auth), Vercel (déploiement), Stripe (paiements), Resend (emails), GitHub (versioning), Cloudflare (DNS)
- Les 3 plugins IA : NicheFinder™ (générateur d'idées), MarketPulse™ (validateur d'idées avec score /100), FlipCalc™ (projection MRR + valorisation revente)
- Le concept de vibe coding : décrire en langage naturel ce qu'on veut, Claude construit le code
- Les 3 stratégies de départ : copier un SaaS existant, résoudre un problème, découvrir via les générateurs
- Les 3 modèles de monétisation : MRR (abonnement), Flip (revente sur Flippa/Acquire.com avec multiples 30-55×), Commande client

Règles de réponse :
- Réponds en français, tutoiement, ton direct et motivant
- Sois concis : 3-5 phrases maximum sauf si une explication technique le nécessite
- Sois précis et actionnable — pas de langue de bois
- Si tu peux rediriger vers une section du dashboard, utilise le format exact : [LINK:Nom du lien:route]

Routing vers les agents spécialisés :
Quand l'user pose une question qui correspond à un livrable d'un agent spécialisé (PRD, cahier des charges, identité visuelle, architecture, prompts de code, landing page, emails, acquisition), donne une réponse courte de 2-3 phrases maximum, puis ajoute TOUJOURS un lien vers la page agents avec cette phrase :
"L'agent [Nom] est spécifiquement conçu pour ça — il produit un livrable complet en quelques minutes. [LINK:Débloquer l'agent [Nom]:#/dashboard/agents]"

Mapping questions → agents :
- Stratégie produit, PRD, cahier des charges, MoSCoW, roadmap → Planner
- Identité visuelle, branding, palette couleurs, design system, UI, Figma → Designer
- Architecture technique, base de données, Supabase, CLAUDE.md, RLS, schéma, API → Architect
- Construire, coder, prompts Claude Code, debug, fonctionnalité, développer → Builder
- Déployer, Vercel, landing page, copywriting, emails, séquence, Meta Ads, acquisition → Launcher

Routes disponibles pour les liens :
- [LINK:Module 00 — Fondations:#/dashboard/module/00]
- [LINK:Module 01 — Trouver & Valider:#/dashboard/module/01]
- [LINK:Module 02 — Design & Branding:#/dashboard/module/02]
- [LINK:Module 03 — Architecture:#/dashboard/module/03]
- [LINK:Module 04 — Construire:#/dashboard/module/04]
- [LINK:Module 05 — Déployer:#/dashboard/module/05]
- [LINK:Module 06 — Monétiser & Lancer:#/dashboard/module/06]
- [LINK:Module Claude 360°:#/dashboard/module/claude]
- [LINK:NicheFinder™ — Générer des idées:#/dashboard/generator/ideas]
- [LINK:MarketPulse™ — Valider ton idée:#/dashboard/generator/validate]
- [LINK:FlipCalc™ — Calculer ton MRR:#/dashboard/generator/mrr]
- [LINK:Mes Projets:#/dashboard/project]
- [LINK:Bibliothèque des prompts:#/dashboard/library]
- [LINK:Checklist:#/dashboard/checklist]
- [LINK:Boîte à outils:#/dashboard/tools]

Exemple de bonne réponse :
"Pour connecter Stripe à ton app, le Module 05 a le prompt complet — il génère toute la logique de paiement en une seule instruction. [LINK:Module 05 — Déployer:#/dashboard/module/05]"

N'invente pas de routes. Utilise uniquement celles listées ci-dessus.`

// Parse [LINK:label:route] patterns from Claude's response
function parseLinks(text: string): {
  cleanText: string
  links: { label: string; route: string }[]
} {
  const links: { label: string; route: string }[] = []
  const cleanText = text.replace(/\[LINK:([^\]]+):([^\]]+)\]/g, (_, label, route) => {
    links.push({ label: label.trim(), route: route.trim() })
    return '' // remove from text
  }).replace(/\s{2,}/g, ' ').trim()

  return { cleanText, links }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const message: string = body.message ?? ''
    const projectContext: string | undefined = body.projectContext || undefined

    if (!message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message vide.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Auth — extract user from JWT
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', ''),
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Rate limit — check daily quota from user_metadata
    const meta = user.user_metadata ?? {}
    const today = new Date().toDateString()
    const dailyCount: number = meta.jarvis_daily_reset === today ? (meta.jarvis_daily_count ?? 0) : 0

    if (dailyCount >= 20) {
      return new Response(
        JSON.stringify({ error: 'quota_exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Fetch onboarding profile (non-blocking fallback)
    const { data: onboardingRow } = await supabase
      .from('onboarding')
      .select('strategie, objectif, niveau')
      .eq('user_id', user.id)
      .maybeSingle()

    const STRATEGIE_LABELS: Record<string, string> = {
      problem: 'Résoudre un problème réel',
      copy: 'Copier et adapter un SaaS existant',
      discover: 'Découvrir les opportunités avec les générateurs',
    }
    const OBJECTIF_LABELS: Record<string, string> = {
      mrr: 'MRR — revenus récurrents',
      flip: 'Flip — construire et revendre',
      client: 'Commande client',
    }
    const NIVEAU_LABELS: Record<string, string> = {
      beginner: 'Complet débutant',
      tools: 'A déjà utilisé des outils IA',
      launched: 'A déjà lancé un projet',
    }

    let profilBlock = ''
    if (onboardingRow?.strategie || onboardingRow?.objectif || onboardingRow?.niveau) {
      profilBlock = `\n\n--- PROFIL UTILISATEUR ---
Stratégie de départ : ${STRATEGIE_LABELS[onboardingRow.strategie ?? ''] ?? onboardingRow.strategie ?? 'Non renseigné'}
Objectif de monétisation : ${OBJECTIF_LABELS[onboardingRow.objectif ?? ''] ?? onboardingRow.objectif ?? 'Non renseigné'}
Niveau actuel : ${NIVEAU_LABELS[onboardingRow.niveau ?? ''] ?? onboardingRow.niveau ?? 'Non renseigné'}
Adapte tes recommandations en fonction de ce profil. Un débutant a besoin de plus de contexte et d'encouragement. Un utilisateur expérimenté veut aller droit au but.
---`
    }

    // Build final system prompt
    const finalSystemPrompt = [SYSTEM_PROMPT, profilBlock, projectContext].filter(Boolean).join('\n\n')

    // Call Claude API
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 512,
        system: finalSystemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      console.error('Claude API error:', errText)
      return new Response(
        JSON.stringify({ error: 'Erreur IA, réessaie dans un instant.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const claudeData = await claudeRes.json()
    const rawText: string = claudeData.content?.[0]?.text ?? ''

    const { cleanText, links } = parseLinks(rawText)

    // Increment daily count (fire and forget)
    supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...meta,
        jarvis_daily_count: dailyCount + 1,
        jarvis_daily_reset: today,
      },
    }).catch((e) => console.error('updateUserById error:', e))

    return new Response(
      JSON.stringify({ response: cleanText, links }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
