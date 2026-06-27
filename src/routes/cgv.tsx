import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/cgv")({
  component: CgvPage,
});

function CgvPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <LegalPage
      title={fr ? "Conditions générales de vente" : "Terms of Sale"}
      subtitle={fr ? "Dernière mise à jour : 25 juin 2026" : "Last updated: June 25, 2026"}
    >
      {fr ? <CgvFr /> : <CgvEn />}
    </LegalPage>
  );
}

function CgvFr() {
  return (
    <>
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
    </>
  );
}

function CgvEn() {
  return (
    <>
      <h2 className="font-display text-xl text-foreground">Seller</h2>
      <p>
        <strong>Kinetis Brush</strong> — Canada and United States —{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        .
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Products and prices</h2>
      <p>
        Products are described as accurately as possible; prices are in{" "}
        <strong>Canadian dollars (CAD)</strong>; the Kinetis brush is <strong>$45.99 CAD</strong>;
        applicable taxes, if any, are shown at checkout.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Order and payment</h2>
      <p>
        The order is confirmed after payment; payments are securely processed by{" "}
        <strong>Stripe</strong> (cards, Apple Pay); no card data is stored by us.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Shipping</h2>
      <p>
        Orders are prepared and shipped by our <strong>partner supplier</strong>; estimated delivery
        is <strong>5 to 8 business days</strong> after the order, barring exceptional circumstances;
        a tracking number is provided once shipped.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Returns and refunds</h2>
      <p>
        You benefit from a <strong>30-day satisfaction guarantee</strong>; details are in our{" "}
        <Link to="/retours" className="text-rose-gold hover:underline">
          Return and Refund Policy
        </Link>
        .
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Legal warranty</h2>
      <p>
        Products are covered by the warranties provided under applicable law, notably Quebec's{" "}
        <strong>Consumer Protection Act</strong>.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Liability</h2>
      <p>
        Our liability shall not exceed the <strong>amount of the relevant order</strong>.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Governing law</h2>
      <p>
        These terms are governed by the law applicable in <strong>Quebec (Canada)</strong>; any
        dispute falls under the competent courts of Quebec.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Contact</h2>
      <p>
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        .
      </p>
    </>
  );
}
