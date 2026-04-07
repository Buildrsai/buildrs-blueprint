# CHECKLIST D'IMPLÉMENTATION — BUILDRS DASHBOARD V2
## Guide pas à pas pour piloter Claude Code

---

## COMMENT UTILISER CE DOCUMENT

1. Suis les tâches dans l'ordre (elles sont ordonnées par dépendance)
2. Pour chaque tâche : copie le prompt et envoie-le à Claude Code
3. Vérifie le résultat avant de passer à la tâche suivante
4. Coche ✅ quand c'est fait

**Règle d'or :** Envoie TOUJOURS le prompt de contexte ci-dessous en premier message de chaque session Claude Code.

---

## PROMPT DE CONTEXTE (À ENVOYER EN DÉBUT DE CHAQUE SESSION)

```
Tu travailles sur le dashboard Buildrs (app.buildrs.fr). Stack : React + Supabase + Vercel + Stripe. Dark mode (#0a0a0a / #141414), accents verts (#4ade80).

RÈGLES ABSOLUES :
- Ne casse AUCUN flow existant (onboarding, Jarvis, agents, navigation)
- Ne modifie AUCUN system prompt d'agent existant
- Ne supprime et ne modifie AUCUNE table Supabase existante
- Respecte le design system en place (couleurs, polices, spacings, composants)
- Lis le code existant AVANT de modifier quoi que ce soit
- RLS obligatoire sur toutes les nouvelles tables
- Responsive obligatoire (mobile 375px minimum)
- En cas de doute, demande avant de modifier

Lis d'abord la structure du projet pour comprendre l'architecture existante.
```

---

## PHASE 0 — PRÉPARATION (30 min)

### ☐ 0.1 — Audit du code existant

```
Lis la structure complète du projet. Liste-moi :
1. L'arborescence des dossiers et fichiers principaux
2. Les composants existants (surtout Sidebar, Layout, pages principales)
3. Les tables Supabase existantes (schéma complet)
4. Les intégrations Stripe existantes (webhooks, checkout)
5. Les routes/pages existantes
6. Le système d'auth en place

Ne modifie rien. Je veux juste un état des lieux complet.
```

### ☐ 0.2 — Identifier les dépendances

```
Maintenant que tu connais le code, dis-moi :
1. Quelles tables existantes gèrent les utilisateurs et leurs achats ?
2. Y a-t-il déjà un système de progression ou de checklist ?
3. Comment la sidebar est-elle structurée actuellement (composant, config, données) ?
4. Quels webhooks Stripe existent déjà ?
5. Y a-t-il un système de notifications en place ?

Liste les composants/tables qu'on devra ÉTENDRE (pas remplacer) pour la V2.
```

---

## PHASE 1 — BASE DE DONNÉES (Jour 1)

### ☐ 1.1 — Table user_profiles_buildrs

```
Crée la table Supabase user_profiles_buildrs pour stocker le profil builder de chaque user :
- user_id (UUID, PK, référence auth.users)
- display_name (TEXT)
- project_idea (TEXT, nullable)
- stage (TEXT, check: 'idea', 'started', 'launched', 'scaling')
- goal (TEXT)
- tech_level (TEXT, check: 'beginner', 'intermediate', 'advanced')
- level (TEXT, default 'explorer', check: 'explorer', 'builder', 'launcher', 'scaler')
- xp_points (INTEGER, default 0)
- onboarding_completed (BOOLEAN, default false)
- created_at, updated_at (TIMESTAMPTZ)

Ajoute les politiques RLS : chaque user ne voit et modifie que son propre profil. Les autres users peuvent voir display_name et level uniquement (pour la communauté).
```

### ☐ 1.2 — Tables projects + milestones + collaborateurs

```
Crée 3 tables pour le project tracker :

1. projects :
- id UUID PK
- user_id (ref auth.users, ON DELETE CASCADE)
- name TEXT NOT NULL
- description TEXT
- status TEXT default 'active' (check: 'active', 'paused', 'launched', 'archived')
- created_at, updated_at TIMESTAMPTZ

2. project_milestones :
- id UUID PK
- project_id (ref projects, ON DELETE CASCADE)
- title TEXT NOT NULL
- description TEXT
- kanban_status TEXT default 'todo' (check: 'todo', 'in_progress', 'review', 'done')
- sort_order INTEGER default 0
- linked_step_id TEXT (lien vers étape du parcours)
- linked_agent TEXT (slug de l'agent recommandé)
- notes TEXT
- completed_at TIMESTAMPTZ
- created_at TIMESTAMPTZ

3. project_collaborators :
- id UUID PK
- project_id (ref projects, ON DELETE CASCADE)
- user_id (ref auth.users, ON DELETE CASCADE)
- role TEXT default 'member' (check: 'owner', 'co-founder', 'member', 'viewer')
- invited_at, accepted_at TIMESTAMPTZ
- UNIQUE(project_id, user_id)

RLS :
- projects : user voit ses projets + projets où il est collaborateur
- milestones : même logique que le projet parent
- collaborators : visible par les membres du projet
```

