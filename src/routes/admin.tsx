import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, Package, Star, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Order } from "@/db/schema";
import {
  getAdminSession,
  getAllOrders,
  getPendingReviews,
  moderateReview,
  updateOrderTracking,
} from "@/lib/admin-server";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const admin = await getAdminSession();
    if (!admin) {
      throw redirect({ to: "/" });
    }
    return { admin };
  },
  loader: async () => ({
    orders: await getAllOrders(),
    pendingReviews: await getPendingReviews(),
  }),
  component: AdminPage,
});

type PendingReview = {
  id: string;
  rating: number;
  comment: string | null;
  photoKeys: string[];
  email: string;
  createdAt: string;
};

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

type ShippingAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

/** Découpe l'adresse Stripe (JSON) en lignes lisibles. Renvoie [] si vide/illisible. */
function formatShippingAddress(raw: string | null): string[] {
  if (!raw) return [];
  let addr: ShippingAddress;
  try {
    addr = JSON.parse(raw) as ShippingAddress;
  } catch {
    return [];
  }
  const cityLine = [addr.city, addr.state, addr.postal_code].filter(Boolean).join(" ");
  return [addr.line1, addr.line2, cityLine, addr.country].filter(
    (line): line is string => Boolean(line) && line!.trim().length > 0,
  );
}

function AdminPage() {
  const { orders, pendingReviews } = Route.useLoaderData();

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

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 lg:py-16 space-y-10">
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground">
              Avis en attente de modération
            </h2>
            <p className="text-sm text-muted-foreground">
              {pendingReviews.length} avis en attente.
            </p>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="bg-background rounded-3xl border border-border p-8 text-sm text-muted-foreground">
              Aucun avis en attente.
            </div>
          ) : (
            <div className="space-y-4">
              {(pendingReviews as PendingReview[]).map((review) => (
                <AdminReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-4xl text-foreground">Admin — Commandes</h1>
            <p className="text-muted-foreground">
              {orders.length} commande{orders.length > 1 ? "s" : ""} au total.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-background rounded-3xl border border-border p-8 text-sm text-muted-foreground">
              Aucune commande pour l'instant.
            </div>
          ) : (
            <div className="space-y-4">
              {(orders as Order[]).map((order) => (
                <AdminOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StarsRow({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= rating;
        return (
          <Star
            key={n}
            className={`h-4 w-4 ${active ? "text-rose-gold" : "text-muted-foreground/30"}`}
            style={active ? { fill: "currentColor" } : undefined}
          />
        );
      })}
    </div>
  );
}

function AdminReviewCard({ review }: { review: PendingReview }) {
  const router = useRouter();
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState(false);

  async function moderate(action: "approve" | "reject") {
    if (pending) return;
    setPending(action);
    setError(false);
    try {
      await moderateReview({ data: { reviewId: review.id, action } });
      await router.invalidate();
    } catch (err) {
      console.error("[admin] moderateReview failed:", err);
      setError(true);
      setPending(null);
    }
  }

  const dateLabel = dateFormatter.format(new Date(review.createdAt));

  return (
    <article className="bg-background rounded-3xl border border-border p-6 sm:p-7 space-y-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <StarsRow rating={review.rating} />
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">{review.email}</span> · {dateLabel} ·{" "}
            <span className="font-mono">#{review.id.slice(0, 8)}</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          En attente
        </span>
      </header>

      {review.comment && <p className="text-foreground leading-relaxed">"{review.comment}"</p>}

      {review.photoKeys.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {review.photoKeys.slice(0, 3).map((key) => (
            <div
              key={key}
              className="aspect-square rounded-2xl overflow-hidden bg-cream border border-border"
            >
              <img
                src={`/api/reviews/photo/${key}`}
                alt="Photo d'avis client"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-sm">
          {error && <span className="text-rose-gold">Échec — réessaie.</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moderate("reject")}
            disabled={pending !== null}
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm font-medium hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending === "reject" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Rejeter
          </button>
          <button
            type="button"
            onClick={() => moderate("approve")}
            disabled={pending !== null}
            className="inline-flex items-center gap-2 gradient-rose text-white px-5 py-2 rounded-2xl text-sm font-medium shadow-md hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {pending === "approve" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Approuver
          </button>
        </div>
      </div>
    </article>
  );
}

function AdminOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [carrier, setCarrier] = useState(order.carrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [trackingStatus, setTrackingStatus] = useState(order.trackingStatus ?? "");
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "saved" | "saved-email" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback("idle");
    try {
      const result = await updateOrderTracking({
        data: {
          orderId: order.id,
          carrier,
          trackingNumber,
          trackingStatus,
          notify,
        },
      });
      setFeedback(result.emailSent ? "saved-email" : "saved");
      await router.invalidate();
    } catch (error) {
      console.error("[admin] updateOrderTracking failed:", error);
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  }

  const dateLabel = dateFormatter.format(new Date(order.createdAt));
  const amountLabel = formatAmount(order.amountTotal, order.currency);
  const addressLines = formatShippingAddress(order.shippingAddress);
  const hasShipping = Boolean(order.shippingName) || addressLines.length > 0;

  return (
    <article className="bg-background rounded-3xl border border-border p-6 sm:p-7 space-y-5">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-accent/40 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-rose-gold" />
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold text-foreground">{order.email}</div>
            <div className="text-xs text-muted-foreground">
              {dateLabel} · <span className="font-mono">#{order.id.slice(0, 8)}</span> · qté{" "}
              {order.quantity}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{amountLabel}</div>
          <div className="text-xs text-muted-foreground capitalize">{order.status}</div>
        </div>
      </header>

      {hasShipping && (
        <div className="rounded-2xl bg-cream border border-border p-4 text-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Adresse de livraison
          </div>
          {order.shippingName && (
            <div className="font-medium text-foreground">{order.shippingName}</div>
          )}
          {addressLines.map((line, i) => (
            <div key={i} className="text-muted-foreground">
              {line}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-3">
        <label className="text-sm space-y-1">
          <span className="text-muted-foreground">Transporteur</span>
          <input
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Postes Canada, UPS…"
            maxLength={100}
            disabled={saving}
            className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-gold/40 disabled:opacity-60"
          />
        </label>
        <label className="text-sm space-y-1">
          <span className="text-muted-foreground">N° de suivi</span>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="ABC123…"
            maxLength={200}
            disabled={saving}
            className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 font-mono outline-none focus:ring-2 focus:ring-rose-gold/40 disabled:opacity-60"
          />
        </label>
        <label className="text-sm space-y-1">
          <span className="text-muted-foreground">Statut de suivi</span>
          <input
            type="text"
            value={trackingStatus}
            onChange={(e) => setTrackingStatus(e.target.value)}
            placeholder="Expédié, en transit…"
            maxLength={100}
            disabled={saving}
            className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-gold/40 disabled:opacity-60"
          />
        </label>

        <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              disabled={saving}
              className="h-4 w-4 accent-rose-gold"
            />
            Notifier le client par email
          </label>
          <div className="text-sm">
            {feedback === "saved" && <span className="text-rose-gold">Suivi enregistré ✅</span>}
            {feedback === "saved-email" && (
              <span className="text-rose-gold">Suivi enregistré ✅ — email envoyé</span>
            )}
            {feedback === "error" && <span className="text-rose-gold">Échec — réessaie.</span>}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 gradient-rose text-white px-5 py-2.5 rounded-2xl font-medium shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Enregistrement…" : "Enregistrer le suivi"}
          </button>
        </div>
      </form>
    </article>
  );
}
