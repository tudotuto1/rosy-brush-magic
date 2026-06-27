import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Package, Star, Truck } from "lucide-react";
import { useState } from "react";
import { LangToggle } from "@/components/lang-toggle";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth-server";
import { useLang } from "@/lib/i18n";
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

function getDateFormatter(lang: "fr" | "en") {
  return new Intl.DateTimeFormat(lang === "en" ? "en-CA" : "fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAmount(cents: number, currency: string, lang: "fr" | "en"): string {
  return new Intl.NumberFormat(lang === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function ComptePage() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const { user } = Route.useRouteContext();
  const { orders } = Route.useLoaderData();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    await navigate({ to: "/" });
  }

  const s = fr
    ? {
        back: "Retour à l'accueil",
        title: "Mon compte",
        signedInAs: "Connecté en tant que",
        orderHistory: "Historique de commandes",
        noOrders: "Aucune commande pour l'instant.",
        discover: "Découvrir le produit",
        reviewTitle: "Laisser un avis",
        reviewIntro: "Partage ton expérience avec Kinetis Brush.",
        reviewCta: "Écrire un avis",
        sessionTitle: "Session",
        sessionIntro: "Termine ta session sur cet appareil.",
        signOut: "Se déconnecter",
        signingOut: "Déconnexion…",
      }
    : {
        back: "Back to home",
        title: "My account",
        signedInAs: "Signed in as",
        orderHistory: "Order history",
        noOrders: "No orders yet.",
        discover: "Discover the product",
        reviewTitle: "Leave a review",
        reviewIntro: "Share your experience with Kinetis Brush.",
        reviewCta: "Write a review",
        sessionTitle: "Session",
        sessionIntro: "End your session on this device.",
        signOut: "Sign out",
        signingOut: "Signing out…",
      };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {s.back}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 lg:py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground">{s.title}</h1>
          <p className="text-muted-foreground">
            {s.signedInAs} <span className="font-medium text-foreground">{user.email}</span>.
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/40 flex items-center justify-center">
              <Package className="h-5 w-5 text-rose-gold" />
            </div>
            <h2 className="font-semibold text-lg">{s.orderHistory}</h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 space-y-4">
              <p className="text-sm text-muted-foreground">{s.noOrders}</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-rose-gold hover:underline"
              >
                {s.discover}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(orders as Order[]).map((order) => (
                <OrderCard key={order.id} order={order} lang={lang} />
              ))}
            </div>
          )}
        </section>

        <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/40 flex items-center justify-center">
              <Star className="h-5 w-5 text-rose-gold" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{s.reviewTitle}</h2>
              <p className="text-sm text-muted-foreground">{s.reviewIntro}</p>
            </div>
          </div>
          <Link
            to="/avis"
            className="inline-flex items-center gap-2 gradient-rose text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-md hover:shadow-xl transition-all"
          >
            {s.reviewCta}
          </Link>
        </div>

        <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">{s.sessionTitle}</h2>
            <p className="text-sm text-muted-foreground">{s.sessionIntro}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? s.signingOut : s.signOut}
          </button>
        </div>
      </main>
    </div>
  );
}

function OrderCard({ order, lang }: { order: Order; lang: "fr" | "en" }) {
  const fr = lang === "fr";
  const dateLabel = getDateFormatter(lang).format(new Date(order.createdAt));
  const amountLabel = formatAmount(order.amountTotal, order.currency, lang);
  const hasTracking = Boolean(order.trackingNumber);

  const labels = fr
    ? {
        order: "Commande",
        quantity: "Quantité :",
        tracking: "Suivi",
        carrierFallback: "Transporteur",
        preparing: "Expédition en préparation",
      }
    : {
        order: "Order",
        quantity: "Quantity:",
        tracking: "Tracking",
        carrierFallback: "Carrier",
        preparing: "Preparing shipment",
      };

  return (
    <article className="bg-background rounded-3xl border border-border p-6 sm:p-7 space-y-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-0.5">
          <div className="text-sm text-muted-foreground">{dateLabel}</div>
          <div className="text-lg font-semibold">
            {labels.order}{" "}
            <span className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">{amountLabel}</div>
          <div className="text-xs text-muted-foreground capitalize">{order.status}</div>
        </div>
      </header>

      <div className="text-sm text-muted-foreground">
        {labels.quantity} <span className="text-foreground font-medium">{order.quantity}</span>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-cream border border-border p-4">
        <Truck className="h-5 w-5 shrink-0 text-rose-gold mt-0.5" />
        <div className="text-sm">
          {hasTracking ? (
            <>
              <div className="font-medium text-foreground">
                {labels.tracking} : {order.carrier ?? labels.carrierFallback} ·{" "}
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
              {order.trackingStatus && (
                <div className="text-muted-foreground mt-0.5">{order.trackingStatus}</div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground">{labels.preparing}</div>
          )}
        </div>
      </div>
    </article>
  );
}
