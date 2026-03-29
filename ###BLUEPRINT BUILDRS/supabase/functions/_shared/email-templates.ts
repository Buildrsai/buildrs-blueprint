// _shared/email-templates.ts
// 23 templates email post-achat Blueprint — séquence Jarvis/Alfred sur 30 jours

export const SENDERS = {
  jarvis: 'Jarvis · Buildrs <jarvis@app.buildrs.fr>',
  alfred: 'Alfred Orsini · Buildrs <alfred@app.buildrs.fr>',
}

export const REPLY_TO = 'alfred@app.buildrs.fr'

// Correspondance step (1-23) → jour depuis l'achat
export const STEP_TO_DAY: Record<number, number> = {
  1: 0,  2: 1,  3: 2,  4: 3,  5: 4,
  6: 5,  7: 6,  8: 7,  9: 8,  10: 10,
  11: 12, 12: 13, 13: 14, 14: 15, 15: 16,
  16: 18, 17: 19, 18: 21, 19: 23, 20: 25,
  21: 26, 22: 28, 23: 30,
}

const URL = {
  dashboard: 'https://buildrs.fr/#/dashboard',
  signin:    'https://buildrs.fr/#/signin',
  cal:       'https://cal.com/team-buildrs/secret',
  whatsapp:  'https://wa.me/33744755735',
  sprint:    'https://buildrs.fr/#/sprint',
  cohort:    'https://buildrs.fr/#/upsell-cohort',
}

// ─── Helpers HTML ──────────────────────────────────────────────────────────────

function p(text: string): string {
  return `<p style="margin:0 0 14px;font-size:15px;color:#a1a1aa;line-height:1.65;">${text}</p>`
}

function bold(text: string): string {
  return `<span style="color:#fafafa;font-weight:600;">${text}</span>`
}

function cta(label: string, href: string): string {
  return `
<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="border-radius:10px;background:#fafafa;">
      <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#09090b;text-decoration:none;letter-spacing:-0.01em;border-radius:10px;">${label} →</a>
    </td>
  </tr>
</table>`
}

function ctaOutline(label: string, href: string): string {
  return `
<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="border-radius:10px;border:1px solid #27272a;">
      <a href="${href}" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:600;color:#fafafa;text-decoration:none;letter-spacing:-0.01em;border-radius:10px;">${label} →</a>
    </td>
  </tr>
</table>`
}

function divider(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #27272a;height:1px;"></td></tr></table>`
}

function ps(text: string): string {
  return `${divider()}<p style="margin:0;font-size:13px;color:#52525b;line-height:1.65;">PS — ${text}</p>`
}

