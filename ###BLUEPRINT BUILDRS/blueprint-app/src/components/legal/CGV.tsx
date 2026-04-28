import { LegalPage, LSection, LP, LStrong, LUl, LLi, LCallout } from './LegalPage'
import { BLUEPRINT_PRICE } from '../../lib/pricing'

export function CGV() {
  return (
    <LegalPage title="Conditions Générales de Vente" lastUpdated="27 mars 2026">

      <LSection title="Article 1 — Objet">
        <LP>
          Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
          <LStrong> Buildrs Group LLC</LStrong>, éditeur du site buildrs.fr (ci-après "Buildrs" ou "le Vendeur"),
          et toute personne physique ou morale effectuant un achat via le site (ci-après "le Client").
        </LP>
        <LP>Les produits et services proposés sont les suivants :</LP>
        <LUl>
          <LLi><LStrong>Buildrs Blueprint</LStrong> — {BLUEPRINT_PRICE}€ TTC : accès à vie au dashboard interactif, 6 modules de formation, bibliothèque de prompts, générateurs IA, mises à jour incluses.</LLi>
          <LLi><LStrong>Module Claude 360°</LStrong> — +37€ TTC (order bump) : module bonus sur l'utilisation avancée de Claude.</LLi>
          <LLi><LStrong>Buildrs Sprint</LStrong> — 497€ TTC : livraison d'un MVP complet en 72h.</LLi>
          <LLi><LStrong>Buildrs Cohorte</LStrong> — 1 497€ TTC (paiement unique) ou 3 × 499€ TTC (mensuel) : accompagnement intensif de 60 jours.</LLi>
        </LUl>
        <LP>
          Tout achat implique l'acceptation pleine et entière des présentes CGV. Ces conditions prévalent
          sur tout autre document, sauf accord écrit contraire.
        </LP>
      </LSection>

      <LSection title="Article 2 — Prix">
        <LP>
          Les prix sont indiqués en euros TTC (toutes taxes comprises). Buildrs Group LLC,
          en tant qu'entité en cours d'immatriculation, n'est pas assujettie à la TVA au moment
          de la publication de ces CGV. Les prix pourront être actualisés en cas d'assujettissement à la TVA.
        </LP>
        <LP>
          Buildrs se réserve le droit de modifier ses tarifs à tout moment. Les produits sont facturés
          au prix en vigueur au moment de la validation de la commande.
        </LP>
      </LSection>

      <LSection title="Article 3 — Commande et paiement">
        <LP>
          Les paiements sont traités exclusivement via <LStrong>Stripe</LStrong>, prestataire de paiement sécurisé.
          Les données bancaires ne sont pas stockées par Buildrs.
        </LP>
        <LP>La commande est réputée ferme et définitive dès la confirmation du paiement par Stripe. Un email de confirmation est envoyé automatiquement à l'adresse fournie lors de l'achat.</LP>
        <LP>Moyens de paiement acceptés : carte bancaire (Visa, Mastercard, American Express), Apple Pay, Google Pay.</LP>
      </LSection>

      <LSection title="Article 4 — Accès aux produits">
        <LUl>
          <LLi><LStrong>Blueprint & Module Claude :</LStrong> accès immédiat au dashboard après création de compte.</LLi>
          <LLi><LStrong>Sprint :</LStrong> un appel de cadrage est planifié sous 48h ouvrées après le paiement. La livraison intervient dans les 72h suivant cet appel.</LLi>
          <LLi><LStrong>Cohorte :</LStrong> accès à la session en cours ou à la prochaine session. Les modalités d'accès sont transmises par email sous 24h ouvrées.</LLi>
        </LUl>
      </LSection>

      <LSection title="Article 5 — Droit de rétractation">
        <LP>
          Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un délai de
          <LStrong> 14 jours calendaires</LStrong> à compter de la date d'achat pour exercer son droit de rétractation,
          sans avoir à justifier de motifs.
        </LP>
        <LCallout>
          <LStrong>Exception Blueprint :</LStrong> Le droit de rétractation ne peut être exercé si le Client a consommé
          plus de 50% du contenu disponible dans le dashboard (progression trackée automatiquement et enregistrée
          dans nos systèmes). En dessous de ce seuil, le remboursement est accordé dans un délai de 14 jours
          suivant la demande, par virement sur le moyen de paiement utilisé.
        </LCallout>
        <LP>
          <LStrong>Sprint :</LStrong> le droit de rétractation s'applique uniquement avant la tenue de l'appel de cadrage.
          Dès lors que l'appel a eu lieu et que le travail a débuté, aucun remboursement ne pourra être accordé.
        </LP>
        <LP>
          <LStrong>Cohorte :</LStrong> le droit de rétractation s'applique dans les 14 jours suivant l'achat,
          à condition qu'aucune session live n'ait encore eu lieu. Passé ce délai ou après participation à une session,
          la garantie résultat de l'article 6 s'applique.
        </LP>
        <LP>
          Pour exercer ce droit, le Client doit envoyer une demande claire à <LStrong>team@buildrs.fr</LStrong> en
          indiquant son nom, son email d'achat et sa demande de remboursement.
        </LP>
      </LSection>

      <LSection title="Article 6 — Garantie Cohorte">
        <LP>
          L'offre Cohorte est assortie d'une <LStrong>garantie résultat</LStrong> : si le Client n'atteint pas
          1 000€ de revenus mensuels récurrents (MRR) dans les 90 jours suivant le lancement de son produit,
          Buildrs s'engage à procéder au remboursement intégral du montant payé.
        </LP>
        <LP>Cette garantie est soumise aux conditions cumulatives suivantes :</LP>
        <LUl>
          <LLi>Le Client a participé à au moins 80% des sessions live programmées.</LLi>
          <LLi>Le Client a lancé son produit (MVP déployé et accessible au public) avant la fin de la Cohorte.</LLi>
          <LLi>Le Client a suivi les recommandations et plans d'action définis en session.</LLi>
          <LLi>La demande de remboursement est formulée par écrit à team@buildrs.fr dans les 30 jours suivant la fin du délai de 90 jours.</LLi>
        </LUl>
      </LSection>

      <LSection title="Article 7 — Propriété intellectuelle">
        <LP>
          L'ensemble des contenus fournis dans le cadre des produits Buildrs (modules, prompts, templates,
          vidéos, outils) restent la propriété exclusive de Buildrs Group LLC. Ils sont mis à disposition
          du Client à titre de licence personnelle, non-cessible et non-commercialisable.
        </LP>
        <LP>
          Il est strictement interdit de revendre, reproduire, redistribuer ou exploiter commercialement
          tout ou partie de ces contenus sans autorisation écrite préalable.
        </LP>
      </LSection>

      <LSection title="Article 8 — Limitation de responsabilité">
        <LP>
          Les produits Buildrs sont des outils pédagogiques et d'accompagnement. Buildrs ne peut garantir
          de résultats financiers spécifiques à chaque Client. Les résultats dépendent de facteurs propres
          à chaque utilisateur : investissement personnel, contexte de marché, exécution des recommandations.
        </LP>
        <LP>
          La responsabilité de Buildrs ne saurait être engagée pour tout dommage indirect, manque à gagner,
          perte de données ou préjudice résultant de l'utilisation ou de la non-utilisation des produits.
        </LP>
      </LSection>

      <LSection title="Article 9 — Intelligence artificielle">
        <LP>
          Les produits Buildrs intègrent des fonctionnalités propulsées par des systèmes d'intelligence artificielle,
          notamment <LStrong>Claude</LStrong> développé par Anthropic PBC. En utilisant ces fonctionnalités,
          le Client reconnaît et accepte les points suivants :
        </LP>
        <LUl>
          <LLi>Les contenus, suggestions et outputs générés par l'IA sont fournis à titre indicatif et pédagogique uniquement. Ils ne constituent pas des conseils juridiques, financiers, fiscaux ou professionnels.</LLi>
          <LLi>Buildrs ne garantit pas l'exactitude, l'exhaustivité ou la pertinence des contenus générés par IA. Le Client reste seul responsable de l'utilisation qu'il en fait.</LLi>
          <LLi>Conformément au Règlement (UE) 2024/1689 sur l'intelligence artificielle (EU AI Act), Buildrs informe ses utilisateurs de manière transparente de l'utilisation de systèmes d'IA dans ses produits. Les systèmes utilisés ne relèvent pas des catégories à haut risque définies par ce règlement.</LLi>
          <LLi>Les données saisies dans les générateurs IA peuvent être traitées par Anthropic conformément à leur politique de confidentialité. Aucune donnée personnelle sensible ne doit être soumise aux générateurs.</LLi>
        </LUl>
      </LSection>

      <LSection title="Article 10 — Droit applicable et juridiction">
        <LP>
          Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent
          à rechercher une solution amiable. À défaut, les tribunaux français seront seuls compétents,
          quel que soit le lieu de résidence du Client.
        </LP>
        <LP>
          Le Client peut également recourir à la plateforme européenne de règlement des litiges en ligne :
          https://ec.europa.eu/consumers/odr
        </LP>
      </LSection>

      <LSection title="Article 11 — Modification des CGV">
        <LP>
          Buildrs se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables
          sont celles en vigueur à la date de la commande. Toute modification substantielle sera notifiée
          aux clients existants par email.
        </LP>
        <LP>
          Pour toute question : <LStrong>team@buildrs.fr</LStrong>
        </LP>
      </LSection>

    </LegalPage>
  )
}
