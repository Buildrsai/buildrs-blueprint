import { LegalPage, LSection, LP, LStrong, LUl, LLi, LCallout } from './LegalPage'

export function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" lastUpdated="27 mars 2026">

      <LSection title="1. Responsable du traitement">
        <LP>
          Le responsable du traitement de vos données personnelles est :
        </LP>
        <LUl>
          <LLi><LStrong>Entité :</LStrong> Buildrs Group LLC (en cours d'immatriculation)</LLi>
          <LLi><LStrong>Représentant :</LStrong> Alfred Orsini</LLi>
          <LLi><LStrong>Contact :</LStrong> team@buildrs.fr</LLi>
        </LUl>
      </LSection>

      <LSection title="2. Données collectées">
        <LP>Nous collectons les catégories de données suivantes :</LP>
        <LUl>
          <LLi><LStrong>Données d'identification :</LStrong> adresse email, prénom (lors de la création de compte ou de l'achat).</LLi>
          <LLi><LStrong>Données de progression :</LStrong> modules consultés, leçons complétées, quiz réalisés (trackées dans le dashboard).</LLi>
          <LLi><LStrong>Données de paiement :</LStrong> informations de transaction traitées par Stripe (nous n'avons pas accès à vos données bancaires).</LLi>
          <LLi><LStrong>Données de navigation :</LStrong> pages visitées, durée des sessions, source d'acquisition (via PostHog et Meta Pixel).</LLi>
          <LLi><LStrong>Données de communication :</LStrong> contenu de vos échanges avec notre équipe par email ou WhatsApp (pour les clients Cohorte).</LLi>
        </LUl>
      </LSection>

      <LSection title="3. Finalités et bases légales">
        <LUl>
          <LLi><LStrong>Exécution du contrat :</LStrong> création et gestion de votre compte, accès au dashboard, livraison des produits achetés, suivi de progression.</LLi>
          <LLi><LStrong>Intérêt légitime :</LStrong> amélioration du produit, analytics d'usage anonymisées, sécurité et prévention de la fraude.</LLi>
          <LLi><LStrong>Consentement :</LStrong> envoi d'emails marketing, utilisation des cookies publicitaires (Meta Pixel). Vous pouvez retirer votre consentement à tout moment.</LLi>
          <LLi><LStrong>Obligation légale :</LStrong> conservation des données comptables et fiscales.</LLi>
        </LUl>
      </LSection>

      <LSection title="4. Durée de conservation">
        <LUl>
          <LLi><LStrong>Données de compte :</LStrong> conservées 3 ans après votre dernier accès au service.</LLi>
          <LLi><LStrong>Données de paiement :</LStrong> 10 ans (obligation comptable légale).</LLi>
          <LLi><LStrong>Cookies analytics (PostHog) :</LStrong> 13 mois maximum.</LLi>
          <LLi><LStrong>Cookies publicitaires (Meta Pixel) :</LStrong> 90 jours.</LLi>
          <LLi><LStrong>Emails marketing :</LStrong> jusqu'au désabonnement ou 3 ans après le dernier achat.</LLi>
        </LUl>
      </LSection>

      <LSection title="5. Destinataires et sous-traitants">
        <LP>
          Vos données peuvent être transmises à nos sous-traitants dans le strict cadre de l'exécution de nos services.
          Tous nos sous-traitants sont liés par des accords de traitement de données conformes au RGPD :
        </LP>
        <LUl>
          <LLi><LStrong>Supabase Inc.</LStrong> (USA) — Base de données et authentification. Infrastructure hébergée partiellement en Europe (EU-West). Clauses Contractuelles Types (CCT) applicables.</LLi>
          <LLi><LStrong>Stripe Inc.</LStrong> (USA) — Traitement des paiements. Certifié PCI-DSS. CCT applicables. Stripe est responsable de traitement indépendant pour les données bancaires.</LLi>
          <LLi><LStrong>Vercel Inc.</LStrong> (USA) — Hébergement web. CCT applicables.</LLi>
          <LLi><LStrong>Resend Inc.</LStrong> (USA) — Envoi d'emails transactionnels. CCT applicables.</LLi>
          <LLi><LStrong>PostHog Inc.</LStrong> (USA/EU) — Analytics produit. Option de stockage des données en Europe disponible. CCT applicables.</LLi>
          <LLi><LStrong>Meta Platforms Inc.</LStrong> (USA) — Suivi publicitaire (Meta Pixel). CCT applicables. Meta est co-responsable de traitement pour les données collectées via le Pixel.</LLi>
          <LLi><LStrong>Anthropic PBC</LStrong> (USA) — Moteur d'IA Claude. Les données saisies dans les générateurs IA transitent par les serveurs d'Anthropic. Ne saisissez pas de données personnelles sensibles dans les générateurs.</LLi>
        </LUl>
      </LSection>

      <LSection title="6. Transferts hors Union européenne">
        <LP>
          Certains de nos sous-traitants sont établis aux États-Unis. Ces transferts sont encadrés par des
          <LStrong> Clauses Contractuelles Types (CCT)</LStrong> approuvées par la Commission européenne,
          garantissant un niveau de protection adéquat de vos données personnelles conformément au RGPD.
        </LP>
      </LSection>

      <LSection title="7. Vos droits">
        <LP>Conformément au RGPD (Règlement UE 2016/679), vous disposez des droits suivants :</LP>
        <LUl>
          <LLi><LStrong>Droit d'accès :</LStrong> obtenir une copie des données personnelles que nous détenons sur vous.</LLi>
          <LLi><LStrong>Droit de rectification :</LStrong> corriger toute information inexacte.</LLi>
          <LLi><LStrong>Droit à l'effacement :</LStrong> demander la suppression de vos données ("droit à l'oubli"), sous réserve des obligations légales de conservation.</LLi>
          <LLi><LStrong>Droit à la portabilité :</LStrong> recevoir vos données dans un format structuré et lisible par machine.</LLi>
          <LLi><LStrong>Droit d'opposition :</LStrong> vous opposer au traitement de vos données à des fins de marketing ou de profilage.</LLi>
          <LLi><LStrong>Droit de limitation :</LStrong> demander la suspension du traitement de vos données dans certains cas.</LLi>
        </LUl>
        <LCallout>
          Pour exercer vos droits, envoyez votre demande à <LStrong>team@buildrs.fr</LStrong> en indiquant
          votre nom et l'adresse email associée à votre compte. Nous répondrons dans un délai de 30 jours.
          En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la
          <LStrong> CNIL</LStrong> (Commission Nationale de l'Informatique et des Libertés) : www.cnil.fr
        </LCallout>
      </LSection>

      <LSection title="8. Sécurité des données">
        <LP>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
          vos données contre la perte, l'accès non autorisé, la divulgation ou la modification :
        </LP>
        <LUl>
          <LLi>Chiffrement des données en transit (HTTPS/TLS)</LLi>
          <LLi>Row Level Security (RLS) activée sur toutes les tables de notre base de données</LLi>
          <LLi>Authentification sécurisée via Supabase Auth (tokens JWT, session chiffrée)</LLi>
          <LLi>Accès aux données restreint aux seules personnes habilitées</LLi>
          <LLi>Paiements traités exclusivement par Stripe (données bancaires jamais stockées par Buildrs)</LLi>
        </LUl>
      </LSection>

      <LSection title="9. Modification de la politique">
        <LP>
          Cette politique de confidentialité peut être mise à jour à tout moment pour refléter l'évolution
          de nos pratiques ou des exigences réglementaires. La date de dernière mise à jour est indiquée
          en haut de cette page. Les modifications substantielles vous seront notifiées par email.
        </LP>
        <LP>
          Contact : <LStrong>team@buildrs.fr</LStrong>
        </LP>
      </LSection>

    </LegalPage>
  )
}
