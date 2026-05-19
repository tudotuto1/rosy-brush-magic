import Stripe from "stripe";

/**
 * Instancie un client Stripe configuré pour Cloudflare Workers.
 * `createFetchHttpClient` est OBLIGATOIRE dans Workers (pas de Node http).
 * À appeler depuis les routes API uniquement, jamais côté client.
 */
export function getStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
    // Version épinglée par le SDK stripe@22 ; "2024-12-18.acacia" est obsolète.
    apiVersion: "2026-04-22.dahlia",
  });
}