### ☐ 1.3 — Tables communauté (posts, commentaires, réactions)

```
Crée 3 tables pour le feed communautaire :

1. community_posts :
- id UUID PK
- user_id (ref auth.users, ON DELETE CASCADE)
- type TEXT NOT NULL (check: 'milestone', 'idea', 'question', 'win', 'resource')
- content TEXT NOT NULL
- project_name TEXT (optionnel)
- attachments JSONB default '[]'
- reactions JSONB default '{}'
- is_auto BOOLEAN default false
- created_at TIMESTAMPTZ

2. community_comments :
- id UUID PK
- post_id (ref community_posts, ON DELETE CASCADE)
- user_id (ref auth.users, ON DELETE CASCADE)
- content TEXT NOT NULL
- created_at TIMESTAMPTZ

3. community_reactions :
- id UUID PK
- post_id (ref community_posts, ON DELETE CASCADE)
- user_id (ref auth.users, ON DELETE CASCADE)
- reaction TEXT NOT NULL
- UNIQUE(post_id, user_id, reaction)

RLS : tous les users authentifiés voient le feed. Chacun ne crée/modifie/supprime que ses propres posts/commentaires/réactions.
```

### ☐ 1.4 — Tables marketplace d'idées SaaS

```
Crée 2 tables pour la marketplace d'idées :

1. saas_ideas :
- id UUID PK
- title TEXT NOT NULL
- slug TEXT UNIQUE NOT NULL
- difficulty TEXT (check: 'easy', 'medium', 'advanced')
- mrr_min INTEGER
- mrr_max INTEGER
- target_audience TEXT
- tags JSONB default '[]'
- problem_md TEXT
- solution_md TEXT
- stack TEXT
- business_model_md TEXT
- competition_md TEXT
- is_featured BOOLEAN default false
- is_active BOOLEAN default true
- source TEXT default 'curated'
- created_at TIMESTAMPTZ

2. user_saved_ideas :
- user_id (ref auth.users, ON DELETE CASCADE)
- idea_id (ref saas_ideas, ON DELETE CASCADE)
- saved_at TIMESTAMPTZ
- PRIMARY KEY (user_id, idea_id)

RLS : saas_ideas visible par tous les users authentifiés (lecture seule). user_saved_ideas : chaque user ne voit que ses favoris.
```

### ☐ 1.5 — Tables veille IA + notifications

```
Crée 3 tables :

1. trend_reports :
- id UUID PK
- report_date DATE NOT NULL
- signals JSONB NOT NULL (array de signaux)
- generated_by TEXT default 'ai'
- is_published BOOLEAN default true
- created_at TIMESTAMPTZ

2. user_alerts :
- id UUID PK
- user_id (ref auth.users, ON DELETE CASCADE)
- keywords JSONB default '[]'
- sources JSONB default '["producthunt", "reddit"]'
- frequency TEXT default 'weekly' (check: 'daily', 'weekly')
- is_active BOOLEAN default true

3. notifications :
- id UUID PK
- user_id (ref auth.users, ON DELETE CASCADE)
- type TEXT NOT NULL
- title TEXT NOT NULL
- message TEXT
- link TEXT
- is_read BOOLEAN default false
- created_at TIMESTAMPTZ

RLS : trend_reports visible par tous. user_alerts et notifications : chaque user ne voit que les siens.
```

### ☐ 1.6 — Tables produits + achats + progression (si pas déjà existantes)

