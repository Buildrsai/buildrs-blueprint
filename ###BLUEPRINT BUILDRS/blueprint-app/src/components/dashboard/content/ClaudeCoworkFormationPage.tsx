import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Smartphone, ChevronRight } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

// ── Shared sub-components ──────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <div className="relative rounded-xl overflow-hidden my-4" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.09)' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: '#5b6078' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={doCopy}
        className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', color: copied ? '#22c55e' : '#5b6078' }}
      >
        {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
        <span className="text-[10px] font-medium">{copied ? 'Copié' : 'Copier'}</span>
      </button>
    </div>
  )
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const s = type === 'warning'
    ? { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)', color: '#eab308', label: 'IMPORTANT' }
    : type === 'success'
    ? { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', color: '#22c55e', label: 'BUILDRS' }
    : { bg: 'rgba(77,150,255,0.06)', border: 'rgba(77,150,255,0.2)', color: '#4d96ff', label: 'NOTE' }
  return (
    <div className="rounded-xl px-4 py-3.5 my-4" style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: s.color }}>{s.label}</p>
      <div className="text-[12.5px] leading-relaxed" style={{ color: '#9399b2' }}>{children}</div>
    </div>
  )
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-12 mb-6 pt-10" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
      <span className="text-[10px] font-black tabular-nums px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.25)', letterSpacing: '0.03em' }}>
        {num}
      </span>
      <h2 className="text-[17px] font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.025em' }}>{title}</h2>
    </div>
  )
}

function SubTitle({ title }: { title: string }) {
  return <h3 className="text-[13px] font-bold mb-3 mt-7" style={{ color: '#f0f0f5', letterSpacing: '-0.015em' }}>{title}</h3>
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#9399b2' }}>{children}</p>
}

// ── Use case card ──────────────────────────────────────────────────────────

