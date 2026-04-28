/**
 * products-catalog.ts
 * Metadata UI statique par produit — complète la table `products` Supabase
 * sans la dupliquer (icones Lucide, couleur accent, comptages blocs/briques).
 */
import {
  BookOpen, Sparkles, Terminal, RefreshCw, Bot, Rocket, Users,
  type LucideIcon,
} from 'lucide-react'
import { BLUEPRINT_PRICE_CENTS } from '../lib/pricing'

export interface ProductCatalogItem {
  slug:        string
  name:        string
  shortName:   string
  description: string
  category:    'construire' | 'claude' | 'agents' | 'coaching'
  icon:        LucideIcon
  priceCents:  number
  totalBlocs:  number
  totalBricks: number
  accentColor: string
}

export const PRODUCTS_CATALOG: ProductCatalogItem[] = [
  {
    slug:        'blueprint',
    name:        'Buildrs Blueprint',
    shortName:   'Blueprint',
    description: 'Le parcours complet pour lancer ton MVP.',
    category:    'construire',
    icon:        BookOpen,
    priceCents:  BLUEPRINT_PRICE_CENTS,
    totalBlocs:  7,
    totalBricks: 42,
    accentColor: '#fafafa',
  },
  {
    slug:        'claude-buildrs',
    name:        'Démarrer avec Claude',
    shortName:   'Claude Starter',
    description: 'Maîtriser Claude pour construire des produits sans coder.',
    category:    'claude',
    icon:        Sparkles,
    priceCents:  4700,
    totalBlocs:  7,
    totalBricks: 43,
    accentColor: '#cc5de8',
  },
  {
    slug:        'claude-code',
    name:        'Claude Code by Buildrs',
    shortName:   'Claude Code',
    description: 'Vibecoder avec Claude Code, du setup au déploiement.',
    category:    'claude',
    icon:        Terminal,
    priceCents:  3700,
    totalBlocs:  8,
    totalBricks: 49,
    accentColor: '#4d96ff',
  },
  {
    slug:        'claude-cowork',
    name:        'Claude Cowork by Buildrs',
    shortName:   'Claude Cowork',
    description: 'Travailler en équipe avec des agents IA spécialisés.',
    category:    'claude',
    icon:        RefreshCw,
    priceCents:  3700,
    totalBlocs:  6,
    totalBricks: 47,
    accentColor: '#14b8a6',
  },
  {
    slug:        'agents-ia',
    name:        'Pack Agents IA',
    shortName:   'Agents IA',
    description: '5 agents IA spécialisés prêts à l\'emploi.',
    category:    'agents',
    icon:        Bot,
    priceCents:  19700,
    totalBlocs:  5,
    totalBricks: 0,
    accentColor: '#f97316',
  },
  {
    slug:        'sprint',
    name:        'Sprint Buildrs',
    shortName:   'Sprint',
    description: 'MVP complet livré avec toi en 4 semaines.',
    category:    'coaching',
    icon:        Rocket,
    priceCents:  49700,
    totalBlocs:  0,
    totalBricks: 0,
    accentColor: '#f43f5e',
  },
  {
    slug:        'cohorte',
    name:        'Cohorte Buildrs',
    shortName:   'Cohorte',
    description: '12 semaines de coaching intensif avec Alfred & Chris.',
    category:    'coaching',
    icon:        Users,
    priceCents:  149700,
    totalBlocs:  0,
    totalBricks: 0,
    accentColor: '#8b5cf6',
  },
]

export const getProduct = (slug: string) =>
  PRODUCTS_CATALOG.find(p => p.slug === slug)

export const formatPrice = (cents: number) =>
  `${(cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 0 })}€`