```
Vérifie si les tables products, user_purchases, user_progress, content_blocs, content_bricks existent déjà.

Si elles n'existent PAS, crée-les :

products : slug (UNIQUE), name, description, price_cents, price_ob_cents, stripe_price_id, stripe_price_ob_id, category, sort_order, is_active, blocs_count, bricks_count

user_purchases : user_id, product_slug, stripe_payment_id, amount_paid_cents, funnel_source, purchase_type, purchased_at. UNIQUE(user_id, product_slug)

user_progress : user_id, product_slug, bloc_id, brick_id, completed, completed_at. UNIQUE(user_id, product_slug, bloc_id, brick_id)

content_blocs : product_slug, bloc_id, bloc_title, bloc_description, sort_order, total_bricks. UNIQUE(product_slug, bloc_id)

content_bricks : product_slug, bloc_id, brick_id, brick_title, content_md, template_code, external_links JSONB, sort_order. UNIQUE(product_slug, bloc_id, brick_id)

Si elles EXISTENT déjà, dis-moi la structure actuelle et on adapte. Ne les modifie pas sans me le dire.

Seed les produits :
- blueprint, 27€, catégorie construire
- claude-buildrs, 47€, catégorie claude, 15 blocs 92 briques
- claude-cowork, 37€ (OB 27€), catégorie claude, 6 blocs 47 briques
- agents-ia, 197€ (OTO 147€), catégorie agents
- sprint, 497€, catégorie coaching
- cohorte, 1497€, catégorie coaching

RLS sur toutes les tables.
```

---

## PHASE 2 — HOOKS & HELPERS (Jour 2)

### ☐ 2.1 — Hooks de données

```
Crée les hooks React suivants :

1. usePurchases() — récupère les product_slugs achetés par le user connecté depuis user_purchases. Retourne { purchases: string[], isLoading, hasAccess(slug): boolean }

2. useProgress(productSlug) — récupère la progression du user sur un produit. Retourne { completed: number, total: number, percentage: number, bricks: BrickProgress[] }

3. useProject() — récupère le projet actif du user (le plus récent avec status 'active'). Retourne { project, milestones, collaborators, isLoading }

4. usePackDeal() — calcule le pack complet dynamique. Produits packables : blueprint, claude-buildrs, claude-cowork. Remise 15%. Retourne { products, originalPrice, discountedPrice, savings } ou null si 0-1 produit restant.

5. useProfile() — récupère le profil builder du user depuis user_profiles_buildrs. Retourne { profile, updateProfile, isLoading }

6. useNotifications() — récupère les notifications non lues. Retourne { notifications, unreadCount, markAsRead }

7. useCommunityFeed(filters) — récupère les posts du feed avec pagination. Retourne { posts, isLoading, loadMore, createPost }

Place-les dans src/hooks/. Utilise les conventions et le client Supabase existants du projet.
```

### ☐ 2.2 — Helpers

```
Crée les helpers suivants dans src/lib/ :

1. products.ts — la config des produits, le mapping sidebar, la fonction hasAccess

2. pricing.ts — le calcul du pack complet, la logique de remise dynamique

3. levels.ts — la logique XP : calculateLevel(xp), xpForAction(action), getLevelProgress(xp)

4. milestones.ts — les 8 milestones par défaut à générer quand un projet est créé, avec linked_step_id et linked_agent pour chacun

5. next-action.ts — la logique qui détermine la "prochaine action" du user en fonction de : son projet (milestone en cours), son parcours (étape en cours), ses achats (produits débloqués). Retourne { title, description, link, type }

Utilise les types et conventions du projet existant.
```

---

## PHASE 3 — SIDEBAR V2 (Jour 3)

### ☐ 3.1 — Restructurer la sidebar

```
Restructure la sidebar existante. Ne la réécris pas from scratch — adapte le composant existant.

Nouvelle structure :
1. Logo + toggle
2. Level du user (Explorateur/Builder/Launcher/Scaler) avec barre XP
3. Home (toujours visible, page par défaut)
4. Section "MON PROJET" : Mon SaaS (avec badge progression), Kanban, Collaborateurs
5. Section "APPRENDRE" : Parcours Buildrs (badge %), Environnement Claude (badge X/15), Cowork (🔒 si pas acheté)
6. Section "OUTILS" : Jarvis IA, Agents IA (🔒 si pas achetés), Marketplace SaaS (badge NEW), Veille IA (badge NEW), Templates, Boîte à outils
7. Section "COMMUNAUTÉ" : Feed (badge compteur non lus), Membres
8. Section "ACCÈS BUILDRS" : WhatsApp, Mes produits
9. CTA dynamique en bas (Pack complet si 2+ cadenas, Agents si 1 cadenas, Sprint/Cohorte sinon)

Les items verrouillés affichent un cadenas 🔒 cliquable qui ouvre un modal d'achat.
Les badges de progression (X/Y, %) se calculent via les hooks.

IMPORTANT : garde le même style visuel que la sidebar actuelle. Même couleurs, mêmes spacings, mêmes hover states.
```

### ☐ 3.2 — Modal d'achat depuis cadenas

