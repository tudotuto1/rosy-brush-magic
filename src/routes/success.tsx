import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type Stripe from "stripe";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppEnv } from "@/lib/env";
import { getOrderBySessionId, type Order } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";

// Placeholder posé par la PR #1 tant que la vraie clé n'est pas injectée.
const STRIPE_KEY_PLACEHOLDER = "sk_test_PLACEHOLDER_REPLACE_ME";

const SearchSchema = z.object({
  session_id: z.string().min(1),
});

type LoaderResult =
  | {
      status: "paid";
      session: {
        customerEmail: string | null;
        amountTotal: number;
        currency: string;
      };
      order: Order | null;
    }
  | { status: "pending" };

/**
 * Server function : tout ce qui touche aux secrets (Stripe API key,
 * binding KV) reste côté Worker. Le bundle client ne reçoit qu'un
 * RPC stub vers cette fonction, jamais les valeurs sensibles.
 */
const loadSuccessData = createServerFn({ method: "GET" })
  .inputValidator((d: { sessionId: string }) => d)
  .handler(async ({ data }): Promise<LoaderResult> => {
    const appEnv = env as unknown as AppEnv;

    const secretKey = appEnv.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey === STRIPE_KEY_PLACEHOLDER) {
      console.error("[success] STRIPE_SECRET_KEY manquante ou non configurée");
      throw redirect({ to: "/", search: { error: "session-error" } as never });
    }

    const stripe = getStripeClient(secretKey);
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(data.sessionId);
    } catch (error) {
      console.error("[success] échec récupération session Stripe:", error);
      throw redirect({ to: "/", search: { error: "session-error" } as never });
    }

    if (session.payment_status === "paid") {
      const order = await getOrderBySessionId(appEnv.ORDERS_KV, session.id);
      return {
        status: "paid",
        session: {
          customerEmail: session.customer_details?.email ?? null,
          amountTotal: session.amount_total ?? 0,
          currency: session.currency ?? "cad",
        },
        order,
      };
    }

    // "unpaid", "no_payment_required" ou tout autre statut.
    return { status: "pending" };
  });

export const Route = createFileRoute("/success")({
  validateSearch: (search) => {
    const parsed = SearchSchema.safeParse(search);
    if (!parsed.success) {
      throw redirect({ to: "/" });
    }
    return parsed.data;
  },
  loaderDeps: ({ search }) => ({ sessionId: search.session_id }),
  loader: ({ deps }) => loadSuccessData({ data: { sessionId: deps.sessionId } }),
  component: SuccessPage,
});

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

const MAX_PENDING_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

function SuccessPage() {
  const data = Route.useLoaderData();
  if (data.status === "paid") {
    return <PaidView data={data} />;
  }
  return <PendingView />;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <Card className="max-w-lg w-full border-border shadow-md bg-background">{children}</Card>
    </div>
  );
}

function PaidView({ data }: { data: Extract<LoaderResult, { status: "paid" }> }) {
  const { session, order } = data;
  const emailLine = session.customerEmail
    ? `Un email de confirmation a été envoyé à ${session.customerEmail}.`
    : "Un email de confirmation a été envoyé.";

  return (
    <PageShell>
      <CardHeader>
        <CardTitle className="font-display text-3xl text-foreground">
          Merci pour ta commande 🎉
        </CardTitle>
        <CardDescription className="text-muted-foreground">{emailLine}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-3xl font-semibold text-rose-gold">
          {formatAmount(session.amountTotal, session.currency)}
        </div>
        <div className="text-sm text-muted-foreground">
          {order ? (
            <>
              Numéro de commande : <span className="font-mono text-foreground">{order.id}</span>
            </>
          ) : (
            "Confirmation en cours…"
          )}
        </div>
        <Button asChild className="gradient-rose text-white hover:opacity-90">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </CardContent>
    </PageShell>
  );
}

function PendingView() {
  const router = useRouter();
  const [retries, setRetries] = useState(0);
  const exhausted = retries >= MAX_PENDING_RETRIES;

  useEffect(() => {
    if (exhausted) return;
    const id = setTimeout(() => {
      setRetries((n) => n + 1);
      void router.invalidate();
    }, RETRY_DELAY_MS);
    return () => clearTimeout(id);
  }, [retries, exhausted, router]);

  if (exhausted) {
    return (
      <PageShell>
        <CardHeader>
          <CardTitle className="font-display text-2xl text-foreground">
            Confirmation plus longue que prévu
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Le paiement met du temps à se confirmer. Vérifie tes emails ou contacte-nous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="gradient-rose text-white hover:opacity-90">
            <Link to="/">Retour</Link>
          </Button>
        </CardContent>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <CardHeader>
        <CardTitle className="font-display text-2xl text-foreground flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-rose-gold" />
          Vérification du paiement en cours…
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Si le paiement a été effectué, cette page sera mise à jour automatiquement.
        </CardDescription>
      </CardHeader>
    </PageShell>
  );
}