function card(title: string, label: string, body: string): string {
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
  <tr>
    <td style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:18px 20px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.09em;">${label}</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#fafafa;line-height:1.35;letter-spacing:-0.02em;">${title}</p>
      <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">${body}</p>
    </td>
  </tr>
</table>`
}

function layout(opts: {
  caption?: string
  heading: string
  body: string
  signedBy?: string
}): string {
  const year = new Date().getFullYear()
  const caption = opts.caption
    ? `<p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.1em;">${opts.caption}</p>`
    : ''
  const signed = opts.signedBy
    ? `<p style="margin:24px 0 0;font-size:14px;color:#71717a;">— ${opts.signedBy}</p>`
    : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr>
        <td style="padding-bottom:28px;">
          <span style="font-size:18px;font-weight:800;color:#fafafa;letter-spacing:-0.05em;">Buildrs</span>
        </td>
      </tr>
      <tr>
        <td style="background:#111113;border:1px solid #27272a;border-radius:16px;padding:40px;">
          ${caption}
          <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#fafafa;letter-spacing:-0.03em;line-height:1.3;">${opts.heading}</h1>
          ${opts.body}
          ${signed}
        </td>
      </tr>
      <tr>
        <td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#3f3f46;">© ${year} Buildrs Group · Tous droits réservés</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ─── 23 Templates ──────────────────────────────────────────────────────────────

export interface EmailTemplate {
  step:    number
  day:     number
  subject: string
  sender:  'jarvis' | 'alfred'
  html:    string
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [

  // ── E1 · J0 · Immédiat ─────────────────────────────────────────────────────
  {
    step: 1, day: 0,
    subject: 'Bienvenue dans Buildrs — c\'est Jarvis',
    sender: 'jarvis',
    html: layout({
      caption: 'Buildrs Blueprint — Accès activé',
      heading: 'Salut. Je suis Jarvis.',
      body: `
        ${p(`Je suis ${bold('le bras droit IA d\'Alfred chez Buildrs')}. C\'est moi qui vais t\'accompagner dans les prochains jours.`)}
        ${p(`Alfred m\'a demandé de m\'assurer que tu ne laisses pas cette opportunité dans un coin. Et je prends ça très au sérieux.`)}
        ${p(`Ton Blueprint est prêt. ${bold('7 modules')}. Tout ce qu\'il faut pour créer et monétiser ton premier produit digital.`)}
        ${p(`Conseil : ouvre le Module 1 maintenant, pendant que tu es encore dans l\'élan. ${bold('Les prochaines 24h sont décisives.')}`)}
        ${cta('Accéder à mon Blueprint', URL.dashboard)}
        ${ps(`Si tu veux un accès direct à Alfred pendant que tu avances, écris-lui ici : <a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a>. Pas de groupe. Juste toi et lui.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E2 · J1 ────────────────────────────────────────────────────────────────
  {
    step: 2, day: 1,
    subject: 'Le piège des 24 premières heures',
    sender: 'jarvis',
    html: layout({
      heading: 'Si tu n\'ouvres pas le Module 1 aujourd\'hui, tu ne l\'ouvriras jamais.',
      body: `
        ${p(`Tu as acheté le Blueprint hier. Et statistiquement, si tu n\'ouvres pas le Module 1 aujourd\'hui, tu ne l\'ouvriras jamais.`)}
        ${p(`J\'ai vu passer des centaines de personnes. Le pattern est toujours le même : excitation, procrastination, oubli. ${bold('Je ne veux pas que tu deviennes une statistique.')}`)}
        ${p(`Ouvre le Module 1. Lis les 5 premières minutes. C\'est tout.`)}
        ${cta('Ouvrir le Module 1', URL.dashboard)}
        ${ps(`Tu as déjà commencé ? Réponds à cet email et dis-moi où tu en es. Je lis tout.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E3 · J2 ────────────────────────────────────────────────────────────────
  {
    step: 3, day: 2,
    subject: 'Un ado de 19 ans a revendu son app 100 millions',
    sender: 'jarvis',
    html: layout({
      heading: 'Zach Yadegari avait 17 ans. Une seule fonctionnalité.',
      body: `
        ${p(`Photo → calories. C\'est tout. Pas d\'usine à gaz.`)}
        ${p(`Il a construit ${bold('Cal AI')} avec des outils IA à une époque où personne n\'y croyait encore. Concept basique : prends une photo de ton repas, l\'IA compte les calories.`)}
        ${p(`Le résultat :`)}
        <ul style="margin:0 0 14px;padding-left:20px;color:#a1a1aa;font-size:15px;line-height:2;">
          <li>15 millions de téléchargements en 18 mois</li>
          <li>40 millions de dollars de revenus annuels récurrents</li>
          <li>Racheté par MyFitnessPal pour <strong style="color:#fafafa;">plus de 100 millions de dollars</strong></li>
        </ul>
        ${p(`Il n\'a pas inventé le tracking de calories. Il a juste rendu l\'expérience ${bold('10x plus simple avec l\'IA')}. Pas besoin de 50 fonctionnalités. Juste un problème, une solution simple, et l\'IA comme moteur.`)}
        ${p(`C\'est exactement ce que le Blueprint t\'apprend à faire.`)}
        ${cta('Continuer le Blueprint', URL.dashboard)}
        ${ps(`Que ce soit du B2B ou du B2C, une app ou un SaaS — le procédé est le même. Le Blueprint couvre tout. <a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a>`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E4 · J3 ────────────────────────────────────────────────────────────────
  {
    step: 4, day: 3,
    subject: 'L\'équipe derrière ce que tu viens d\'acheter',
    sender: 'jarvis',
    html: layout({
      heading: 'Tu te demandes peut-être qui se cache derrière Buildrs.',
      body: `
        ${p(`Laisse-moi te présenter la famille.`)}
        ${p(`Je commence par moi. Je suis ${bold('Jarvis')}, le COO IA de Buildrs. Je coordonne les agents, j\'analyse les données, je gère une partie de la relation client. Oui, c\'est ${bold('un agent IA qui t\'écrit')}. Bienvenue en 2026.`)}
        ${p(`${bold('Alfred Orsini')}, c\'est le fondateur. C\'est lui qui a construit cet écosystème qui génère ${bold('+25 000€/mois')} de revenus récurrents sur ses propres SaaS, apps et logiciels. Pas de levée de fonds. Pas d\'équipe de 50 personnes. Un système.`)}
        ${p(`${bold('Chris')}, c\'est le coach. Il accompagne les clients Sprint et Cohorte aux côtés d\'Alfred. Il a lui-même construit et lancé des produits digitaux avant de rejoindre Buildrs.`)}
        ${p(`${bold('Tim et Charles')}, 22 ans, sont les vibecoders certifiés de Buildrs. Ils sont passés par la Cohorte, et maintenant ils construisent des produits à une vitesse que la plupart des agences ne peuvent pas suivre. La preuve que la méthode fonctionne.`)}
        ${p(`Et puis il y a nous — les ${bold('+40 agents IA')}. Chacun a une spécialité. Design, architecture, développement, sécurité, copywriting, SEO. Quand tu rejoins Buildrs, tu ne travailles pas avec un seul cerveau. Tu travailles avec un système complet.`)}
        ${p(`Nos propres produits — ceux qui génèrent +25K/mois — sont construits avec exactement la même méthode et le même stack que le Blueprint. On ne t\'enseigne pas la théorie. On te partage ce qui marche.`)}
        ${cta('Continuer le Blueprint', URL.dashboard)}
        ${ps(`Si tu veux parler à Alfred directement : <a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a>`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E5 · J4 ────────────────────────────────────────────────────────────────
  {
    step: 5, day: 4,
    subject: 'Pourquoi le SaaS et pas le reste',
    sender: 'jarvis',
    html: layout({
      heading: 'Formation, coaching, e-commerce. Et pourtant, le SaaS est au-dessus.',
      body: `
        ${p(`Tu pourrais vendre des formations, faire du coaching, lancer un e-commerce. Voici pourquoi le SaaS est la meilleure option.`)}
        <ul style="margin:0 0 14px;padding-left:20px;color:#a1a1aa;font-size:15px;line-height:2.2;">
          <li>Marché SaaS mondial : ${bold('399 milliards en 2024')}, projection 819 milliards en 2030</li>
          <li>Micro-SaaS : croissance de ${bold('30% par an')}</li>
          <li>${bold('Revenus récurrents')} — tu ne repars pas de zéro chaque mois</li>
          <li>Marges ${bold('80-95%')} — pas de stock, pas de logistique, pas de SAV produit</li>
          <li>Un SaaS se valorise ${bold('3x à 10x son revenu annuel')} — c\'est un actif revendable</li>
        </ul>
        ${p(`Un coach doit vendre chaque mois. Un e-commerçant gère du stock et des retours. ${bold('Un SaaS accumule.')}`)}
        ${cta('Continuer le Blueprint', URL.dashboard)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E6 · J5 ────────────────────────────────────────────────────────────────
  {
    step: 6, day: 5,
    subject: 'Ce que personne ne te dit sur le code',
    sender: 'jarvis',
    html: layout({
      heading: 'Tu n\'as pas besoin d\'apprendre à coder.',
      body: `
        ${p(`Tu as besoin d\'apprendre à ${bold('diriger une IA qui code pour toi')}.`)}
        ${p(`Tu n\'as pas besoin de savoir construire une maison pour être promoteur. Tu diriges les artisans.`)}
        ${p(`Claude change tout — tu décris ce que tu veux, l\'IA construit. ${bold('Le fondateur de Cal AI')} a utilisé des outils IA. Danny Postma a lancé Chatbase (${bold('50K$/mois')}) en solo. PDF.ai construit par un seul dev. Aucun n\'avait une équipe de 20 ingénieurs.`)}
        ${p(`Tim et Charles chez Buildrs ont 22 ans. Ils n\'ont pas fait d\'école d\'ingénieur. Ils ont appris à diriger Claude. Et maintenant ils livrent des SaaS pour nos clients.`)}
        ${cta('Module suivant', URL.dashboard)}
        ${ps(`Si tu doutes encore, envoie ton idée à Alfred sur WhatsApp. Il te dit en 2 min si c\'est faisable. Et si tu veux qu\'on construise ton SaaS pour toi en 72h — <a href="${URL.whatsapp}" style="color:#71717a;">écris-lui</a>.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E7 · J6 ────────────────────────────────────────────────────────────────
  {
    step: 7, day: 6,
    subject: '100 clients x 29€ = ta liberté',
    sender: 'jarvis',
    html: layout({
      heading: 'Fais ce calcul avec moi. Ça prend 30 secondes.',
      body: `
        ${p(`100 clients à 29€/mois = ${bold('2 900€/mois récurrents')}. Chaque mois. Sans revendu.`)}
        ${p(`200 clients = 5 800€. 500 clients = 14 500€.`)}
        ${p(`Marge nette : 80-90%. Sur 2 900€/mois, tu gardes ${bold('2 300-2 600€ net')}.`)}
        ${p(`Valorisation : un SaaS à 5 000€/mois se revend entre ${bold('150 000 et 500 000€')}.`)}
        ${p(`Tu ne construis pas juste un revenu. ${bold('Tu construis un actif.')}`)}
        ${cta('Module 4 — définis ton pricing', URL.dashboard)}
        ${ps(`Tu n\'as pas le temps de construire toi-même ? On peut te livrer ton SaaS complet en 72h. <a href="${URL.whatsapp}" style="color:#71717a;">Écris à Alfred.</a>`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E8 · J7 ────────────────────────────────────────────────────────────────
  {
    step: 8, day: 7,
    subject: 'Ton bilan de la première semaine',
    sender: 'jarvis',
    html: layout({
      heading: 'Ça fait 7 jours. Peu importe où tu en es.',
      body: `
        ${p(`Trois scénarios possibles :`)}
        ${card('Tu fais partie des 10% qui exécutent.', 'Tu as tout terminé', 'Prochaine étape : lancer. Réserve un call avec Alfred pour valider.')}
        ${card('Normal, continue à ton rythme.', 'Tu es en cours', 'Le système est là. Prends le prochain module aujourd\'hui.')}
        ${card('Pas de jugement. Mais sois honnête.', 'Tu n\'as pas commencé', 'Qu\'est-ce qui bloque vraiment ? Alfred peut t\'aider à identifier et débloquer ça en 15 min.')}
        ${p(`Si tu veux qu\'Alfred regarde avec toi où tu en es, prends 15 min. C\'est gratuit.`)}
        ${cta('Prendre 15 min avec Alfred', URL.cal)}
        ${ps(`Pour les questions rapides : <a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a>`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E9 · J8 ────────────────────────────────────────────────────────────────
  {
    step: 9, day: 8,
    subject: '4 produits IA que personne n\'a encore construits',
    sender: 'jarvis',
    html: layout({
      heading: 'Tu n\'as pas besoin de l\'idée du siècle.',
      body: `
        ${p(`Tu as besoin d\'un angle que personne n\'a encore pris.`)}
        ${card('Un assistant IA qui négocie tes abonnements', 'Idée 1', 'L\'IA repère tous tes abonnements et génère des scripts pour baisser chaque facture. 9,99€/mois. 300 utilisateurs = 2 997€/mois.')}
        ${card('Un SaaS de gestion de gardes pour parents séparés', 'Idée 2', 'Planning partagé, suivi des échanges, historique pour les avocats. Zéro solution propre en francophone. 39€/mois par famille.')}
        ${card('Un générateur de contrats freelance par IA', 'Idée 3', '5 questions → contrat PDF solide. Marché : 1,3 million de freelances en France. 14,99€/mois illimité.')}
        ${card('Une app de micro-paris entre amis', 'Idée 4', '"Je parie que tu ne tiens pas 30 jours sans sucre." Freemium + 2,99€/mois premium. Potentiel viral énorme.')}
        ${p(`Le Blueprint te montre comment construire chacune de ces idées.`)}
        ${cta('Module 3 — Valider ton idée', URL.dashboard)}
        ${ps(`Tu as une idée mais tu sais pas si elle tient ? Envoie-la à Alfred — <a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a>.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E10 · J10 ──────────────────────────────────────────────────────────────
  {
    step: 10, day: 10,
    subject: '3 217€/mois avec un outil moche',
    sender: 'jarvis',
    html: layout({
      heading: 'L\'interface est basique. Le logo est générique. Et pourtant, ça tourne.',
      body: `
        ${p(`Senja.io — outil de collecte de témoignages. ${bold('1M$ ARR')}. Une seule fonctionnalité. Pas le plus beau produit du marché.`)}
        ${p(`${bold('Le marché ne paie pas la beauté.')} Il paie la résolution de problèmes.`)}
        ${p(`Les fondateurs micro-SaaS dépensent en moyenne ${bold('moins de 1 000€')} avant le premier revenu. Ton MVP n\'a pas besoin d\'être parfait. Il a besoin d\'exister.`)}
        ${p(`Combien de temps tu passes à vouloir que ce soit "parfait" avant de lancer ?`)}
        ${cta('Continuer le Blueprint', URL.dashboard)}
        ${ps(`Ton produit n\'a pas besoin d\'être beau pour rapporter. Il a besoin d\'être ${bold('live')}.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E11 · J12 ──────────────────────────────────────────────────────────────
  {
    step: 11, day: 12,
    subject: 'La question que tu n\'oses pas poser',
    sender: 'jarvis',
    html: layout({
      heading: 'Est-ce que ça va marcher pour moi ?',
      body: `
        ${p(`C\'est ça que tu te demandes. Et c\'est normal.`)}
        ${p(`Les 3 conditions : un ${bold('problème réel')}, une ${bold('solution simple')}, et ${bold('l\'exécution')}. Le Blueprint te donne les 3. Mais le dernier dépend de toi.`)}
        ${p(`Tim avait exactement les mêmes doutes il y a 8 mois. Aujourd\'hui il livre des SaaS pour nos clients Sprint.`)}
        ${p(`Si tu veux en parler avec Alfred, prends 15 min. Aucun engagement.`)}
        ${cta('15 min avec Alfred — gratuit', URL.cal)}
        ${ps(`<a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a> pour les questions rapides.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E12 · J13 ──────────────────────────────────────────────────────────────
  {
    step: 12, day: 13,
    subject: 'Ils n\'avaient rien de plus que toi',
    sender: 'jarvis',
    html: layout({
      heading: 'Pas de diplôme en info. Pas de budget. Pas d\'équipe.',
      body: `
        ${p(`Et pourtant.`)}
        ${card('Chatbase — 50K$/mois', 'Danny Postma', 'Solo, aucune expérience IA au départ. Il a juste construit un widget de chatbot simple. 50 000$ par mois aujourd\'hui.')}
        ${card('Plann — 1M$ en 2 ans', 'Christy Laurence', 'Non-technique. A construit un planificateur de contenu Instagram. Sans toucher à une ligne de code au départ.')}
        ${card('PDF.ai', 'Seth Kramer', 'Solo dev. Concept : parle à tes PDFs. Simple, direct, efficace.')}
        ${card('Subscribr — 50 pré-ventes (20K$) avant une ligne de code', 'Gil Hildebrand', 'A validé avec 50 pré-ventes payantes. Zéro ligne de code avant le premier euro.')}
        ${p(`La différence entre eux et toi ? ${bold('Ils ont commencé. C\'est tout.')}`)}
        ${cta('Continuer le Blueprint', URL.dashboard)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E13 · J14 ──────────────────────────────────────────────────────────────
  {
    step: 13, day: 14,
    subject: 'Ton SaaS vaut 20x ce qu\'il rapporte',
    sender: 'jarvis',
    html: layout({
      heading: 'Un SaaS à 1 000€/mois se revend entre 20 000 et 40 000€.',
      body: `
        ${p(`Relis cette phrase.`)}
        ${p(`Comment ça marche :`)}
        <ul style="margin:0 0 14px;padding-left:20px;color:#a1a1aa;font-size:15px;line-height:2.2;">
          <li>2 000€/mois = valorisation ${bold('40 000-80 000€')}</li>
          <li>5 000€/mois = valorisation ${bold('100 000-200 000€')}</li>
          <li>Plateformes : Acquire.com, Flippa</li>
        </ul>
        ${p(`Tu peux construire un SaaS en 6 jours, le faire tourner 6-12 mois, puis le revendre pour un gros chèque. Et recommencer.`)}
        ${p(`Cal AI a été revendu 100 millions. Ton SaaS n\'a pas besoin d\'aller aussi loin. ${bold('30 000€ de revente pour 6 jours de travail')}, c\'est déjà un deal incroyable.`)}
        ${p(`Tu ne crées pas juste un revenu mensuel. ${bold('Tu crées un actif.')}`)}
        ${cta('Module 3 — construis ton actif', URL.dashboard)}
        ${ps(`Tu veux aller plus vite ? On peut construire ton SaaS en 72h. <a href="${URL.whatsapp}" style="color:#71717a;">Écris à Alfred.</a>`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E14 · J15 ──────────────────────────────────────────────────────────────
  {
    step: 14, day: 15,
    subject: 'Claude n\'est pas ChatGPT',
    sender: 'jarvis',
    html: layout({
      heading: 'Si tu utilises ChatGPT pour construire, tu te bats avec un bras dans le dos.',
      body: `
        ${p(`Pourquoi Claude est différent :`)}
        ${card('Accès direct à tes fichiers, ton terminal, ton projet', 'Claude Code', 'Tu ne colles plus du code dans un chat. Claude travaille directement dans ton projet.')}
        ${card('Un agent qui travaille en arrière-plan', 'Claude Cowork', 'Tu décris la tâche. Claude exécute. Tu reviens et c\'est fait.')}
        ${card('Plus de contexte = moins de répétitions', 'Fenêtre de contexte', 'Claude retient plus d\'informations sur ton projet, ce qui évite les allers-retours constants.')}
        ${p(`Chez Buildrs, on a testé tous les LLM. Claude est le seul qui nous permet de sortir des ${bold('produits en production')}. Pas des prototypes.`)}
        ${p(`C\'est pour ça qu\'on a créé le Module Claude — pour que ton Claude soit configuré exactement comme le nôtre.`)}
        ${cta('Continuer le Blueprint', URL.dashboard)}
        ${ps(`Des questions sur le setup Claude ? <a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a>`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E15 · J16 ──────────────────────────────────────────────────────────────
  {
    step: 15, day: 16,
    subject: 'J\'ai une question pour toi',
    sender: 'jarvis',
    html: layout({
      heading: 'Pas de lien. Pas de pitch. Juste une question.',
      body: `
        ${p(`Ça fait 16 jours que tu as le Blueprint. Alfred veut savoir une seule chose :`)}
        <p style="margin:0 0 14px;font-size:20px;font-weight:700;color:#fafafa;line-height:1.4;letter-spacing:-0.03em;">"Qu\'est-ce qui te bloque le plus en ce moment ?<br>L\'idée, la technique, ou le temps ?"</p>
        ${p(`Réponds à cet email avec un seul mot. Alfred lit tout. Et il te répondra personnellement.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E16 · J18 ──────────────────────────────────────────────────────────────
  {
    step: 16, day: 18,
    subject: 'Le SaaS en 2026 : les chiffres qui comptent',
    sender: 'jarvis',
    html: layout({
      heading: 'Tout le monde dit que l\'IA change tout. Voici les chiffres concrets.',
      body: `
        <ul style="margin:0 0 14px;padding-left:20px;color:#a1a1aa;font-size:15px;line-height:2.2;">
          <li>Marché SaaS mondial 2026 : ${bold('375 milliards de dollars')}</li>
          <li>Micro-SaaS : croît ${bold('3,4x plus vite')} que le marché global</li>
          <li>Coût moyen de lancement d\'un micro-SaaS : ${bold('< 500€')}</li>
          <li>Temps moyen pour 1 000€/mois : ${bold('3-6 mois')}</li>
          <li>Valorisation moyenne à la revente : ${bold('30-40x le MRR')}</li>
        </ul>
        ${p(`La fenêtre est ouverte. Ceux qui se lancent maintenant ont 3 ans d\'avance.`)}
        ${p(`Tu as le plan. La question c\'est : tu avances seul ou tu veux accélérer ?`)}
        ${cta('15 min pour faire le point', URL.cal)}
        ${ps(`<a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a> si tu préfères écrire directement.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E17 · J19 ──────────────────────────────────────────────────────────────
  {
    step: 17, day: 19,
    subject: 'Le Blueprint était le début',
    sender: 'jarvis',
    html: layout({
      heading: 'Tu as le système. Tu as les outils. Tu as la méthode.',
      body: `
        ${p(`Maintenant, parlons de la suite.`)}
        ${p(`Certains d\'entre vous ont déjà un MVP live. D\'autres sont encore en réflexion. Les deux sont OK.`)}
        ${p(`Le Blueprint te montre le chemin. Il ne marche pas à ta place.`)}
        ${p(`Pour certains, le plus gros blocage n\'est pas le savoir. ${bold('C\'est le passage à l\'action.')}`)}
        ${p(`Alfred a deux solutions concrètes à te proposer. Prends 15 min pour en parler.`)}
        ${cta('Parler avec Alfred', URL.cal)}
        ${ps(`<a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a> si tu préfères.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E18 · J21 · ALFRED ─────────────────────────────────────────────────────
  {
    step: 18, day: 21,
    subject: 'Ton SaaS live en 72h — sans effort de ta part',
    sender: 'alfred',
    html: layout({
      caption: 'Buildrs Sprint · 497€',
      heading: 'C\'est Alfred. Pas Jarvis. Cette fois c\'est moi qui écris.',
      body: `
        ${p(`Le Buildrs Sprint, c\'est simple : tu me donnes ton idée — ou on en trouve une ensemble en 30 min.`)}
        ${p(`En ${bold('72 heures')}, tu as :`)}
        <ul style="margin:0 0 20px;padding-left:20px;color:#a1a1aa;font-size:15px;line-height:2.2;">
          <li>Un MVP fonctionnel avec ta fonctionnalité principale</li>
          <li>Ton identité visuelle et ton branding</li>
          <li>L\'inscription utilisateur configurée</li>
          <li>Ton produit déployé en ligne avec ton domaine</li>
          <li>Ta page de vente prête</li>
          <li>3-5 créas publicitaires prêtes à lancer</li>
          <li>Ton code source sur GitHub</li>
        </ul>
        ${p(`Tout le kit. Prêt à lancer.`)}
        <p style="margin:0 0 14px;font-size:15px;color:#a1a1aa;line-height:1.65;">Prix : <span style="text-decoration:line-through;color:#52525b;">997€</span> ${bold('497€')}</p>
        ${p(`Un freelance te facture 3 000-8 000€ pour ça. Et il met 3 semaines.`)}
        ${cta('Réserver mon Sprint', URL.cal)}
        ${ps(`Tu préfères construire avec moi plutôt que déléguer ? Lis l\'email de jeudi.`)}
      `,
      signedBy: 'Alfred',
    }),
  },

  // ── E19 · J23 ──────────────────────────────────────────────────────────────
  {
    step: 19, day: 23,
    subject: 'Ce que reçoit un client Sprint',
    sender: 'jarvis',
    html: layout({
      heading: 'Alfred m\'a demandé de te montrer exactement ce qui se passe.',
      body: `
        ${p(`Voici le déroulé heure par heure d\'un Buildrs Sprint :`)}
        ${card('Call de cadrage 30 min avec Alfred ou Chris', 'Heure 0', 'On définit ensemble le produit, les fonctionnalités prioritaires, et le positionnement.')}
        ${card('Tim et Charles construisent le MVP', 'Heure 1 → 24', 'Architecture, base de données, authentification, fonctionnalité principale. En production.')}
        ${card('Page de vente et créas publicitaires', 'Heure 24 → 48', 'Ta landing page rédigée et designée. 3-5 créas Meta Ads prêtes à diffuser.')}
        ${card('Déploiement et livraison', 'Heure 48 → 72', 'Ton domaine connecté. Tu reçois le code source sur GitHub. Tout est live.')}
        ${p(`Tu te réveilles lundi avec une idée. ${bold('Tu te couches jeudi avec un produit en ligne.')}`)}
        ${cta('Réserver mon Sprint — 497€', URL.cal)}
        ${ps(`Si tu préfères construire avec un accompagnement, lis le prochain email.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E20 · J25 · ALFRED ─────────────────────────────────────────────────────
  {
    step: 20, day: 25,
    subject: '60 jours. Un SaaS rentable. Garanti.',
    sender: 'alfred',
    html: layout({
      caption: 'Buildrs Cohorte · 1 497€',
      heading: 'C\'est encore Alfred. Si je t\'écris directement, c\'est que c\'est important.',
      body: `
        ${p(`La Buildrs Cohorte, c\'est ${bold('60 jours d\'accompagnement intensif')}. On fait tout ensemble.`)}
        <ul style="margin:0 0 20px;padding-left:20px;color:#a1a1aa;font-size:15px;line-height:2.2;">
          <li>${bold('4 sessions live par semaine')} avec Alfred et Chris</li>
          <li>WhatsApp privé — accès direct pendant 60 jours</li>
          <li>Tim et Charles disponibles pour les questions techniques</li>
          <li>Jarvis et les agents IA à ta disposition</li>
        </ul>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#fafafa;letter-spacing:-0.02em;">Garantie résultat</p>
              <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.65;">${bold('1 000€/mois dans les 90 jours')}. Sinon, remboursement intégral. Sans conditions.</p>
            </td>
          </tr>
        </table>
        ${p(`Bonus : Weekend Build Together (juillet 2026) — valeur 597€`)}
        <p style="margin:0 0 14px;font-size:15px;color:#a1a1aa;line-height:1.65;">Prix : <span style="text-decoration:line-through;color:#52525b;">2 497€</span> ${bold('1 497€')} ou ${bold('3x 499€')} sans frais</p>
        ${p(`12 places max. 7 déjà prises.`)}
        ${cta('Réserver ma place', URL.cal)}
      `,
      signedBy: 'Alfred',
    }),
  },

  // ── E21 · J26 ──────────────────────────────────────────────────────────────
  {
    step: 21, day: 26,
    subject: '6 mois seul ou 60 jours accompagné ?',
    sender: 'jarvis',
    html: layout({
      heading: 'C\'est une vraie question. Pas une tournure marketing.',
      body: `
        ${card('Tu as le plan, tu avances à ton rythme.', 'Seul avec le Blueprint', 'Risque : tu te perds au module 4. Le plus courant.')}
        ${card('On te livre en 72h.', 'Buildrs Sprint — 497€', 'Risque : tu ne comprends pas assez pour évoluer seul. Moins de progression personnelle.')}
        ${card('On construit ensemble.', 'Buildrs Cohorte — 1 497€', 'Risque : aucun — garanti ou remboursé. Les clients Cohorte atteignent leur premier revenu 4x plus vite.')}
        ${p(`Tim et Charles sont passés par la Cohorte. Aujourd\'hui ils construisent pour Buildrs.`)}
        ${p(`La seule mauvaise décision, c\'est de ne rien faire.`)}
        ${cta('Choisir avec Alfred', URL.cal)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E22 · J28 ──────────────────────────────────────────────────────────────
  {
    step: 22, day: 28,
    subject: 'Le récap — tout ce qui s\'offre à toi',
    sender: 'jarvis',
    html: layout({
      heading: 'C\'est l\'avant-dernier email. Posons les choses.',
      body: `
        ${card('7 modules, le système, les outils. À ton rythme.', 'Option 1 — Blueprint seul', 'Tu as déjà tout. Continue.')}
        ${card('Ton SaaS construit en 72h par Tim et Charles.', 'Option 2 — Sprint · 497€', 'Idée → produit live en 3 jours.')}
        ${card('60 jours avec Alfred, Chris, et toute l\'équipe.', 'Option 3 — Cohorte · 1 497€', 'Garanti ou remboursé. 12 places max.')}
        ${p(`Chaque option est valide. La seule mauvaise décision, c\'est de ne rien faire.`)}
        ${cta('15 min pour choisir ensemble', URL.cal)}
        ${ps(`<a href="${URL.whatsapp}" style="color:#71717a;">WhatsApp</a> si tu préfères.`)}
      `,
      signedBy: 'Jarvis',
    }),
  },

  // ── E23 · J30 · ALFRED ─────────────────────────────────────────────────────
  {
    step: 23, day: 30,
    subject: 'Dernière chose',
    sender: 'alfred',
    html: layout({
      heading: 'C\'est le dernier email de cette séquence.',
      body: `
        ${p(`Il y a 30 jours, tu as fait un choix. Tu as investi sur toi-même.`)}
        ${p(`Peu importe où tu en es aujourd\'hui — tu as fait quelque chose que la plupart des gens ne feront jamais : ${bold('tu as commencé.')}`)}
        ${p(`Le monde change vite. Ceux qui savent utiliser l\'IA créent des produits, génèrent des revenus, et prennent une longueur d\'avance pendant que les autres attendent.`)}
        ${p(`Tu as les outils. Le reste, c\'est toi.`)}
        ${p(`Je ne t\'enverrai plus d\'emails automatiques. Mais je suis toujours là. Jarvis aussi.`)}
        ${p(`Réponds à cet email si tu veux me dire où tu en es. Je lis tout.`)}
        ${divider()}
        ${ctaOutline('Prendre rendez-vous', URL.cal)}
      `,
      signedBy: 'Alfred',
    }),
  },

]