```
Crée un composant PurchaseModal qui s'ouvre quand on clique sur un item verrouillé dans la sidebar.

Le modal affiche :
1. Nom du produit, description, prix
2. Bouton "Acheter → XX€" (redirige vers Stripe checkout du produit seul)
3. Si 2+ produits restent verrouillés : section Pack en dessous avec la liste des produits non achetés, le prix barré, le prix remisé -15%, et un bouton "Tout débloquer → YY€"

Duplique le design des modals existants dans le projet. Même style, même animations.
```

---

## PHASE 4 — HOME COCKPIT (Jour 4)

### ☐ 4.1 — Page Home

```
Crée (ou remplace) la page d'accueil du dashboard.

La page affiche dans cet ordre :
1. Header : "Salut [Prénom]" + "[Level] · Projet actif : [Nom] · Jour [X]"
2. Bloc "Prochaine action" : un bloc vert avec le titre de la prochaine étape et un bouton "Commencer →". Utilise le helper next-action.ts pour déterminer le contenu.
3. Trois metric cards en grille : Parcours (%), Mon Projet (X/8), Environnement Claude (X/15). Chacune avec une barre de progression.
4. Quick actions : 4 boutons en grille (Lancer Jarvis, Continuer le parcours, Copier un template, Explorer les idées SaaS)
5. Deux colonnes en bas :
   - Gauche : "Milestones du projet" — les 8 milestones avec leur statut (fait/en cours/à faire)
   - Droite : "Idées SaaS trending" (3 idées de la marketplace) + "Feed communauté" (3 derniers posts)

Si le user n'a pas encore de projet → le bloc "Prochaine action" dit "Crée ton premier projet" ou "Explore les idées SaaS".

Reprends le design system existant. Dark mode, cards avec fond #161616, border subtle.
```

### ☐ 4.2 — Widget "Idée du jour"

```
Ajoute un petit widget sur la home (entre les quick actions et les deux colonnes) qui affiche une idée de SaaS aléatoire différente chaque jour.

Implémentation simple : prends une idée de la table saas_ideas où is_active=true, sélectionnée par un hash de la date du jour (pour que tous les users voient la même idée le même jour). Affiche le titre, la difficulté, le MRR potentiel, et un lien "Explorer →".
```

---

## PHASE 5 — ONBOARDING (Jour 5)

### ☐ 5.1 — Flow d'onboarding

```
Crée un flow d'onboarding qui s'affiche au premier login (quand user_profiles_buildrs.onboarding_completed = false ou que le profil n'existe pas).

4 écrans en séquence (type wizard/stepper) :

Écran 1 "C'est quoi ton projet ?" :
- 3 options radio : "J'ai une idée précise" (+ champ texte), "J'ai plusieurs idées", "Pas encore d'idée"

Écran 2 "T'en es où ?" :
- 4 options radio : "Juste l'idée", "J'ai commencé", "Déjà lancé", "Je veux scaler"

Écran 3 "Ton objectif ?" :
- 4 options radio : "Premiers revenus", "Remplacer mon salaire", "Business 10K+/mois", "Portfolio de SaaS"

Écran 4 "Ton niveau technique ?" :
- 3 options radio : "Débutant", "Intermédiaire", "Avancé"

À la fin :
1. Créer/mettre à jour le profil dans user_profiles_buildrs
2. Si le user a décrit une idée → créer automatiquement un projet avec ce nom + générer les 8 milestones par défaut
3. Si pas d'idée → ne pas créer de projet, la home redirigera vers la marketplace d'idées
4. Définir le level initial (explorer par défaut, builder si "j'ai commencé", launcher si "déjà lancé", scaler si "je veux scaler")
5. Marquer onboarding_completed = true
6. Rediriger vers la home

Design : fullscreen overlay ou page dédiée, dark mode, étapes numérotées, bouton "Suivant" à chaque étape. Reprends le style des modals/formulaires existants.
```

---

## PHASE 6 — PROJECT TRACKER KANBAN (Jour 6-7)

### ☐ 6.1 — Page projet (vue d'ensemble)

```
Crée la page /projet qui affiche :

1. Header : nom du projet, date de création, jour X, level du user
2. Toggle vue liste / vue kanban
3. Barre de progression globale (milestones complétés / total)
4. En vue liste : les milestones dans l'ordre avec leur statut, un bouton pour changer le statut
5. Bouton "Ajouter un milestone" pour créer des milestones custom

Design : même style que les pages existantes. Cards dark avec borders subtiles.
```

### ☐ 6.2 — Vue Kanban

