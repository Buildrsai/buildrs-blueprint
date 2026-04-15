import { LegalPage, LSection, LP, LStrong, LUl, LLi, LCallout } from './LegalPage'

export function Cookies() {
  return (
    <LegalPage title="Politique de cookies" lastUpdated="27 mars 2026">

      <LSection title="1. Qu'est-ce qu'un cookie ?">
        <LP>
          Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette)
          lors de votre visite sur un site web. Il permet au site de mémoriser certaines informations sur
          votre navigation et vos préférences.
        </LP>
        <LP>
          Conformément à la directive ePrivacy (transposée en droit français) et au RGPD, certains cookies
          nécessitent votre consentement préalable. D'autres, strictement nécessaires au fonctionnement du
          service, peuvent être déposés sans consentement.
        </LP>
      </LSection>

      <LSection title="2. Cookies strictement nécessaires">
        <LP>
          Ces cookies sont indispensables au fonctionnement du service. Ils ne peuvent pas être désactivés
          sans altérer gravement votre expérience sur le site.
        </LP>
        <LUl>
          <LLi>
            <LStrong>Session Supabase Auth</LStrong> — Nom : <LStrong>sb-[project]-auth-token</LStrong><br />
            Finalité : maintien de votre session de connexion au dashboard.<br />
            Durée : session (supprimé à la fermeture du navigateur) ou persistant selon votre choix de connexion.<br />
            Émetteur : Supabase Inc.
          </LLi>
          <LLi>
            <LStrong>Stripe (prévention de la fraude)</LStrong> — Nom : <LStrong>__stripe_mid, __stripe_sid</LStrong><br />
            Finalité : détection des fraudes lors des paiements en ligne.<br />
            Durée : 1 an (mid), session (sid).<br />
            Émetteur : Stripe Inc.
          </LLi>
        </LUl>
      </LSection>

      <LSection title="3. Cookies analytics (mesure d'audience)">
        <LP>
          Ces cookies nous permettent de comprendre comment les visiteurs utilisent notre site afin d'améliorer
          le produit. Ils sont déposés uniquement avec votre consentement.
        </LP>
        <LUl>
          <LLi>
            <LStrong>PostHog</LStrong> — Noms : <LStrong>ph_[project]_posthog, ph_[project]_distinct_id</LStrong><br />
            Finalité : analyse du comportement utilisateur (pages visitées, clics, parcours, funnels), amélioration du produit.<br />
            Durée : 13 mois maximum.<br />
            Émetteur : PostHog Inc.<br />
            Opt-out : <a href="https://posthog.com/privacy" className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">posthog.com/privacy</a>
          </LLi>
        </LUl>
      </LSection>

      <LSection title="4. Cookies publicitaires (marketing)">
        <LP>
          Ces cookies permettent de mesurer l'efficacité de nos campagnes publicitaires et de vous proposer
          des publicités pertinentes sur les réseaux sociaux. Ils sont déposés uniquement avec votre consentement.
        </LP>
        <LUl>
          <LLi>
            <LStrong>Meta Pixel (Facebook / Instagram)</LStrong> — Noms : <LStrong>_fbp, _fbc</LStrong><br />
            Finalité : suivi des conversions publicitaires (achat après clic sur une publicité Meta), création d'audiences personnalisées pour les campagnes Meta Ads.<br />
            Durée : 90 jours (_fbp), session (_fbc).<br />
            Émetteur : Meta Platforms Inc.<br />
            Opt-out : <a href="https://www.facebook.com/settings?tab=ads" className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Paramètres publicitaires Facebook</a>
          </LLi>
        </LUl>
        <LP>
          Note : Ce site n'est pas affilié à Facebook™, Instagram™ ou Meta Platforms, Inc.
          Facebook™ et Instagram™ sont des marques déposées de Meta Platforms, Inc.
        </LP>
      </LSection>

      <LSection title="5. Gestion de vos préférences">
        <LCallout>
          <LStrong>Comment refuser ou supprimer les cookies :</LStrong><br /><br />
          Via votre navigateur, vous pouvez à tout moment configurer, bloquer ou supprimer les cookies :
          <br />— <LStrong>Chrome :</LStrong> Paramètres → Confidentialité et sécurité → Cookies
          <br />— <LStrong>Firefox :</LStrong> Options → Vie privée et sécurité → Cookies et données de sites
          <br />— <LStrong>Safari :</LStrong> Préférences → Confidentialité → Cookies
          <br />— <LStrong>Edge :</LStrong> Paramètres → Confidentialité → Cookies
          <br /><br />
          Le refus de certains cookies (analytics, publicitaires) n'affecte pas votre accès au service.
          Le refus des cookies strictement nécessaires peut altérer le fonctionnement du dashboard.
        </LCallout>
      </LSection>

      <LSection title="6. Contact">
        <LP>
          Pour toute question relative à notre utilisation des cookies :
          <LStrong> team@buildrs.fr</LStrong>
        </LP>
        <LP>
          Vous pouvez également consulter notre{' '}
          <a
            href="#/legal/confidentialite"
            className="underline hover:text-foreground transition-colors"
            onClick={() => { window.location.hash = '/legal/confidentialite' }}
          >
            Politique de confidentialité
          </a>{' '}
          pour en savoir plus sur le traitement de vos données personnelles.
        </LP>
      </LSection>

    </LegalPage>
  )
}
