import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/retours")({
  component: RetoursPage,
});

function RetoursPage() {
  return (
    <LegalPage
      title="Politique de retour et de remboursement"
      subtitle="Dernière mise à jour : 25 juin 2026"
    >
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
    </LegalPage>
  );
}
