import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/retours")({
  component: RetoursPage,
});

function RetoursPage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <LegalPage
      title={fr ? "Politique de retour et de remboursement" : "Return and Refund Policy"}
      subtitle={fr ? "Dernière mise à jour : 25 juin 2026" : "Last updated: June 25, 2026"}
    >
      {fr ? <RetoursFr /> : <RetoursEn />}
    </LegalPage>
  );
}

function RetoursFr() {
  return (
    <>
      <h2 className="font-display text-xl text-foreground">Garantie satisfaction 30 jours</h2>
      <p>
        Si tu n'es pas satisfait, <strong>30 jours à compter de la réception</strong> pour demander
        un remboursement.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Comment faire une demande</h2>
      <p>
        Écris à{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>{" "}
        avec ton <strong>numéro de commande</strong> et le motif ; nous répondons avec la marche à
        suivre.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Conditions</h2>
      <p>
        Produit retourné dans un <strong>état raisonnable</strong> ; remboursement après réception
        et vérification du retour.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Frais de retour</h2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Produit défectueux ou erreur de notre part</strong> → nous prenons en charge les
          frais et remboursons intégralement (ou remplaçons).
        </li>
        <li>
          <strong>Changement d'avis</strong> → frais de retour à ta charge.
        </li>
      </ul>

      <h2 className="font-display text-xl text-foreground pt-2">Délai de remboursement</h2>
      <p>
        Sur le moyen de paiement original, généralement sous <strong>5 à 10 jours ouvrés</strong>{" "}
        après réception du retour.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">
        Produit endommagé à la livraison
      </h2>
      <p>
        Nous contacter <strong>sous 48 h avec une photo</strong> pour une solution rapide.
      </p>
    </>
  );
}

function RetoursEn() {
  return (
    <>
      <h2 className="font-display text-xl text-foreground">30-day satisfaction guarantee</h2>
      <p>
        If you are not satisfied with your purchase, you have <strong>30 days from delivery</strong>{" "}
        to request a refund.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">How to make a request</h2>
      <p>
        Write to{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>{" "}
        with your <strong>order number</strong> and the reason; we will reply with the steps to
        follow.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Conditions</h2>
      <p>
        The product must be returned in <strong>reasonable condition</strong>; the refund is issued
        after we receive and verify the return.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Return shipping costs</h2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Defective product or our error</strong> → we cover return costs and refund you in
          full (or replace the product).
        </li>
        <li>
          <strong>Change of mind</strong> → return shipping is at your expense.
        </li>
      </ul>

      <h2 className="font-display text-xl text-foreground pt-2">Refund time</h2>
      <p>
        Refund issued to your original payment method, generally within{" "}
        <strong>5 to 10 business days</strong> after we receive the return.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Product damaged on delivery</h2>
      <p>
        Contact us <strong>within 48 hours with a photo</strong> for a quick solution.
      </p>
    </>
  );
}
