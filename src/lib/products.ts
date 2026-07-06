/**
 * Catalogue produit SERVER-SIDE.
 * Source de vérité unique pour les prix.
 * Le client n'envoie qu'un productId, JAMAIS un prix.
 */
export type Product = {
  id: string;
  name: string;
  description: string;
  amountCents: number; // en cents (Stripe attend des cents)
  currency: "cad" | "eur" | "usd";
};

/**
 * Produit unique du catalogue.
 * `amountCents` est la SOURCE DE VÉRITÉ UNIQUE du prix : c'est le montant
 * facturé par Stripe (checkout.ts) ET la base de tous les affichages (via
 * `formatPrice`). Changer le prix ne doit toucher que cette ligne.
 */
export const KINETIS_BRUSH: Product = {
  id: "kinetis-brush",
  name: "Kinetis Brush",
  description: "Makeup Brush Cleaner",
  amountCents: 100, // 1,00 $ CAD (prix de test final)
  currency: "cad",
};

export const PRODUCTS: Record<string, Product> = {
  [KINETIS_BRUSH.id]: KINETIS_BRUSH,
};

export function getProduct(id: string): Product | null {
  return PRODUCTS[id] ?? null;
}

/**
 * Formate un montant (en cents) selon la locale, dérivé de `amountCents`.
 *   "fr" → "34,99 $"      ·  "en" → "$34.99"       (le « $ » est le symbole CAD)
 *   withCurrency: true → "34,99 $ CAD" / "$34.99 CAD" (textes légaux, etc.)
 */
export function formatPrice(
  amountCents: number,
  lang: "fr" | "en",
  opts: { withCurrency?: boolean } = {},
): string {
  const value = new Intl.NumberFormat(lang === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amountCents / 100);
  return opts.withCurrency ? `${value} CAD` : value;
}
