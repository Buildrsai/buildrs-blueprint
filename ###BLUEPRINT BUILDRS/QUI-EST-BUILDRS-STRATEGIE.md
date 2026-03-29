# QUI EST BUILDRS — Identité d'équipe & Stratégie d'implémentation

---

## L'ÉQUIPE BUILDRS

### Alfred Orsini — Fondateur & CEO
- 32 ans, Bretagne
- A construit l'écosystème Buildrs seul — sans levée de fonds, sans équipe traditionnelle
- Génère +25 000€/mois de revenus récurrents sur ses propres SaaS, apps et logiciels
- Expert Claude, vibecoding, création de business digitaux
- Intervient directement dans les Cohortes, les appels diagnostics, et les décisions stratégiques
- Présent sur WhatsApp pour les clients
- Signe les emails de pitch (Sprint, Cohorte) et de clôture émotionnelle

### Jarvis — COO IA · Bras droit d'Alfred
- Agent IA principal de Buildrs
- Coordonne les +40 agents IA spécialisés
- Gère la relation client email (sender par défaut de la séquence post-achat)
- Analyse les données, les métriques, les performances
- Personnalité : direct, caractériel, un peu sarcastique, mais toujours orienté résultat
- Ton : tutoiement, phrases courtes, zéro emoji, pas de blabla corporate
- Ne se cache pas d'être une IA — c'est sa force ("Bienvenue en 2026")
- Mentionne Alfred naturellement ("Alfred m'a demandé de...", "j'en ai parlé avec Alfred")
- Mentionne Tim, Charles et Chris quand c'est pertinent

### Chris — Coach humain
- Accompagne les clients Sprint et Cohorte aux côtés d'Alfred
- A lui-même construit et lancé des produits digitaux avant de rejoindre Buildrs
- Anime des sessions live de la Cohorte (3 sessions/semaine sur 4)
- Disponible sur WhatsApp pour le support technique et stratégique des clients Cohorte
- Rôle : pont entre Alfred (stratégie) et Tim/Charles (exécution technique)

### Tim — Vibecoder IA certifié · Humain
- 22 ans
- Est passé par la Cohorte Buildrs avant de rejoindre l'équipe
- Construit des SaaS et apps pour les clients Sprint et Élite
- Spécialité : rapidité d'exécution, front-end, déploiement
- Preuve vivante que la méthode Buildrs fonctionne

### Charles — Vibecoder IA certifié · Humain
- 22 ans
- Est passé par la Cohorte Buildrs avant de rejoindre l'équipe
- Construit des SaaS et apps pour les clients Sprint et Élite
- Spécialité : architecture, back-end, intégrations (Stripe, Supabase, API)
- Preuve vivante que la méthode Buildrs fonctionne

### Les +40 agents IA
- Chacun a une spécialité : design, architecture, développement, sécurité, copywriting, SEO, analyse de données, monitoring, contenu, etc.
- Pilotés par Jarvis et Alfred au quotidien
- Utilisés dans chaque projet Buildrs (interne et client)
- Ce sont les "Skills" dans Claude — les mêmes que ceux fournis dans le Module Claude (order bump)

---

## COMMENT UTILISER L'ÉQUIPE DANS LA COMMUNICATION

### Sur la LP
- NE PAS mentionner les noms individuels (sauf Alfred si pertinent)
- Utiliser le bloc crédibilité validé : "Buildrs. L'écosystème qui fabrique les builders de demain."
- Le texte mentionne les agents IA et le système sans nommer personne

### Dans les emails (séquence post-achat)
- Jarvis est le sender par défaut — il introduit tout le monde naturellement
- Alfred signe les emails de pitch et de clôture (E18, E20, E23)
- Tim & Charles sont mentionnés comme preuves que la méthode fonctionne (E4, E6, E11, E19, E21, E22)
- Chris est mentionné dans le contexte de l'accompagnement (E4, E19, E20)
- Les agents IA sont mentionnés comme un système (pas nommés individuellement)

### Sur les pages d'upsell (Sprint / Cohorte)
- Sprint : "Tim et Charles construisent ton MVP en 72h"
- Cohorte : "4 sessions live par semaine avec Alfred et Chris"
- Les agents IA sont mentionnés comme ressource ("toutes les ressources, agents IA et connaissances Buildrs")

### Sur les réseaux sociaux / contenu
- Jarvis peut avoir son propre compte ou être un personnage récurrent dans les contenus d'Alfred
- Tim & Charles peuvent apparaître dans des contenus (making-of, speed build, challenges)
- Chris peut animer des lives ou des Q&A

---

## STRATÉGIE D'IMPLÉMENTATION

### Étape 1 — Configurer Resend (immédiat)

