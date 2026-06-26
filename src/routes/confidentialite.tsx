import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/confidentialite")({
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <LegalPage
      title={fr ? "Politique de confidentialité" : "Privacy Policy"}
      subtitle={fr ? "Dernière mise à jour : 25 juin 2026" : "Last updated: June 25, 2026"}
    >
      {fr ? <ConfidentialiteFr /> : <ConfidentialiteEn />}
    </LegalPage>
  );
}

function ConfidentialiteFr() {
  return (
    <>
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
    </>
  );
}

function ConfidentialiteEn() {
  return (
    <>
      <p>
        At Kinetis Brush ("we"), protecting your personal information is a priority. This policy
        explains what data we collect, why, and your rights, in accordance with Quebec's Law 25 and
        Canada's PIPEDA.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">
        Person responsible for the protection of personal information
      </h2>
      <p>
        Kinetis Brush —{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        . For any question or request regarding your data, write to this address.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Information we collect</h2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Email address</strong> (account, login, order confirmation).
        </li>
        <li>
          <strong>Name and shipping address</strong> (provided at checkout).
        </li>
        <li>
          <strong>Order details</strong> (product, amount, date, status, tracking).
        </li>
        <li>
          <strong>Photos and text</strong> you choose to publish in a review.
        </li>
      </ul>
      <p>
        We do not store <strong>any bank card data</strong> (payments are processed by Stripe).
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Purposes</h2>
      <p>
        Process and deliver your orders, manage your account and history, send order-related emails
        (login, shipping), display reviews, and meet our legal obligations.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Sharing with third parties</h2>
      <p>
        <strong>Stripe</strong> (payment processing), <strong>Resend</strong> (email delivery),{" "}
        <strong>Cloudflare</strong> (hosting/storage), and our <strong>shipping supplier</strong>{" "}
        (name + shipping address, to fulfill your order). We never sell your information.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Hosting outside Quebec</h2>
      <p>
        Some of these providers may store or process your information outside Quebec, notably in the
        United States. By using the site, you are informed of this.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Retention</h2>
      <p>
        As long as necessary for these purposes and our legal obligations. You may request account
        deletion at any time.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Your rights</h2>
      <p>
        Access, rectification, deletion, and withdrawal of consent, by writing to{" "}
        <a href="mailto:kinetisbrush@gmail.com" className="text-rose-gold hover:underline">
          kinetisbrush@gmail.com
        </a>
        . You may also file a complaint with Quebec's{" "}
        <strong>Commission d'accès à l'information</strong>.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Cookies</h2>
      <p>
        Only those strictly necessary for the site to function (login session, cart). Any future
        analytics or advertising tools will require your prior consent.
      </p>

      <h2 className="font-display text-xl text-foreground pt-2">Changes</h2>
      <p>This policy may be updated; the date above shows the last revision.</p>
    </>
  );
}
