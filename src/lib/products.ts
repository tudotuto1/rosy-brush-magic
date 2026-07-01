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

export const PRODUCTS: Record<string, Product> = {
  "kinetis-brush": {
    id: "kinetis-brush",
    name: "Kinetis Brush",
    description: "Makeup Brush Cleaner",
    amountCents: 45, // 0.45 CAD (test price)
    currency: "cad",
  },
};

export function getProduct(id: string): Product | null {
  return PRODUCTS[id] ?? null;
}
