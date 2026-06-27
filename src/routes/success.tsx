import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type Stripe from "stripe";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LangToggle } from "@/components/lang-toggle";
import { useCart } from "@/hooks/use-cart";
import { useLang } from "@/lib/i18n";
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

function formatAmount(cents: number, currency: string, lang: "fr" | "en"): string {
  return new Intl.NumberFormat(lang === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

const MAX_PENDING_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

function SuccessPage() {
  const data = Route.useLoaderData();
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // Vidage panier au mount uniquement ; clearCart change d'identité à chaque render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (data.status === "paid") {
    return <PaidView data={data} />;
  }
  return <PendingView />;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <LangToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <Card className="max-w-lg w-full border-border shadow-md bg-background">{children}</Card>
      </div>
    </div>
  );
}

function PaidView({ data }: { data: Extract<LoaderResult, { status: "paid" }> }) {
  const { lang } = useLang();
  const fr = lang === "fr";
  const { session, order } = data;
  const emailLine = session.customerEmail
    ? fr
      ? `Un email de confirmation a été envoyé à ${session.customerEmail}.`
      : `A confirmation email has been sent to ${session.customerEmail}.`
    : fr
      ? "Un email de confirmation a été envoyé."
      : "A confirmation email has been sent.";

  return (
    <PageShell>
      <CardHeader>
        <CardTitle className="font-display text-3xl text-foreground">
          {fr ? "Merci pour ta commande 🎉" : "Thank you for your order 🎉"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{emailLine}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-3xl font-semibold text-rose-gold">
          {formatAmount(session.amountTotal, session.currency, lang)}
        </div>
        <div className="text-sm text-muted-foreground">
          {order ? (
            <>
              {fr ? "Numéro de commande :" : "Order number:"}{" "}
              <span className="font-mono text-foreground">{order.id}</span>
            </>
          ) : fr ? (
            "Confirmation en cours…"
          ) : (
            "Confirming…"
          )}
        </div>
        <Button asChild className="gradient-rose text-white hover:opacity-90">
          <Link to="/">{fr ? "Retour à l'accueil" : "Back to home"}</Link>
        </Button>
      </CardContent>
    </PageShell>
  );
}

function PendingView() {
  const { lang } = useLang();
  const fr = lang === "fr";
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
            {fr
              ? "Confirmation plus longue que prévu"
              : "Confirmation is taking longer than expected"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {fr
              ? "Le paiement met du temps à se confirmer. Vérifie tes emails ou contacte-nous."
              : "The payment is taking a while to confirm. Check your emails or get in touch."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="gradient-rose text-white hover:opacity-90">
            <Link to="/">{fr ? "Retour" : "Back"}</Link>
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
          {fr ? "Vérification du paiement en cours…" : "Verifying payment…"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {fr
            ? "Si le paiement a été effectué, cette page sera mise à jour automatiquement."
            : "If the payment went through, this page will update automatically."}
        </CardDescription>
      </CardHeader>
    </PageShell>
  );
}