```
Crée la vue Kanban sur /projet/kanban.

4 colonnes : "À faire", "En cours", "En review", "Fait"
Les milestones sont des cards draggables entre les colonnes.

Implémente le drag-and-drop. Utilise une librairie légère (dnd-kit ou react-beautiful-dnd si déjà dans le projet, sinon dnd-kit).

Chaque card affiche :
- Titre du milestone
- Badge de l'agent lié (ex: "Jarvis", "Agent Copy")
- Indicateur si des notes existent

Clic sur une card → ouvre un panneau latéral (drawer) avec :
- Titre (éditable)
- Description (éditable)
- Notes personnelles (textarea)
- Lien vers l'étape du parcours correspondante (si linked_step_id)
- Bouton "Lancer l'agent" (si linked_agent)
- Sélecteur de statut (dropdown)

Chaque changement de statut met à jour la BDD en temps réel.
Quand un milestone passe en "Fait" → mettre completed_at + proposer de partager dans le feed (optionnel).
```

### ☐ 6.3 — Collaboration (inviter sur un projet)

```
Crée la page /projet/collaborateurs qui affiche :

1. Liste des collaborateurs actuels avec leur rôle et un bouton pour changer le rôle ou retirer
2. Formulaire "Inviter" : champ email + sélecteur de rôle (Co-founder / Member / Viewer)
3. Quand on invite :
   - Vérifier si l'email correspond à un user Buildrs existant
   - Si oui → insérer dans project_collaborators + créer une notification pour l'invité
   - Si non → envoyer un email d'invitation (ou afficher un message "cet utilisateur n'a pas de compte Buildrs")
4. L'invité voit le projet partagé dans sa sidebar sous "Mon Projet"

Permissions par rôle :
- Owner : tout
- Co-founder : tout sauf supprimer le projet
- Member : voir + commenter, pas déplacer ni créer
- Viewer : lecture seule
```

---

## PHASE 7 — MARKETPLACE D'IDÉES SAAS (Jour 8)

### ☐ 7.1 — Page marketplace

```
Crée la page /marketplace qui affiche les idées de SaaS IA.

Layout :
1. Header : "Marketplace SaaS IA" + "XX idées prêtes à lancer"
2. Filtres : par difficulté (Facile/Moyen/Avancé), par MRR (1-3K/3-8K/8K+), par tags
3. Grille de cards d'idées

Chaque card affiche :
- Titre
- Difficulté (badge coloré : vert facile, jaune moyen, rouge avancé)
- MRR potentiel (range)
- Cible
- Tags (pills)
- Boutons : "Explorer" et "Sauvegarder ❤️"

Clic sur "Explorer" → page détail de l'idée (/marketplace/[slug])
```

### ☐ 7.2 — Page détail d'une idée

```
Crée la page /marketplace/[slug] qui affiche le détail d'une idée SaaS :

1. Titre + badges (difficulté, MRR, cible)
2. Section "Le problème" (rendu Markdown de problem_md)
3. Section "La solution" (rendu Markdown de solution_md)
4. Section "Stack recommandé" (stack)
5. Section "Business model" (rendu Markdown de business_model_md)
6. Section "Concurrence" (rendu Markdown de competition_md)
7. Bouton CTA "🚀 Lancer ce SaaS → créer mon projet"
8. Bouton "💾 Sauvegarder dans mes favoris"

Quand le user clique "Lancer ce SaaS" :
- Créer un projet avec le titre de l'idée
- Générer les 8 milestones par défaut pré-remplis avec le contexte de l'idée (description adaptée)
- Rediriger vers /projet/kanban

Design : page éditoriale, dark mode, sections bien séparées. Pas de sidebar sur cette page (ou sidebar réduite).
```

### ☐ 7.3 — Seed des idées

```
Insère 10 idées de SaaS IA dans la table saas_ideas. Voici les 10 idées à créer (génère le contenu complet pour chacune : problem_md, solution_md, stack, business_model_md, competition_md) :

1. "Audit SEO automatisé par IA" — Moyen, 3-8K MRR, B2B, Claude API
2. "Générateur de contrats freelance" — Facile, 1-3K MRR, Micro-SaaS, Low-code
3. "Dashboard analytics pour créateurs" — Avancé, 5-15K MRR, B2C, API multi-plateformes
4. "Outil de pricing dynamique pour e-commerce" — Moyen, 3-10K MRR, B2B, Claude + scraping
5. "Générateur de landing pages IA" — Moyen, 3-8K MRR, B2B/B2C, Claude + React
6. "Assistant RH pour PME" — Facile, 2-5K MRR, B2B, Claude API
7. "Outil de veille concurrentielle automatisée" — Avancé, 5-12K MRR, B2B, Claude + web scraping
8. "Chatbot support client personnalisé" — Facile, 1-5K MRR, B2B, Claude API + widget
9. "Plateforme de facturation intelligente" — Moyen, 3-8K MRR, B2B, Claude + Stripe
10. "Générateur de briefs créatifs pour agences" — Facile, 2-4K MRR, B2B, Micro-SaaS

Chaque idée doit avoir un contenu détaillé et actionnable. Le user doit pouvoir lire la fiche et comprendre exactement quoi builder.
```

