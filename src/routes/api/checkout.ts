import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { z } from "zod";
import type { AppEnv } from "@/lib/env";
import { getProduct } from "@/lib/products";
import { getStripeClient } from "@/lib/stripe";

// Valeur placeholder posée par la PR #1 tant que la vraie clé n'est pas injectée.
const STRIPE_KEY_PLACEHOLDER = "sk_test_PLACEHOLDER_REPLACE_ME";

const CheckoutBodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).optional().default(1),
});

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleCheckout(request: Request): Promise<Response> {
  try {
    // `cloudflare:workers` expose les bindings du Worker ; `Cloudflare.Env`
    // n'est pas augmenté ici, d'où le cast vers le contrat typé `AppEnv`.
    const appEnv = env as unknown as AppEnv;

    // 1) Stripe doit être configuré côté serveur.
    const secretKey = appEnv.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey === STRIPE_KEY_PLACEHOLDER) {
      console.error("[checkout] STRIPE_SECRET_KEY manquante ou non configurée");
      return jsonResponse({ error: "STRIPE_NOT_CONFIGURED" }, 500);
    }

    // 2) Lire et valider le body.
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonResponse({ error: "INVALID_INPUT" }, 400);
    }
    const parsed = CheckoutBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonResponse({ error: "INVALID_INPUT" }, 400);
    }
    const { productId, quantity } = parsed.data;

    // 3) Résoudre le produit via le catalogue server-side (prix de confiance).
    const product = getProduct(productId);
    if (!product) {
      return jsonResponse({ error: "PRODUCT_NOT_FOUND" }, 404);
    }

    // 4) Client Stripe.
    const stripe = getStripeClient(secretKey);

    // 5) Créer la session Checkout.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          price_data: {
            currency: product.currency,
            unit_amount: product.amountCents,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      success_url: `${appEnv.PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appEnv.PUBLIC_APP_URL}/?canceled=true`,
      metadata: {
        productId: product.id,
        quantity: String(quantity),
      },
    });

    // 6) Renvoyer l'URL de redirection Stripe.
    return jsonResponse({ url: session.url }, 200);
  } catch (error) {
    // 7) Logguer en détail côté serveur, ne jamais exposer l'erreur brute.
    console.error("[checkout] échec de création de la session:", error);
    return jsonResponse({ error: "CHECKOUT_FAILED" }, 500);
  }
}

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: ({ request }) => handleCheckout(request),
      // 8) Toute autre méthode est rejetée.
      ANY: () => jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405),
    },
  },
});