function UseCaseCard({
  num, title, children, result,
}: {
  num: string
  title: string
  children: React.ReactNode
  result: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:opacity-80"
      >
        <span className="text-[10px] font-black flex-shrink-0 px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontFamily: 'Geist Mono, monospace', border: '0.5px solid rgba(34,197,94,0.25)' }}>
          {num}
        </span>
        <p className="text-[13px] font-semibold flex-1" style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}>{title}</p>
        <ChevronRight size={14} strokeWidth={1.5} style={{ color: '#5b6078', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
      {open && (
        <div className="px-4 pb-4" style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <div className="pt-4">{children}</div>
          <div className="mt-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.15)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: '#22c55e' }}>Résultat</p>
            <p className="text-[12px]" style={{ color: '#9399b2' }}>{result}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Plugin card ────────────────────────────────────────────────────────────

function PluginCard({
  title, desc, connectors, example, exampleLabel,
}: {
  title: string
  desc: string
  connectors: string[]
  example: string
  exampleLabel?: string
}) {
  return (
    <div className="rounded-xl overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
      <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[13px] font-bold mb-1" style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}>{title}</p>
        <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#5b6078' }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {connectors.map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#9399b2', border: '0.5px solid rgba(255,255,255,0.08)' }}>
              {c}
            </span>
          ))}
        </div>
      </div>
      <CodeBlock code={example} label={exampleLabel ?? 'Exemple'} />
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export function ClaudeCoworkFormationPage({ navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour à Claude OS</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md" style={{ background: 'rgba(77,150,255,0.12)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}>
              Formation
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold mb-3" style={{ color: '#f0f0f5', letterSpacing: '-0.035em' }}>
            Claude Cowork
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: '#9399b2' }}>
            L'agent IA qui travaille sur tes fichiers pendant que toi, tu pilotes ton business.
            Pas de terminal, pas de code — juste des résultats.
          </p>
        </div>

        {/* ── Section 01 ─────────────────────────────────────────────────── */}
        <SectionTitle num="01" title="Pourquoi Cowork est essentiel dans le système Buildrs" />

        <Body>
          Claude Code build ton SaaS. Cowork gère <strong style={{ color: '#f0f0f5' }}>tout le reste</strong>.
        </Body>

        <Body>
          Claude Cowork est un agent autonome intégré dans l'app Claude Desktop qui accède directement à tes fichiers locaux. Tu lui décris ce que tu veux, il exécute : il crée des documents, organise tes dossiers, analyse tes données, rédige tes rapports, traite tes factures — sans que tu ouvres un terminal.
        </Body>

        <SubTitle title="Cowork vs Claude Chat classique" />
        <Body>
          Dans un chat classique, tu uploades un fichier, Claude répond en texte, et tu copies-colles le résultat toi-même. Avec Cowork, Claude agit directement sur tes fichiers : il crée de vrais documents Excel avec des formules qui fonctionnent, des présentations PowerPoint mises en page, des documents Word formatés. Le dossier devient le contexte, Claude produit le résultat là où tu en as besoin.
        </Body>

        <SubTitle title="Cowork vs Claude Code" />

        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-2">
            <div className="p-4" style={{ background: 'rgba(77,150,255,0.04)', borderRight: '0.5px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#4d96ff' }}>Claude Code</p>
              <ul className="space-y-1.5">
                {['Terminal & ligne de commande', 'Développeurs & builders', 'Code, Git, déploiement', 'Projets SaaS'].map(t => (
                  <li key={t} className="text-[12px]" style={{ color: '#9399b2' }}>— {t}</li>
                ))}
              </ul>
            </div>
            <div className="p-4" style={{ background: 'rgba(34,197,94,0.04)' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#22c55e' }}>Claude Cowork</p>
              <ul className="space-y-1.5">
                {['Interface graphique, zéro terminal', 'Knowledge workers & solopreneurs', 'Fichiers, documents, analyse', 'Gestion du business autour du SaaS'].map(t => (
                  <li key={t} className="text-[12px]" style={{ color: '#9399b2' }}>— {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Callout type="success">
          Dans le système Buildrs : tu utilises Claude Code pour construire ton SaaS, et Cowork pour gérer ton business autour — documents, analyses de marché, présentations, reporting, veille concurrentielle, gestion administrative.
        </Callout>

        <SubTitle title="Ce que Cowork change concrètement" />
        <Body>
          Tu peux empiler plusieurs tâches et laisser Claude les traiter en parallèle. Tu peux même lui envoyer des instructions depuis ton téléphone via <strong style={{ color: '#f0f0f5' }}>Dispatch</strong> et retrouver le travail terminé sur ton ordinateur. C'est un vrai collaborateur qui tourne en arrière-plan pendant que tu te concentres sur la stratégie.
        </Body>

        {/* ── Section 02 ─────────────────────────────────────────────────── */}
        <SectionTitle num="02" title="Installer et démarrer Cowork en 3 minutes" />

        <SubTitle title="Ce qu'il te faut" />
        <div className="space-y-2 my-4">
          {[
            { label: 'Un ordinateur', desc: 'Mac ou Windows' },
            { label: 'Claude Desktop', desc: 'Téléchargeable sur claude.com/download' },
            { label: 'Abonnement Claude payant', desc: 'Pro à 20$/mois minimum' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
              <p className="text-[12px]"><span className="font-semibold" style={{ color: '#f0f0f5' }}>{item.label}</span> <span style={{ color: '#5b6078' }}>— {item.desc}</span></p>
            </div>
          ))}
        </div>

        <SubTitle title="3 étapes pour démarrer" />
        <div className="space-y-3 my-4">
          {[
            { step: '1', title: 'Télécharge et installe Claude Desktop', desc: 'Sur claude.com/download. Disponible Mac et Windows.' },
            { step: '2', title: 'Ouvre l\'app et sélectionne Cowork', desc: 'Connecte-toi, puis choisis l\'onglet Cowork dans le sélecteur de mode.' },
            { step: '3', title: 'Accorde l\'accès à un dossier', desc: 'Claude ne voit que le dossier que tu autorises — le reste de ton disque est isolé.' },
          ].map(item => (
            <div key={item.step} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <span className="text-[13px] font-black flex-shrink-0" style={{ color: '#22c55e', fontFamily: 'Geist Mono, monospace' }}>{item.step}</span>
              <div>
                <p className="text-[13px] font-bold mb-1" style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}>{item.title}</p>
                <p className="text-[12px]" style={{ color: '#5b6078' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="success">
          Crée un dossier dédié par projet SaaS. Par exemple <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/Buildrs/MonSaaS/</code> avec des sous-dossiers <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/docs</code>, <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/data</code>, <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/marketing</code>, <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/legal</code>. Cowork ne voit que le dossier autorisé.
        </Callout>

        {/* ── Section 03 ─────────────────────────────────────────────────── */}
        <SectionTitle num="03" title="Les 8 use cases Buildrs pour Cowork" />

        <Body>
          On ne va pas lister 10 cas d'usage génériques. Voici les 8 qu'on utilise réellement chez Buildrs pour gérer un business SaaS. Clique pour voir le prompt exact.
        </Body>

        <div className="space-y-2 my-4">

          <UseCaseCard
            num="01"
            title="Analyse de marché et veille concurrentielle"
            result="Un fichier Excel complet avec l'analyse comparative et les opportunités, directement dans ton dossier. Ce qui te prendrait une journée est fait en quelques minutes."
          >
            <CodeBlock
              code={`Analyse les 5 fichiers de ce dossier (notes concurrents).
Pour chaque concurrent, extrais :
- Nom et URL
- Proposition de valeur principale
- Pricing (plans et prix)
- Points forts d'après les avis
- Points faibles et plaintes récurrentes
- Canal d'acquisition principal

Produis un tableau comparatif Excel avec une colonne par concurrent
et une ligne par critère. Ajoute une feuille "Opportunités"
avec les gaps identifiés qu'on pourrait exploiter.
Sauvegarde sous le nom "analyse-concurrentielle-[date].xlsx"`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="02"
            title="Créer une présentation investisseurs / pitch deck"
            result="Une présentation PowerPoint complète, formatée, avec les données structurées. Tu n'as plus qu'à personnaliser les chiffres et ajouter les screenshots."
          >
            <CodeBlock
              code={`Crée une présentation PowerPoint de 12 slides pour un pitch investisseurs.
Mon SaaS : [nom] - [description en 1 ligne]
MRR actuel : [X]€/mois — Utilisateurs : [X]

Structure :
1. Problème (avec chiffres marché)
2. Solution (notre produit)
3. Démo / Screenshots (placeholder)
4. Taille du marché (TAM/SAM/SOM)
5. Business model (pricing)
6. Traction (MRR, croissance, users)
7. Acquisition (canaux, CAC, LTV)
8. Concurrence (matrice positionnement)
9. Roadmap produit (6 prochains mois)
10. Équipe
11. Financials (projections 3 ans)
12. Ask (montant levée + utilisation)

Design sobre, fond blanc, texte noir, accent bleu.
Sauvegarde sous "pitch-deck-[nom]-[date].pptx"`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="03"
            title="Traitement des factures et comptabilité"
            result="Tous tes reçus renommés proprement + un fichier comptable Excel complet avec formules. Le travail d'un après-midi en 5 minutes."
          >
            <CodeBlock
              code={`Dans le dossier /factures-mars-2026/, tu trouveras
des PDF et des screenshots de reçus.
Pour chaque document :
- Extrais : date, fournisseur, montant HT, TVA, montant TTC, catégorie
- Renomme au format : AAAA-MM-JJ_Fournisseur_MontantEUR.pdf

Génère un fichier Excel "compta-mars-2026.xlsx" avec :
- Feuille 1 : toutes les écritures ligne par ligne
- Feuille 2 : totaux par catégorie
- Feuille 3 : récapitulatif TVA
Ajoute les formules de somme.`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="04"
            title="Rédaction de contenu marketing"
            result="4 articles de blog prêts à publier, optimisés SEO, directement dans ton dossier."
          >
            <CodeBlock
              code={`Rédige 4 articles de blog pour mon SaaS [nom] :

Article 1 : "5 problèmes que [cible] rencontre avec [problème]"
Article 2 : "Comment [solution] en [temps] avec [outil]"
Article 3 : "Guide complet : [sujet] pour [cible]"
Article 4 : "[Nombre] alternatives à [concurrent] en 2026"

Pour chaque article :
- 1500 mots minimum
- Ton : professionnel mais accessible, tutoiement
- Structure : intro accroche, H2/H3, exemples concrets, CTA final
- SEO : intègre les mots-clés [liste]
- Format : fichier Markdown (.md)

Sauvegarde chaque article dans /content/blog/`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="05"
            title="Synthèse de recherche utilisateur"
            result="Un rapport structuré avec les insights clés, les verbatims et les recommandations produit priorisées — prêt pour ta prochaine réunion de roadmap."
          >
            <CodeBlock
              code={`Analyse les 8 transcriptions d'interviews dans ce dossier.
Identifie :
- Les 5 problèmes les plus mentionnés (avec fréquence)
- Les fonctionnalités les plus demandées
- Les objections récurrentes sur le pricing
- Les mots exacts utilisés par les utilisateurs (verbatims)
- Le profil type de l'utilisateur le plus enthousiaste

Produis un rapport "synthese-interviews.docx" avec :
- Executive summary (10 lignes)
- Analyse détaillée par thème
- Tableau des verbatims classés par catégorie
- Recommandations produit (top 5 features à prioriser)`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="06"
            title="Préparation juridique (CGV, mentions légales)"
            result="3 documents Word (CGV, politique de confidentialité, mentions légales) prêts à relire et adapter. Point de départ solide avant validation par un juriste."
          >
            <CodeBlock
              code={`Génère les documents juridiques pour mon SaaS [nom] :

1. Conditions Générales de Vente (CGV)
   - SaaS en abonnement mensuel, paiement Stripe
   - Droit français, RGPD — Période d'essai 14 jours

2. Politique de confidentialité
   - Données collectées : email, nom, données d'usage
   - Hébergement : Vercel (US) + Supabase (EU)
   - Sous-traitants : Stripe, Resend, Supabase

3. Mentions légales
   - Auto-entrepreneur / SAS (préciser)
   - Hébergeur : Vercel Inc.

Format : un fichier Word (.docx) par document.
Sauvegarde dans /legal/`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="07"
            title="Reporting hebdomadaire / mensuel"
            result="Un rapport Word complet + un dashboard Excel avec sparklines, prêts pour ton board ou tes investisseurs."
          >
            <CodeBlock
              code={`À partir des données dans /data/analytics-mars.csv, génère :

1. Un rapport mensuel "report-mars-2026.docx" avec :
   - KPIs principaux : MRR, churn, nouveaux users, LTV, CAC
   - Graphique d'évolution MRR sur les 6 derniers mois
   - Analyse des cohortes (rétention M1, M3, M6)
   - Top 3 des canaux d'acquisition
   - Recommandations pour le mois suivant

2. Un dashboard Excel "dashboard-mars.xlsx" avec :
   - Feuille KPIs avec sparklines
   - Feuille détail par plan
   - Feuille churn analysis

Utilise le template dans /templates/report-template.docx si disponible.`}
            />
          </UseCaseCard>

          <UseCaseCard
            num="08"
            title="Organisation et nettoyage de projet"
            result="Un plan de réorganisation clair à valider avant toute action. Cowork ne touche à rien sans ton accord."
          >
            <CodeBlock
              code={`Analyse le dossier /MonSaaS/ et :
1. Liste tous les fichiers en doublon ou quasi-doublon
2. Identifie les fichiers non modifiés depuis plus de 90 jours
3. Propose une nouvelle arborescence organisée :
   /src (code)
   /docs (documentation)
   /marketing (contenu, visuels)
   /legal (juridique)
   /data (analytics, exports)
   /admin (factures, contrats)

NE SUPPRIME RIEN. Crée un fichier "reorganisation-plan.md"
avec la proposition avant que je valide.`}
            />
          </UseCaseCard>

        </div>

        {/* ── Section 04 ─────────────────────────────────────────────────── */}
        <SectionTitle num="04" title="Les plugins Cowork — Transformer Claude en spécialiste" />

        <Body>
          Depuis janvier 2026, Cowork supporte les plugins : des modules qui ajoutent des compétences spécifiques à Claude. Chaque plugin embarque des skills, des commandes slash, des connecteurs MCP et des sous-agents.
        </Body>

        <Body>
          Tu n'as pas besoin de tous les installer. Voici les 4 qui comptent pour un builder Buildrs.
        </Body>

        <PluginCard
          title="Plugin Marketing"
          desc="Le plus utile pour un solopreneur SaaS. Il rédige du contenu, planifie des campagnes, analyse la concurrence SEO."
          connectors={['Slack', 'Canva', 'Figma', 'HubSpot', 'Amplitude', 'Notion', 'Ahrefs', 'Klaviyo']}
          example={`Crée le plan de campagne pour le lancement
de ma feature "Rapports automatisés" :
- 3 posts LinkedIn (teaser, lancement, témoignage)
- 1 séquence email de 3 emails
- 1 article de blog SEO-optimisé (outline + draft)
- Brief design pour le visuel Canva

Ton : professionnel mais accessible, tutoiement.
Couleurs : bleu/blanc.`}
        />

        <PluginCard
          title="Plugin Sales"
          desc="Pour la prospection, la préparation d'appels, le suivi pipeline. Transforme 20 minutes de recherche manuelle en 2 minutes."
          connectors={['Slack', 'HubSpot', 'Close', 'ZoomInfo', 'Notion']}
          example={`/sales:call-prep Entreprise: [nom du prospect]

→ Claude recherche le prospect, analyse les actualités
  de l'entreprise, identifie les pain points probables,
  génère une fiche de préparation complète avec
  questions suggérées et veille concurrentielle.`}
        />

        <PluginCard
          title="Plugin Data"
          desc="Pour analyser tes métriques SaaS sans écrire de SQL. Pas juste des données — des décisions."
          connectors={['Snowflake', 'BigQuery', 'Hex', 'Amplitude']}
          example={`/data:write-query

Analyse de churn par cohorte mensuelle sur les 6 derniers mois.
Ventiler par plan tarifaire (Starter, Pro, Enterprise).
Identifier les cohortes avec le churn le plus élevé
et corréler avec les changements produit ou de pricing.`}
        />

        <PluginCard
          title="Plugin Productivity"
          desc="Pour orchestrer ta journée quand tu jongler entre build, marketing, support et admin."
          connectors={['Slack', 'Notion', 'Linear', 'Jira', 'Monday']}
          example={`/productivity:standup

→ Claude parcourt tes tâches complétées hier,
  liste celles en cours, analyse ton calendrier
  du jour et génère un résumé structuré.
  10 minutes de copier-coller → 5 secondes.`}
        />

        <SubTitle title="Créer ton propre plugin (sans coder)" />
        <Body>
          C'est là que ça devient puissant pour Buildrs. Tu peux créer un plugin personnalisé en décrivant simplement ce que tu veux automatiser. Claude génère la structure complète — pas de code, juste des fichiers texte.
        </Body>

        <CodeBlock
          label="Exemple — Plugin SaaS-Launch personnalisé"
          code={`Crée un plugin "SaaS-Launch" avec :

Skills :
- Checklist de lancement SaaS Buildrs
- Template de landing page structure
- Process de setup Stripe + Supabase

Commandes :
- /launch:checklist → Génère la checklist personnalisée
- /launch:landing-brief → Crée le brief de landing page
- /launch:pricing → Propose 3 modèles de pricing adaptés

Connecteurs :
- Notion (pour documenter)
- Stripe (pour vérifier la config)`}
        />

        {/* ── Section 05 ─────────────────────────────────────────────────── */}
        <SectionTitle num="05" title="Dispatch — Piloter Cowork depuis ton téléphone" />

        <div className="rounded-xl p-5 my-6 flex gap-4" style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
          <Smartphone size={32} strokeWidth={1.5} style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-[13px] font-bold mb-1.5" style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}>Disponible depuis mars 2026</p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: '#9399b2' }}>
              Dispatch te permet d'envoyer des instructions à Cowork depuis ton smartphone. Claude exécute la tâche sur ton ordinateur, même si tu es en déplacement. Ton ordinateur doit rester allumé.
            </p>
          </div>
        </div>

        <SubTitle title="Comment ça marche" />
        <div className="space-y-3 my-4">
          {[
            'Tu envoies un message depuis l\'app Claude sur ton iPhone ou Android',
            'Claude lance la tâche sur ton ordinateur de bureau (qui doit être allumé)',
            'Tu retrouves le travail terminé quand tu reviens',
          ].map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-[10px] font-black flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontFamily: 'Geist Mono, monospace', border: '0.5px solid rgba(34,197,94,0.25)' }}>
                {i + 1}
              </span>
              <p className="text-[12.5px] leading-relaxed" style={{ color: '#9399b2' }}>{step}</p>
            </div>
          ))}
        </div>

        <Callout type="success">
          Exemple Buildrs concret : tu es en rendez-vous client, tu envoies depuis ton téléphone : <em style={{ color: '#f0f0f5' }}>"Prépare le devis pour [client] avec le template dans /templates/devis.docx, tarif Pro à 49€/mois, engagement 12 mois."</em> Quand tu reviens à ton bureau, le devis est prêt.
        </Callout>

        {/* ── Section 06 ─────────────────────────────────────────────────── */}
        <SectionTitle num="06" title="Sécurité et bonnes pratiques" />

        <SubTitle title="Les règles de sécurité" />
        <div className="space-y-3 my-4">
          {[
            { rule: 'Limite l\'accès aux dossiers nécessaires', detail: 'Ne donne jamais l\'accès à ta racine ou à des répertoires avec des clés API ou des credentials.' },
            { rule: 'Sois explicite sur les suppressions', detail: 'Précise toujours "NE SUPPRIME RIEN" si tu ne veux pas de pertes. Claude demande confirmation avant de supprimer, mais mieux vaut prévenir.' },
            { rule: 'Vérifie les résultats', detail: 'Cowork est en research preview. Relis toujours les documents produits avant de les envoyer ou publier. Les chiffres doivent être vérifiés.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <span className="text-[13px] font-black flex-shrink-0 mt-0.5" style={{ color: '#ef4444', fontFamily: 'Geist Mono, monospace' }}>0{i + 1}</span>
              <div>
                <p className="text-[13px] font-bold mb-1" style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}>{item.rule}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: '#5b6078' }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <SubTitle title="Instructions personnalisées" />
        <Body>
          Tu peux définir des instructions globales (qui s'appliquent à toutes tes sessions) dans Settings › Cowork. C'est l'équivalent du CLAUDE.md pour les non-devs.
        </Body>

        <CodeBlock
          label="Instructions qu'on utilise chez Buildrs"
          code={`- Toujours nommer les fichiers au format : AAAA-MM-JJ_Description
- Ne jamais modifier les fichiers originaux. Créer une copie de travail.
- Tous les rapports utilisent notre template (modele.docx dans /templates/)
- Langue : français. Ton : professionnel mais accessible, tutoiement.
- Pour les fichiers Excel : toujours ajouter les formules de somme et moyenne.`}
        />

        <SubTitle title="Tâches planifiées" />
        <Body>
          Tu peux programmer des tâches récurrentes avec <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/schedule</code> : briefing quotidien de ta boîte mail, veille concurrentielle hebdomadaire, rapport mensuel automatique. Les tâches planifiées tournent tant que ton ordinateur est allumé et l'app Claude ouverte.
        </Body>

        {/* ── Section 07 ─────────────────────────────────────────────────── */}
        <SectionTitle num="07" title="Plans et coûts" />

        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-3 px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            {['Plan', 'Prix', 'Notre avis'].map(h => (
              <p key={h} className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>{h}</p>
            ))}
          </div>
          {[
            { plan: 'Pro', prix: '20$/mois', avis: 'Suffisant pour tester et les tâches ponctuelles', ok: true },
            { plan: 'Max 5x', prix: '100$/mois', avis: 'Recommandé si tu utilises Cowork quotidiennement', ok: true },
            { plan: 'Max 20x', prix: '200$/mois', avis: 'Pour un usage très intensif', ok: false },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-3" style={{ borderBottom: i < 2 ? '0.5px solid rgba(255,255,255,0.05)' : undefined }}>
              <p className="text-[12px] font-semibold" style={{ color: '#f0f0f5' }}>{row.plan}</p>
              <p className="text-[12px]" style={{ color: '#22c55e', fontFamily: 'Geist Mono, monospace' }}>{row.prix}</p>
              <p className="text-[12px]" style={{ color: row.ok ? '#9399b2' : '#5b6078' }}>{row.avis}</p>
            </div>
          ))}
        </div>

        <Callout type="warning">
          Les tâches Cowork consomment plus de crédits que le chat classique. Les tâches complexes multi-étapes nécessitent davantage de tokens. Si tu atteins régulièrement tes limites, passe au plan supérieur.
        </Callout>

        <Callout type="success">
          Notre recommandation : commence avec Pro pour tester. Dès que Cowork fait partie de ton quotidien, passe en Max 5x. C'est ce qu'on utilise chez Buildrs.
        </Callout>

        {/* ── Section 08 ─────────────────────────────────────────────────── */}
        <SectionTitle num="08" title="Cowork dans le système Buildrs — La combinaison gagnante" />

        <Body>
          Voici comment les outils Claude s'articulent dans ton workflow Buildrs. Chaque outil a une responsabilité claire.
        </Body>

        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-3 px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            {['Tâche', 'Outil', 'Exemple'].map(h => (
              <p key={h} className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>{h}</p>
            ))}
          </div>
          {[
            { tache: 'Construire ton SaaS', outil: 'Claude Code', color: '#4d96ff', exemple: 'Frontend, backend, base de données' },
            { tache: 'Analyser ton marché', outil: 'Claude Cowork', color: '#22c55e', exemple: 'Veille concurrentielle, synthèse' },
            { tache: 'Documents business', outil: 'Claude Cowork', color: '#22c55e', exemple: 'Pitch deck, CGV, rapports' },
            { tache: 'Contenu marketing', outil: 'Claude Cowork', color: '#22c55e', exemple: 'Articles, emails, posts LinkedIn' },
            { tache: 'Administratif', outil: 'Claude Cowork', color: '#22c55e', exemple: 'Factures, comptabilité, fichiers' },
            { tache: 'Piloter en déplacement', outil: 'Dispatch', color: '#8b5cf6', exemple: 'Lancer des tâches depuis ton mobile' },
            { tache: 'Brainstorm & stratégie', outil: 'Claude Chat', color: '#9399b2', exemple: 'Réflexion, questions rapides' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-3" style={{ borderBottom: i < 6 ? '0.5px solid rgba(255,255,255,0.05)' : undefined }}>
              <p className="text-[12px]" style={{ color: '#9399b2' }}>{row.tache}</p>
              <p className="text-[12px] font-semibold" style={{ color: row.color }}>{row.outil}</p>
              <p className="text-[12px]" style={{ color: '#5b6078' }}>{row.exemple}</p>
            </div>
          ))}
        </div>

        <Callout type="success">
          La combinaison Claude Code + Cowork est le cœur du système Buildrs. L'un construit, l'autre gère. Ensemble, tu as un builder et un business manager qui tournent en parallèle — pendant que toi, tu te concentres sur la croissance.
        </Callout>

        {/* ── Sources ────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#5b6078' }}>Sources</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Cowork — Guide de démarrage officiel', url: 'https://support.claude.com/en/articles/13345190-get-started-with-cowork' },
              { label: 'Cowork — Produit Anthropic', url: 'https://claude.com/product/cowork' },
              { label: 'Plugins Cowork — Blog Anthropic', url: 'https://claude.com/blog/cowork-plugins' },
              { label: 'Plugins open source — GitHub', url: 'https://github.com/anthropics/knowledge-work-plugins' },
              { label: 'Télécharger Claude Desktop', url: 'https://claude.com/download' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70"
                style={{ color: '#4d96ff' }}
              >
                <ExternalLink size={11} strokeWidth={1.5} />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div
          className="mt-10 rounded-2xl p-6"
          style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.2)' }}
        >
          <p className="text-[14px] font-extrabold mb-2" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>Et maintenant ?</p>
          <p className="text-[12px] mb-5" style={{ color: '#5b6078' }}>
            Tu sais comment Cowork gère tout ce qui n'est pas du code dans ton business SaaS. La suite du Claude OS te donne les armes techniques pour builder.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'CLAUDE.md — Crée ton fichier de contexte projet parfait', path: '#/dashboard/claude-os/apprendre/claude-md' },
              { label: 'Skills — Les commandes personnalisées Buildrs', path: '#/dashboard/claude-os/apprendre/skills' },
              { label: 'MCP Connecteurs — Les connecteurs qu\'on utilise en prod', path: '#/dashboard/claude-os/apprendre/mcp-connecteurs' },
              { label: 'Prompts — Le framework CTAR', path: '#/dashboard/claude-os/apprendre/prompts' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 text-left text-[12px] transition-opacity hover:opacity-70"
                style={{ color: '#22c55e' }}
              >
                <ChevronRight size={12} strokeWidth={2} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