---

## PHASE 8 — VEILLE IA (Jour 9)

### ☐ 8.1 — Page veille

```
Crée la page /veille qui affiche les rapports de veille IA.

Layout :
1. Header : "Veille IA — Tendances SaaS" + "Dernière analyse : [date]"
2. Le dernier rapport en haut (les signaux sous forme de cards expansibles)
3. Chaque signal affiche : source (Product Hunt / Reddit / etc), la tendance détectée, l'opportunité SaaS qui en découle, difficulté estimée, MRR estimé
4. Boutons par signal : "Explorer cette idée" (redirige vers la marketplace ou crée une idée), "Sauvegarder"
5. Archive des rapports précédents en dessous

Pour le moment, crée la page et le rendu. Les données seront insérées manuellement ou via un cron qu'on ajoutera plus tard.
```

### ☐ 8.2 — Edge function veille IA (optionnel, V2)

```
Crée une Edge Function Supabase qui :
1. Appelle l'API Anthropic (Claude) avec un prompt qui lui demande d'analyser les tendances SaaS actuelles
2. Active le web search pour que Claude cherche sur Product Hunt, Reddit r/SaaS, IndieHackers
3. Lui demande de retourner un JSON avec 3-5 signaux, chacun avec : source, tendance, opportunité, difficulté, mrr_estimate
4. Insère le résultat dans trend_reports
5. Configurée pour tourner 1x par semaine (cron)

Utilise le modèle claude-sonnet-4-20250514 avec web search activé.
```

---

## PHASE 9 — COMMUNAUTÉ (Jour 10)

### ☐ 9.1 — Page feed communauté

```
Crée la page /communaute qui affiche le feed des membres.

Layout :
1. Header : "Communauté Buildrs" + compteur de membres
2. Formulaire de post en haut : sélecteur de type (Idée 💡 / Question ❓ / Win 🎉 / Ressource 📎) + textarea + bouton "Publier"
3. Filtres : Tout / Avancements / Idées / Questions / Wins / Ressources
4. Feed de posts sous forme de cards avec :
   - Avatar/initiales + prénom + level + "il y a X heures"
   - Type (badge)
   - Contenu du post
   - Réactions (emojis cliquables : 🔥 💪 🎯 👏 avec compteur)
   - Commentaires (expansible)
5. Pagination ou infinite scroll

Les posts de type "milestone" (is_auto=true) ont un design légèrement différent : "🏁 [Prénom] a complété [milestone] sur [projet]"
```

### ☐ 9.2 — Annuaire des membres

```
Crée la page /communaute/membres qui affiche la liste des builders.

Layout :
1. Grille de cards membres
2. Chaque card : initiales/avatar, prénom, level (badge), projet en cours (nom + statut), nombre de posts
3. Clic → page profil public (/communaute/membres/[id]) avec : infos du profil, derniers posts du feed filtrés par ce user, stats (milestones complétés, posts, XP)

Les données viennent de user_profiles_buildrs + community_posts.
```

---

## PHASE 10 — AGENTS CONTEXTUELS (Jour 11)

### ☐ 10.1 — Agents dans le parcours

```
Quand le user ouvre un milestone de son projet ou une étape du parcours qui a un linked_agent, affiche un bloc "Agent disponible" en bas de la page :

Le bloc affiche :
- Icône + nom de l'agent
- Message contextuel (ex: "Je peux t'aider à structurer ton offre avec le framework PSSO.")
- Bouton "Lancer l'agent →"

Cliquer sur le bouton ouvre l'agent dans le même format qu'il s'ouvre actuellement (modale, page, ou panneau — reprends le comportement existant de Jarvis/Agents).

Le mapping milestone → agent :
1. Idée validée → Jarvis (brainstorm)
2. Persona défini → Jarvis (analyse)
3. Étude de marché → Jarvis (recherche)
4. Offre structurée → Agent Copywriting (si acheté, sinon Jarvis)
5. MVP scopé → Agent Code Architect (si acheté, sinon Jarvis)
6. LP créée → Agent Copywriting (si acheté, sinon Jarvis)
7. Stripe connecté → Jarvis (intégration)
8. Lancé → Jarvis

Si l'agent est verrouillé (pas acheté), le bouton affiche "🔒 Débloquer les Agents IA" et ouvre le modal d'achat.
```

