import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Order } from "@/db/schema";
import { getAdminSession, getAllOrders, updateOrderTracking } from "@/lib/admin-server";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const admin = await getAdminSession();
    if (!admin) {
      throw redirect({ to: "/" });
    }
    return { admin };
  },
  loader: async () => ({ orders: await getAllOrders() }),
  component: AdminPage,
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

function AdminPage() {
  const { orders } = Route.useLoaderData();

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

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 lg:py-16 space-y-8">
        <div className="space-y-2">
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
      </main>
    </div>
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
