import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Lock,
  Truck,
  Clock,
  Heart,
  Ruler,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import productMain from "@/assets/product-main.jpeg";
import { LangToggle } from "@/components/lang-toggle";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/panier")({
  component: PanierPage,
});

const PRODUCT_ID = "kinetis-brush";
const UNIT_PRICE_CENTS = 4599; // 45,99 $ CAD (affichage ; le vrai montant vient du serveur)

function PanierPage() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const { quantity, setQuantity, mounted } = useCart();
  const { startCheckout, isLoading, error } = useCheckout();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const cad = new Intl.NumberFormat(fr ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
  });
  const subtotal = (UNIT_PRICE_CENTS * quantity) / 100;

  const s = fr
    ? {
        back: "Continuer mes achats",
        title: "Votre panier",
        loading: "Chargement…",
        emptyTitle: "Votre panier est vide.",
        emptyCta: "Découvrir le produit",
        productName: "Kinetis Brush",
        productSubtitle: "Nettoyeur de pinceaux électrique",
        remove: "Retirer du panier",
        decrease: "Diminuer la quantité",
        increase: "Augmenter la quantité",
        bullets: [
          { t: "Garantie 30 jours", d: "Satisfait ou remboursé." },
          { t: "Paiement 100% sécurisé", d: "Transactions chiffrées via Stripe." },
          {
            t: "Livraison 5 à 8 jours ouvrés",
            d: "Expédiée par nos partenaires fournisseurs, partout au Canada.",
          },
          { t: "Propre en 30 secondes", d: "Nettoie et sèche vos pinceaux en un instant." },
          { t: "Préserve la douceur des poils", d: "Rotation douce qui n'abîme pas les fibres." },
          { t: "S'adapte à tous vos pinceaux", d: "3 colliers en silicone multi-tailles fournis." },
        ],
        summary: "Récapitulatif",
        subtotalLabel: (q: number) => `Sous-total (${q} article${q > 1 ? "s" : ""})`,
        shipping: "Livraison",
        free: "Offerte",
        total: "Total",
        checkout: "Passer au paiement",
        redirecting: "Redirection…",
      }
    : {
        back: "Continue shopping",
        title: "Your cart",
        loading: "Loading…",
        emptyTitle: "Your cart is empty.",
        emptyCta: "Discover the product",
        productName: "Kinetis Brush",
        productSubtitle: "Electric makeup brush cleaner",
        remove: "Remove from cart",
        decrease: "Decrease quantity",
        increase: "Increase quantity",
        bullets: [
          { t: "30-day guarantee", d: "Satisfied or your money back." },
          { t: "100% secure payment", d: "Encrypted transactions via Stripe." },
          {
            t: "5 to 8 business days shipping",
            d: "Shipped by our fulfillment partners, anywhere in Canada.",
          },
          { t: "Clean in 30 seconds", d: "Cleans and dries your brushes in an instant." },
          { t: "Gentle on bristles", d: "A soft rotation that doesn't damage the fibres." },
          { t: "Fits every brush you own", d: "3 multi-size silicone collars included." },
        ],
        summary: "Summary",
        subtotalLabel: (q: number) => `Subtotal (${q} item${q > 1 ? "s" : ""})`,
        shipping: "Shipping",
        free: "Free",
        total: "Total",
        checkout: "Proceed to checkout",
        redirecting: "Redirecting…",
      };

  // Map bullets to icons (kept stable across languages by index).
  const bulletIcons = [ShieldCheck, Lock, Truck, Clock, Heart, Ruler];

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-medium mb-8">{s.title}</h1>

        {!mounted ? (
          <p className="text-muted-foreground">{s.loading}</p>
        ) : quantity <= 0 ? (
          <div className="text-center py-20 space-y-6">
            <div className="h-16 w-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">{s.emptyTitle}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 gradient-rose text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all"
            >
              {s.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,380px] gap-10">
            <div className="space-y-8">
              <div className="flex gap-5 bg-cream rounded-3xl p-5 border border-border">
                <div className="h-28 w-28 shrink-0 rounded-2xl overflow-hidden bg-background">
                  <img
                    src={productMain}
                    alt={s.productName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-lg">{s.productName}</h2>
                      <p className="text-sm text-muted-foreground">{s.productSubtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(0)}
                      className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-rose-gold"
                      aria-label={s.remove}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="inline-flex items-center rounded-full border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2.5 disabled:opacity-40"
                        aria-label={s.decrease}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= 10}
                        className="p-2.5 disabled:opacity-40"
                        aria-label={s.increase}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold">{cad.format(subtotal)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {s.bullets.map((b, i) => {
                  const Icon = bulletIcons[i];
                  return (
                    <div
                      key={b.t}
                      className="flex items-start gap-3 p-4 rounded-2xl border border-border"
                    >
                      <div className="h-9 w-9 shrink-0 rounded-xl bg-accent/40 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-rose-gold" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{b.t}</div>
                        <div className="text-sm text-muted-foreground">{b.d}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-cream rounded-3xl p-6 border border-border space-y-4">
                <h3 className="font-semibold text-lg">{s.summary}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{s.subtotalLabel(quantity)}</span>
                    <span>{cad.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{s.shipping}</span>
                    <span className="text-rose-gold font-medium">{s.free}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-baseline">
                  <span className="font-semibold">{s.total}</span>
                  <span className="text-2xl font-semibold">{cad.format(subtotal)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => startCheckout(PRODUCT_ID, quantity)}
                  disabled={isLoading}
                  className="group flex items-center justify-center gap-3 w-full gradient-rose text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Lock className="h-5 w-5" />
                  {isLoading ? s.redirecting : s.checkout}
                </button>
                <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" /> Visa · Mastercard · Apple Pay
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
