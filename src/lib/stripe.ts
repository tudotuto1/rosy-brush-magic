import Stripe from "stripe";

/**
 * Instancie un client Stripe configuré pour Cloudflare Workers.
 * `createFetchHttpClient` est OBLIGATOIRE dans Workers (pas de Node http).
 * À appeler depuis les routes API server-side uniquement.
 */
export function getStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
    // `Stripe.API_VERSION` = version d'API stable épinglée par le SDK installé.
    apiVersion: Stripe.API_VERSION,
  });
}
