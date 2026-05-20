/**
 * Modèle de commande et helpers KV pour la persistance des paiements.
 * Toutes les opérations passent par les bindings Cloudflare KV (ORDERS_KV).
 */

export type Order = {
  id: string; // UUID v4 (crypto.randomUUID)
  sessionId: string; // Stripe checkout session id
  productId: string;
  quantity: number;
  amountCents: number;
  currency: string;
  customerEmail: string | null;
  status: "paid" | "refunded";
  createdAt: string; // ISO 8601
};

/**
 * Enregistre une commande dans KV.
 * - Stocke l'objet sous la clé `order:<orderId>`.
 * - Crée un index secondaire `session:<sessionId>` -> orderId
 *   pour permettre les lookups par sessionId.
 */
export async function saveOrder(kv: KVNamespace, order: Order): Promise<void> {
  await kv.put(`order:${order.id}`, JSON.stringify(order));
  await kv.put(`session:${order.sessionId}`, order.id);
}

/**
 * Récupère une commande à partir d'une sessionId Stripe.
 * Retourne null si la commande n'existe pas (utile pour l'idempotence
 * du webhook : on évite de créer deux fois la même commande).
 */
export async function getOrderBySessionId(
  kv: KVNamespace,
  sessionId: string,
): Promise<Order | null> {
  const orderId = await kv.get(`session:${sessionId}`);
  if (!orderId) return null;
  const raw = await kv.get(`order:${orderId}`);
  if (!raw) return null;
  return JSON.parse(raw) as Order;
}
