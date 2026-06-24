import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Package, Truck } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth-server";
import { getMyOrders } from "@/lib/orders-server";
import type { Order } from "@/db/schema";

export const Route = createFileRoute("/compte")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/connexion" });
    }
    return { user: session.user };
  },
  loader: async () => ({ orders: await getMyOrders() }),
  component: ComptePage,
});

const dateFormatter = new Intl.DateTimeFormat("fr-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function ComptePage() {
  const { user } = Route.useRouteContext();
  const { orders } = Route.useLoaderData();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    await navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 lg:py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground">Mon compte</h1>
          <p className="text-muted-foreground">
            Connecté en tant que <span className="font-medium text-foreground">{user.email}</span>.
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/40 flex items-center justify-center">
              <Package className="h-5 w-5 text-rose-gold" />
            </div>
            <h2 className="font-semibold text-lg">Historique de commandes</h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 space-y-4">
              <p className="text-sm text-muted-foreground">Aucune commande pour l'instant.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-rose-gold hover:underline"
              >
                Découvrir le produit
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(orders as Order[]).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>

        <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">Session</h2>
            <p className="text-sm text-muted-foreground">Termine ta session sur cet appareil.</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      </main>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const dateLabel = dateFormatter.format(new Date(order.createdAt));
  const amountLabel = formatAmount(order.amountTotal, order.currency);
  const hasTracking = Boolean(order.trackingNumber);

  return (
    <article className="bg-background rounded-3xl border border-border p-6 sm:p-7 space-y-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-0.5">
          <div className="text-sm text-muted-foreground">{dateLabel}</div>
          <div className="text-lg font-semibold">
            Commande{" "}
            <span className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">{amountLabel}</div>
          <div className="text-xs text-muted-foreground capitalize">{order.status}</div>
        </div>
      </header>

      <div className="text-sm text-muted-foreground">
        Quantité : <span className="text-foreground font-medium">{order.quantity}</span>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-cream border border-border p-4">
        <Truck className="h-5 w-5 shrink-0 text-rose-gold mt-0.5" />
        <div className="text-sm">
          {hasTracking ? (
            <>
              <div className="font-medium text-foreground">
                Suivi : {order.carrier ?? "Transporteur"} ·{" "}
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
              {order.trackingStatus && (
                <div className="text-muted-foreground mt-0.5">{order.trackingStatus}</div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground">Expédition en préparation</div>
          )}
        </div>
      </div>
    </article>
  );
}
