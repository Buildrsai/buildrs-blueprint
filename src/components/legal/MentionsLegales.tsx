import { LegalPage, LSection, LP, LStrong, LUl, LLi } from './LegalPage'

export function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" lastUpdated="27 mars 2026">

      <LSection title="1. Éditeur du site">
        <LP>Le site <LStrong>buildrs.fr</LStrong> est édité par :</LP>
        <LUl>
          <LLi><LStrong>Dénomination :</LStrong> Buildrs Group LLC (société en cours d'immatriculation)</LLi>
          <LLi><LStrong>Directeur de la publication :</LStrong> Alfred Orsini</LLi>
          <LLi><LStrong>Adresse :</LStrong> En cours de domiciliation</LLi>
          <LLi><LStrong>Email :</LStrong> team@buildrs.fr</LLi>
          <LLi><LStrong>Site web :</LStrong> https://buildrs.fr</LLi>
        </LUl>
      </LSection>

      <LSection title="2. Hébergement">
        <LP>Le site est hébergé par :</LP>
        <LUl>
          <LLi><LStrong>Société :</LStrong> Vercel Inc.</LLi>
          <LLi><LStrong>Adresse :</LStrong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</LLi>
          <LLi><LStrong>Site :</LStrong> https://vercel.com</LLi>
        </LUl>
      </LSection>

      <LSection title="3. Sous-traitants techniques">
        <LP>Le fonctionnement du service repose sur les prestataires techniques suivants :</LP>
        <LUl>
          <LLi><LStrong>Supabase Inc.</LStrong> — Base de données et authentification (San Francisco, CA, USA)</LLi>
          <LLi><LStrong>Stripe Inc.</LStrong> — Traitement des paiements (South San Francisco, CA, USA)</LLi>
          <LLi><LStrong>Resend Inc.</LStrong> — Envoi d'emails transactionnels (San Francisco, CA, USA)</LLi>
          <LLi><LStrong>PostHog Inc.</LStrong> — Analytics produit (San Francisco, CA, USA)</LLi>
          <LLi><LStrong>Anthropic PBC</LStrong> — Moteur d'intelligence artificielle Claude (San Francisco, CA, USA)</LLi>
          <LLi><LStrong>Meta Platforms Inc.</LStrong> — Pixel de suivi publicitaire (Menlo Park, CA, USA)</LLi>
        </LUl>
      </LSection>

      <LSection title="4. Propriété intellectuelle">
        <LP>
          L'ensemble des contenus présents sur le site buildrs.fr — textes, graphiques, logotypes, vidéos, icônes,
          modules, prompts et interfaces — sont la propriété exclusive de Buildrs Group LLC ou de ses partenaires,
          et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
        </LP>
        <LP>
          Toute reproduction, distribution, modification ou utilisation commerciale de ces contenus,
          sans autorisation écrite préalable, est strictement interdite.
        </LP>
      </LSection>

      <LSection title="5. Limitation de responsabilité">
        <LP>
          Buildrs Group LLC s'efforce de maintenir les informations publiées sur ce site aussi exactes et
          actualisées que possible. Toutefois, la société ne peut garantir l'exactitude, la complétude ou
          l'actualité des informations diffusées.
        </LP>
        <LP>
          Les résultats présentés sur ce site (revenus, délais, exemples) sont des résultats obtenus par
          des clients réels dans des conditions spécifiques. Ils ne constituent pas une garantie de résultat
          identique pour chaque utilisateur. Les résultats varient selon le profil, l'implication et le contexte
          de chaque personne.
        </LP>
      </LSection>

      <LSection title="6. Droit applicable et juridiction">
        <LP>
          Les présentes mentions légales sont soumises au droit français. En cas de litige,
          les tribunaux français seront seuls compétents.
        </LP>
      </LSection>

      <LSection title="7. Contact">
        <LP>
          Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse :
          <LStrong> team@buildrs.fr</LStrong>
        </LP>
      </LSection>

    </LegalPage>
  )
}
