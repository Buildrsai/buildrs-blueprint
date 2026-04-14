// preview-emails.ts — génère un fichier HTML pour prévisualiser les 23 emails
// Usage : deno run --allow-read --allow-write --allow-env preview-emails.ts

import { EMAIL_TEMPLATES, SENDERS } from './supabase/functions/_shared/email-templates.ts'

const rows = EMAIL_TEMPLATES.map(tpl => {
  const sender = SENDERS[tpl.sender]
  return `
    <div class="email-card">
      <div class="email-meta">
        <span class="step">E${tpl.step}</span>
        <span class="day">J${tpl.day}</span>
        <span class="sender ${tpl.sender}">${tpl.sender === 'alfred' ? 'Alfred' : 'Jarvis'}</span>
        <span class="subject">${tpl.subject}</span>
        <span class="from">${sender}</span>
      </div>
      <iframe srcdoc="${tpl.html.replace(/"/g, '&quot;').replace(/\n/g, '')}"
              width="600" height="520" frameborder="0" loading="lazy"></iframe>
    </div>
  `
}).join('\n')

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Preview Emails — Buildrs Blueprint</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #fafafa; }
    header { padding: 32px 40px 0; }
    header h1 { font-size: 20px; font-weight: 800; letter-spacing: -0.04em; }
    header p { font-size: 13px; color: #71717a; margin-top: 6px; }
    .list { padding: 24px 40px 80px; display: flex; flex-direction: column; gap: 40px; }
    .email-card { border: 1px solid #27272a; border-radius: 14px; overflow: hidden; }
    .email-meta { background: #111113; padding: 14px 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; border-bottom: 1px solid #27272a; }
    .step { font-size: 11px; font-weight: 700; background: #27272a; color: #a1a1aa; padding: 3px 8px; border-radius: 6px; }
    .day { font-size: 11px; font-weight: 700; color: #52525b; }
    .sender { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
    .sender.jarvis { background: #1c1c30; color: #818cf8; }
    .sender.alfred { background: #1c2a1c; color: #4ade80; }
    .subject { font-size: 14px; font-weight: 600; color: #fafafa; flex: 1; }
    .from { font-size: 12px; color: #52525b; white-space: nowrap; }
    iframe { display: block; width: 100%; background: #09090b; }
  </style>
</head>
<body>
  <header>
    <h1>Preview — Séquence 23 emails Buildrs Blueprint</h1>
    <p>Rendu exact de ce que reçoit l'acheteur dans sa boite mail.</p>
  </header>
  <div class="list">${rows}</div>
</body>
</html>`

await Deno.writeTextFile('email-previews.html', html)
console.log('Fichier généré : email-previews.html')