---

## PHASE 11 — TEMPLATES (Jour 12)

### ☐ 11.1 — Page templates

```
Crée la page /templates qui affiche tous les templates organisés par catégorie.

Catégories :
1. Claude Config (préférences profil, styles, instructions projet)
2. Claude Code (CLAUDE.md, .claude/rules, settings.json)
3. Prompts (les 10 prompts Buildrs)
4. System Prompts (pour créer des agents)
5. Business (canvas, PSSO, pricing)
6. Landing Page (structures de LP)

Chaque template = une card avec :
- Titre
- Catégorie (badge)
- Description 1-2 lignes
- Preview du code/texte (bloc de code avec scroll)
- Bouton "📋 Copier" qui copie dans le presse-papier + toast "Copié !"

Filtre par catégorie. Barre de recherche.

Pour le moment, crée le composant et insère 5-10 templates en dur (on les complétera après). Prends les templates qu'on a définis dans le brief (préférences profil Buildrs, style Builder Mode, instructions projet, CLAUDE.md production, etc).
```

---

## PHASE 12 — TOOLBOX (Jour 12)

### ☐ 12.1 — Page boîte à outils

```
Crée la page /outils qui affiche tous les outils et liens utiles regroupés par catégorie.

Catégories et outils :
- IA : Jarvis (lien interne), Agents IA (lien interne), Claude (lien externe claude.ai)
- Dev : VS Code (lien download), Claude Code (lien docs), Supabase (lien), Vercel (lien), GitHub (lien)
- Marketing : Templates LP (lien interne), Templates emails (lien interne)
- Business : Canvas template (lien interne), Calculateur pricing (lien ou outil intégré)
- Design : Figma (lien), ressources UI (liens)

Chaque outil = une card compacte avec : icône, nom, description 1 ligne, lien (interne ou externe, les externes s'ouvrent dans un nouvel onglet).

Organisé en grille par catégorie. Simple, utilitaire, rapide d'accès.
```

---

## PHASE 13 — PAGE MES PRODUITS (Jour 13)

### ☐ 13.1 — Marketplace interne

```
Crée la page /produits qui affiche tous les produits Buildrs.

Layout :
1. Header : "Mes produits" + "Ton espace. Débloque, progresse, construis."
2. Bandeau Pack Complet -15% (visible si 2+ produits non achetés parmi blueprint, claude-buildrs, claude-cowork). Calcul dynamique via usePackDeal(). Prix barré + prix remisé + bouton "Débloquer tout".
3. Section "Construire" : card Blueprint
4. Section "Environnement Claude" : cards Claude By Buildrs + Cowork
5. Section "Aller plus loin" : cards Agents IA + Sprint + Cohorte

Chaque ProductCard a 3 états :
- Acheté : bordure gauche verte, badge "Acheté ✓", barre de progression, bouton "Continuer →"
- Disponible : prix, description, blocs/briques, bouton "Acheter → XX€" (Stripe checkout)
- Premium (Sprint, Cohorte) : design sobre, bouton "Découvrir →" (lien externe vers LP)

Duplique le style des cards existantes dans le dashboard.
```

---

## PHASE 14 — SYSTÈME DE NIVEAUX (Jour 14)

### ☐ 14.1 — Logique XP

```
Implémente le système de niveaux.

Gain d'XP (déclenché automatiquement) :
- Compléter une brique du parcours : +5 XP
- Compléter un bloc entier : +25 XP
- Compléter un milestone projet : +30 XP
- Publier un post dans le feed : +5 XP
- Partager un win : +10 XP
- Commenter/aider quelqu'un : +10 XP
- Lancer un projet (milestone 8 "Lancé" en done) : +200 XP

Niveaux :
- Explorateur : 0 XP
- Builder : 100 XP
- Launcher : 500 XP
- Scaler : 1000 XP

Chaque action qui donne de l'XP → mettre à jour xp_points dans user_profiles_buildrs → recalculer le level.

Afficher le level et la barre XP dans la sidebar (sous le logo) et sur le profil communauté.
```

---

## PHASE 15 — NOTIFICATIONS (Jour 14)

### ☐ 15.1 — Système de notifications in-app

