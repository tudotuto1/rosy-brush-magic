import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/cgv")({
  component: CgvPage,
});

function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente" subtitle="Dernière mise à jour : 25 juin 2026">
      <h2 className="font-display text-xl text-foreground">Vendeur</h2>
      <p>
        <strong>Kinetis Brush</strong> — Canada et États-Unis —{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        .
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Produits et prix</h2>
      <p>
        Produits décrits avec précision ; prix en <strong>dollars canadiens (CAD)</strong> ; brosse
        Kinetis à <strong>45,99 $ CAD</strong> ; taxes applicables le cas échéant indiquées au
        paiement.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Commande et paiement</h2>
      <p>
        Commande confirmée après paiement ; paiements sécurisés via <strong>Stripe</strong> (cartes,
        Apple Pay) ; aucune donnée de carte conservée par nous.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Expédition</h2>
      <p>
        Commandes préparées et expédiées par notre <strong>fournisseur partenaire</strong> ; délai
        estimé <strong>5 à 8 jours ouvrés</strong> après commande sauf circonstances exceptionnelles
        ; numéro de suivi communiqué dès l'expédition.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Retours et remboursements</h2>
      <p>
        <strong>Garantie satisfaction de 30 jours</strong> ; modalités détaillées dans la{" "}
        <Link to="/retours" className="text-rose-gold hover:underline">
          Politique de retour et de remboursement
        </Link>
        .
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Garantie légale</h2>
      <p>
        Produits couverts par les garanties prévues par la loi applicable, notamment la{" "}
        <strong>Loi sur la protection du consommateur</strong> du Québec.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Responsabilité</h2>
      <p>
        Notre responsabilité ne saurait excéder le <strong>montant de la commande concernée</strong>
        .
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Droit applicable</h2>
      <p>
        Droit applicable au <strong>Québec (Canada)</strong> ; litiges relevant des tribunaux
        compétents du Québec.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Contact</h2>
      <p>
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
