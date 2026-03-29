const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { email, first_name } = body

    if (!email) throw new Error('Email requis')

    const prenom = first_name?.trim() || null
    const greeting = prenom ? `Bienvenue, ${prenom}.` : `Bienvenue dans Buildrs.`

    const features = [
      "6 modules complets — de l'idée au produit monétisé",
      "Tous les prompts à copier-coller à chaque étape",
      "Le stack complet d'outils + guides de configuration",
      "Générateur d'idées, validation, calculateur MRR",
      "Accès à vie + mises à jour incluses",
    ]

    const featureRows = features.map(f => `
      <tr>
        <td style="padding:5px 0;vertical-align:top;width:18px;">
          <span style="color:#22c55e;font-size:12px;font-weight:700;">✓</span>
        </td>
        <td style="padding:5px 0;font-size:14px;color:#a1a1aa;line-height:1.5;">${f}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bienvenue dans Buildrs Blueprint</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo text -->
          <tr>
            <td style="padding-bottom:28px;">
              <span style="font-size:18px;font-weight:800;color:#fafafa;letter-spacing:-0.05em;">Buildrs</span>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#111113;border:1px solid #27272a;border-radius:16px;padding:40px;">

              <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.1em;">
                Buildrs Blueprint — Accès activé
              </p>

              <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#fafafa;letter-spacing:-0.03em;line-height:1.2;">
                ${greeting}
              </h1>

              <p style="margin:0 0 10px;font-size:15px;color:#a1a1aa;line-height:1.65;">
                Le monde change vite. Ceux qui savent utiliser l'IA comme levier créent des produits, génèrent des revenus, et prennent une longueur d'avance pendant que les autres attendent.
              </p>

              <p style="margin:0 0 10px;font-size:15px;color:#a1a1aa;line-height:1.65;">
                Buildrs existe pour te donner cette avance. Pas besoin d'équipe, pas besoin de budget. Juste toi, Claude, et un système qui fonctionne.
              </p>

              <p style="margin:0 0 28px;font-size:15px;font-weight:600;color:#fafafa;line-height:1.65;">
                Commence l'aventure maintenant.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-radius:10px;background:#fafafa;">
                    <a href="https://buildrs.fr/#/dashboard"
                       style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#09090b;text-decoration:none;letter-spacing:-0.01em;border-radius:10px;">
                      Accéder à mon dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #27272a;height:1px;"></td></tr>
              </table>

              <!-- Ce que tu as débloqué -->
              <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#fafafa;letter-spacing:-0.02em;">
                Ce que tu as débloqué
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${featureRows}
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #27272a;height:1px;"></td></tr>
              </table>

              <!-- Aller plus loin -->
              <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#fafafa;letter-spacing:-0.02em;">
                Aller plus loin
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.65;">
                Blueprint est ton point de départ. Si tu veux aller plus vite, nous pouvons construire ton SaaS IA avec toi — ou carrément pour toi.
              </p>

              <!-- Sprint -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.09em;">Buildrs Sprint</p>
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#fafafa;line-height:1.35;letter-spacing:-0.02em;">
                      Ton MVP livré en 72h. On construit, tu lances.
                    </p>
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
                      MVP fonctionnel livré et déployé — design, auth, base de données, GitHub, documentation. On se concentre sur le produit. La suite, c'est toi qui la mènes.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Cohorte -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.09em;">Buildrs Cohort</p>
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#fafafa;line-height:1.35;letter-spacing:-0.02em;">
                      60 jours avec Alfred. Un SaaS rentable à la fin du programme.
                    </p>
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
                      Tu n'es plus seul. 4 sessions live par semaine, WhatsApp direct, et Alfred à tes côtés de la première idée aux premiers revenus. Produit monétisé — garanti.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- RDV CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-radius:10px;border:1px solid #27272a;">
                    <a href="https://cal.com/team-buildrs/secret"
                       style="display:inline-block;padding:13px 24px;font-size:13px;font-weight:600;color:#fafafa;text-decoration:none;letter-spacing:-0.01em;border-radius:10px;">
                      Prendre un rendez-vous →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr><td style="border-top:1px solid #27272a;height:1px;"></td></tr>
              </table>

              <p style="margin:0 0 6px;font-size:13px;color:#52525b;line-height:1.65;">
                Pour te reconnecter à tout moment :
              </p>
              <p style="margin:0;">
                <a href="https://buildrs.fr/#/signin"
                   style="font-size:13px;color:#71717a;text-decoration:underline;">
                  https://buildrs.fr/#/signin
                </a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">
                © ${new Date().getFullYear()} Buildrs Group · Tous droits réservés
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#27272a;">
                Buildrs Blueprint · Buildrs Lab · Buildrs Club · Buildrs Pro
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Alfred de Buildrs <bonjour@app.buildrs.fr>',
        to:   email,
        subject: 'Bienvenue dans Buildrs Blueprint',
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Resend: ${errText}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