```
Ajoute un système de notifications in-app :

1. Icône cloche dans le header du dashboard (à côté du profil user)
2. Badge rouge avec le compteur de non lues
3. Clic → dropdown avec la liste des notifications récentes
4. Chaque notification : icône type + titre + message + "il y a X" + clic → redirect vers le lien

Déclencheurs de notifications (à brancher sur les actions existantes) :
- Milestone complété par un collaborateur sur un projet partagé
- Commentaire sur un de mes posts
- Réaction sur un de mes posts
- Invitation à collaborer sur un projet
- Nouveau rapport de veille disponible
- Nouveau post dans le feed (optionnel, configurable)

Créer une notification = insérer dans la table notifications avec le bon type, titre, message et lien.
```

---

## PHASE 16 — CHECKOUT LP2 (Jour 15)

### ☐ 16.1 — Pages post-achat

```
Crée les pages post-achat pour le funnel LP2. Duplique le design des pages checkout/merci/upsell existantes de LP1. Change uniquement les contenus.

Page /checkout/claude :
- Produit principal : Claude By Buildrs 47€ (toujours inclus)
- OB1 checkbox : Claude Cowork +37€
- OB2 checkbox : Buildrs Blueprint +27€
- Total dynamique
- Bouton Payer → Stripe Checkout

Page /merci?session_id=xxx :
- Confirmation de paiement
- OTO : Pack Agents IA à 147€ au lieu de 197€
- Bouton "OUI → 147€" (paiement Stripe)
- Lien "Non merci" → si Blueprint pas acheté → /merci/offre, sinon → /dashboard?welcome=lp2

Page /merci/offre (downsell) :
- Uniquement si refus OTO ET Blueprint pas acheté
- Blueprint à 27€
- Bouton "OUI → 27€" (Stripe) ou "Non merci → dashboard"

Webhook Stripe :
- Écouter checkout.session.completed et payment_intent.succeeded
- Insérer les achats dans user_purchases avec funnel_source='lp2'
- Vérifier que le webhook existant (LP1) n'est pas cassé
```

---

## PHASE 17 — POLISH (Jour 16)

### ☐ 17.1 — Tests complets

```
Fais un test complet de tous les flows :

1. Créer un nouveau compte → l'onboarding s'affiche
2. Compléter l'onboarding → le projet se crée, la home s'affiche correctement
3. Naviguer dans le kanban → drag-and-drop fonctionne, les statuts se sauvegardent
4. Ouvrir la marketplace → les idées s'affichent, "Lancer ce SaaS" crée un projet
5. Ouvrir le feed → poster un message, réagir, commenter
6. Ouvrir les templates → copier un template (bouton copier fonctionne)
7. Vérifier la sidebar → les locks s'affichent correctement, les badges de progression sont justes
8. Tester le checkout LP2 → paiement → OTO → downsell → arrivée dashboard
9. Vérifier que les flows LP1 existants fonctionnent toujours
10. Tester en responsive mobile (375px)

Liste-moi tout ce qui ne fonctionne pas ou qui est cassé.
```

### ☐ 17.2 — Corrections

```
Corrige tous les bugs listés dans le test précédent. Pour chaque bug :
1. Identifie la cause
2. Corrige
3. Vérifie que la correction ne casse rien d'autre

Une fois tout corrigé, refais un test rapide des flows principaux.
```

---

## RÉCAPITULATIF

| Phase | Jour | Tâches | Features couvertes |
|-------|------|--------|--------------------|
| 0 | - | Audit code existant | Préparation |
| 1 | J1 | 6 tables Supabase | BDD complète |
| 2 | J2 | 7 hooks + 5 helpers | Infrastructure React |
| 3 | J3 | Sidebar V2 + modal achat | Sidebar, locks |
| 4 | J4 | Home cockpit + idée du jour | Feature 1, 15 |
| 5 | J5 | Onboarding 4 écrans | Feature 2 |
| 6 | J6-7 | Kanban + collab | Features 3, 4 |
| 7 | J8 | Marketplace idées + seed | Feature 6 |
| 8 | J9 | Veille IA | Feature 7 |
| 9 | J10 | Feed + annuaire | Features 5, 14 |
| 10 | J11 | Agents contextuels | Feature 8 |
| 11 | J12 | Templates + toolbox | Features 9, 12 |
| 12 | J13 | Page mes produits | Feature 13 |
| 13 | J14 | Niveaux XP + notifications | Features 10, 11 |
| 14 | J15 | Checkout LP2 complet | Funnel |
| 15 | J16 | Tests + corrections | Polish |

**Total : 34 tâches · 15 features · ~16 jours**
