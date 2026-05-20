import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import Stripe from "stripe";
import type { AppEnv } from "@/lib/env";
import { getOrderBySessionId, saveOrder, type Order } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";

// Placeholder posé par la PR #1 tant que le vrai whsec_ n'est pas injecté.
const WEBHOOK_SECRET_PLACEHOLDER = "whsec_PLACEHOLDER_REPLACE_ME";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  appEnv: AppEnv,
): Promise<void> {
  const sessionId = session.id;
  const customerEmail = session.customer_details?.email ?? null;
  const amountCents = session.amount_total ?? 0;
  const currency = session.currency ?? "cad";
  const productId = session.metadata?.productId ?? "unknown";
  const quantityStr = session.metadata?.quantity ?? "1";
  const parsedQuantity = parseInt(quantityStr, 10);
  const quantity = Number.isNaN(parsedQuantity) ? 1 : parsedQuantity;

  // Idempotence : Stripe peut renvoyer le même event plusieurs fois.
  const existing = await getOrderBySessionId(appEnv.ORDERS_KV, sessionId);
  if (existing) {
    console.log("[Webhook] duplicate event ignored", sessionId);
    return;
  }

  const order: Order = {
    id: crypto.randomUUID(),
    sessionId,
    productId,
    quantity,
    amountCents,
    currency,
    customerEmail,
    status: "paid",
    createdAt: new Date().toISOString(),
  };
  await saveOrder(appEnv.ORDERS_KV, order);
  console.log("[Webhook] Order saved", order.id);
}

async function handleWebhook(request: Request): Promise<Response> {
  const appEnv = env as unknown as AppEnv;

  // 1) Signature obligatoire.
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("[Webhook] missing stripe-signature header");
    return jsonResponse({ error: "MISSING_SIGNATURE" }, 400);
  }

  // 2) Body brut AVANT toute manipulation (la signature s'applique sur les bytes exacts).
  const rawBody = await request.text();

  // 3) Le secret webhook doit être configuré.
  const webhookSecret = appEnv.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret === WEBHOOK_SECRET_PLACEHOLDER) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET manquante ou non configurée");
    return jsonResponse({ error: "WEBHOOK_NOT_CONFIGURED" }, 500);
  }

  // 4) Vérification de signature avec le provider SubtleCrypto (obligatoire dans Workers).
  const stripe = getStripeClient(appEnv.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (error) {
    console.error("[Webhook] signature verification failed:", error);
    return jsonResponse({ error: "INVALID_SIGNATURE" }, 400);
  }

  // 5/6/7) Traitement métier. Toujours 200 si la signature est valide
  // (sinon Stripe retry en boucle) ; les erreurs internes renvoient 500
  // pour déclencher un retry idempotent.
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, appEnv);
        break;
      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }
    return jsonResponse({ received: true }, 200);
  } catch (error) {
    console.error("[Webhook] processing failed:", error);
    return jsonResponse({ error: "WEBHOOK_PROCESSING_FAILED" }, 500);
  }
}

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: ({ request }) => handleWebhook(request),
      ANY: () => jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405),
    },
  },
});
