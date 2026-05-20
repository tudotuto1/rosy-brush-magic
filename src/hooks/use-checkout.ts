import { useState } from "react";

/**
 * Hook React pour déclencher un Stripe Checkout depuis un bouton
 * frontend. Appelle POST /api/checkout, redirige sur l'URL Stripe
 * retournée, et expose un état de chargement + une erreur générique
 * (pas de détails sensibles).
 */
export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(productId: string, quantity = 1) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        // On ne propage pas le détail de l'erreur backend au client.
        throw new Error("CHECKOUT_FAILED");
      }

      const data = (await response.json()) as { url?: string };
      if (!data.url) {
        throw new Error("NO_REDIRECT_URL");
      }

      // Redirection vers Stripe Checkout.
      window.location.href = data.url;
    } catch (err) {
      console.error("[useCheckout] Failed to start checkout:", err);
      setError("Le paiement n'a pas pu être initié. Veuillez réessayer.");
      setIsLoading(false);
    }
    // Pas de reset d'isLoading en cas de succès : la page se redirige.
  }

  return { startCheckout, isLoading, error };
}
