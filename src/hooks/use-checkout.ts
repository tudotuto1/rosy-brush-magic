import { useState } from "react";

/**
 * Hook pour déclencher un Stripe Checkout depuis un bouton frontend.
 * Appelle POST /api/checkout, redirige vers l'URL Stripe retournée.
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
      if (!response.ok) throw new Error("CHECKOUT_FAILED");
      const data = (await response.json()) as { url?: string };
      if (!data.url) throw new Error("NO_REDIRECT_URL");
      window.location.href = data.url;
    } catch (err) {
      console.error("[useCheckout] Failed to start checkout:", err);
      setError("Le paiement n'a pas pu être initié. Veuillez réessayer.");
      setIsLoading(false);
    }
  }

  return { startCheckout, isLoading, error };
}
