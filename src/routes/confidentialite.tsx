import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/confidentialite")({
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" subtitle="Dernière mise à jour : 25 juin 2026">
      <p>
        Chez Kinetis Brush (« nous »), la protection de tes renseignements personnels est une
        priorité. Cette politique explique quelles données nous recueillons, pourquoi, et quels sont
        tes droits, conformément à la Loi 25 (Québec) et à la LPRPDE / PIPEDA (Canada).
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">
        Responsable de la protection des renseignements personnels
      </h2>
      <p>
        Kinetis Brush —{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        . Pour toute question ou demande concernant tes données, écris à cette adresse.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Renseignements recueillis</h2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Adresse courriel</strong> (compte, connexion, confirmation de commande).
        </li>
        <li>
          <strong>Nom et adresse de livraison</strong> (au paiement).
        </li>
        <li>
          <strong>Détails de commande</strong> (produit, montant, date, statut, suivi).
        </li>
        <li>
          <strong>Photos et texte</strong> publiés dans un avis.
        </li>
      </ul>
      <p>
        Nous ne stockons <strong>AUCUNE donnée de carte bancaire</strong> (paiements traités par
        Stripe).
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Finalités</h2>
      <p>
        Traiter et livrer les commandes, gérer le compte et l'historique, envoyer les courriels liés
        à la commande (connexion, expédition), afficher les avis, respecter nos obligations légales.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Partage avec des tiers</h2>
      <p>
        <strong>Stripe</strong> (paiements), <strong>Resend</strong> (courriels),{" "}
        <strong>Cloudflare</strong> (hébergement/stockage), notre{" "}
        <strong>fournisseur d'expédition</strong> (nom + adresse de livraison pour acheminer la
        commande). Nous ne vendons jamais tes renseignements.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Hébergement hors Québec</h2>
      <p>
        Certains prestataires peuvent stocker ou traiter tes renseignements hors du Québec,
        notamment aux États-Unis. En utilisant le site, tu en es informé.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Conservation</h2>
      <p>
        Aussi longtemps que nécessaire aux finalités et obligations légales. Suppression du compte
        possible à tout moment.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Tes droits</h2>
      <p>
        Accès, rectification, suppression, retrait du consentement, en écrivant à{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        . Plainte possible auprès de la{" "}
        <strong>Commission d'accès à l'information du Québec</strong>.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Témoins (cookies)</h2>
      <p>
        Uniquement ceux strictement nécessaires (session de connexion, panier). Tout futur outil de
        mesure ou de publicité fera l'objet d'une demande de consentement préalable.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Modifications</h2>
      <p>La politique peut être mise à jour ; la date ci-dessus indique la dernière révision.</p>
    </LegalPage>
  );
}