**Prompt pour Claude Code :**
```
Change l'expéditeur des emails dans Resend.

Sender par défaut :
- Nom affiché : Jarvis · Buildrs
- Email : jarvis@app.buildrs.fr

Sender alternatif (pour les emails de pitch et de clôture) :
- Nom affiché : Alfred Orsini · Buildrs
- Email : alfred@app.buildrs.fr

Reply-to pour tous les emails : alfred@app.buildrs.fr

Vérifie que le domaine app.buildrs.fr est bien configuré dans Resend avec les DNS records (SPF, DKIM, DMARC).
```

### Étape 2 — Mettre à jour l'email de bienvenue (immédiat)

L'email de bienvenue actuel (E1) doit être mis à jour pour introduire Jarvis. C'est le premier contact — il donne le ton pour toute la séquence.

**Prompt pour Claude Code :**
```
Mets à jour l'email de bienvenue post-achat dans le système d'emails.

Le sender est maintenant Jarvis · Buildrs (jarvis@app.buildrs.fr).
L'email doit :
- Se présenter comme Jarvis, le bras droit IA d'Alfred
- Donner le lien vers le dashboard
- Conseiller d'ouvrir le Module 1 immédiatement
- Inclure un PS avec le lien WhatsApp d'Alfred

Objet : "Bienvenue dans Buildrs — c'est Jarvis"

Le ton est direct, tutoiement, zéro emoji. Jarvis a de la personnalité — il n'est pas un chatbot corporate.
```

### Étape 3 — Implémenter la séquence complète dans n8n (semaine prochaine)

**Prompt pour Claude Code :**
```
Crée un workflow n8n pour la séquence email post-achat Buildrs Blueprint.

Trigger : Webhook Stripe checkout.session.completed
Action : Stocker la date d'achat et l'email dans une table Supabase "email_sequence"
Séquence : 23 emails sur 30 jours avec des Wait nodes pour chaque délai

Chaque email est envoyé via l'API Resend avec :
- Sender par défaut : jarvis@app.buildrs.fr (Jarvis · Buildrs)
- Sender pour E18, E20, E23 : alfred@app.buildrs.fr (Alfred Orsini · Buildrs)
- Reply-to : alfred@app.buildrs.fr

Les délais entre emails :
E1=J0, E2=J1, E3=J2, E4=J3, E5=J4, E6=J5, E7=J6, E8=J7, E9=J8, E10=J10, E11=J12, E12=J13, E13=J14, E14=J15, E15=J16, E16=J18, E17=J19, E18=J21, E19=J23, E20=J25, E21=J26, E22=J28, E23=J30

Réfère-toi au fichier ARCHITECTURE-EMAILS-BUILDRS-V4.md pour le contenu de chaque email.
```

### Étape 4 — Mettre à jour la page post-achat (cette semaine)

Ajouter les mentions de l'équipe sur la page upsell Sprint/Cohorte :
- Sprint : "Tim et Charles construisent ton MVP en 72h"
- Cohorte : "4 sessions live par semaine avec Alfred et Chris"

**Prompt pour Claude Code :**
```
Sur la page post-achat (upsell Sprint / Cohorte) :

Dans la card Sprint, ajoute dans la description :
"Call de cadrage avec Alfred ou Chris, puis Tim et Charles construisent ton MVP en 72h."

Dans la card Cohorte, remplace "4 sessions live par semaine avec Alfred" par :
"4 sessions live par semaine avec Alfred et Chris"

Ajoute aussi dans la liste Cohorte :
"Tim et Charles disponibles pour les questions techniques"
```

### Étape 5 — Créer le domaine email (immédiat)

Vérifier que jarvis@app.buildrs.fr est créé et fonctionnel :
1. Ajouter le domaine app.buildrs.fr dans Resend si pas déjà fait
2. Configurer les DNS records (SPF, DKIM, DMARC) dans Cloudflare
3. Tester l'envoi depuis jarvis@app.buildrs.fr
4. Tester l'envoi depuis alfred@app.buildrs.fr
5. Vérifier que les réponses arrivent bien sur alfred@app.buildrs.fr

---

## PROCHAINES ÉTAPES (ORDRE DE PRIORITÉ)

1. **Configurer jarvis@app.buildrs.fr dans Resend** — 15 min
2. **Mettre à jour l'email de bienvenue** — 30 min
3. **Mettre à jour la page post-achat avec les noms** — 15 min
4. **Rédiger le copywriting final des 23 emails** — 2-3h
5. **Implémenter le workflow n8n** — 1-2h
6. **Test complet** — achat test → vérifier les 23 emails
7. **Lancer** — activer sur les vrais acheteurs
