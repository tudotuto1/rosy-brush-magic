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
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { toast } from "sonner";

export const Route = createFileRoute("/panier")({
  component: PanierPage,
});

const PRODUCT_ID = "kinetis-brush";
const UNIT_PRICE_CENTS = 4599; // 45,99 $ CAD (affichage ; le vrai montant vient du serveur)
const cad = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" });

function PanierPage() {
  const { quantity, setQuantity, mounted } = useCart();
  const { startCheckout, isLoading, error } = useCheckout();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const subtotal = (UNIT_PRICE_CENTS * quantity) / 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Continuer mes achats
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-medium mb-8">Votre panier</h1>

        {!mounted ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : quantity <= 0 ? (
          <div className="text-center py-20 space-y-6">
            <div className="h-16 w-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">Votre panier est vide.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 gradient-rose text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all"
            >
              Découvrir le produit
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,380px] gap-10">
            <div className="space-y-8">
              <div className="flex gap-5 bg-cream rounded-3xl p-5 border border-border">
                <div className="h-28 w-28 shrink-0 rounded-2xl overflow-hidden bg-background">
                  <img
                    src={productMain}
                    alt="Kinetis Brush"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-lg">Kinetis Brush</h2>
                      <p className="text-sm text-muted-foreground">
                        Nettoyeur de pinceaux électrique
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(0)}
                      className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-rose-gold"
                      aria-label="Retirer du panier"
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
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= 10}
                        className="p-2.5 disabled:opacity-40"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold">{cad.format(subtotal)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, t: "Garantie 30 jours", d: "Satisfait ou remboursé." },
                  {
                    icon: Lock,
                    t: "Paiement 100% sécurisé",
                    d: "Transactions chiffrées via Stripe.",
                  },
                  {
                    icon: Truck,
                    t: "Livraison 5 à 8 jours ouvrés",
                    d: "Expédiée par nos partenaires fournisseurs, partout au Canada.",
                  },
                  {
                    icon: Clock,
                    t: "Propre en 30 secondes",
                    d: "Nettoie et sèche vos pinceaux en un instant.",
                  },
                  {
                    icon: Heart,
                    t: "Préserve la douceur des poils",
                    d: "Rotation douce qui n'abîme pas les fibres.",
                  },
                  {
                    icon: Ruler,
                    t: "S'adapte à tous vos pinceaux",
                    d: "3 colliers en silicone multi-tailles fournis.",
                  },
                ].map((a) => (
                  <div
                    key={a.t}
                    className="flex items-start gap-3 p-4 rounded-2xl border border-border"
                  >
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-accent/40 flex items-center justify-center">
                      <a.icon className="h-5 w-5 text-rose-gold" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{a.t}</div>
                      <div className="text-sm text-muted-foreground">{a.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-cream rounded-3xl p-6 border border-border space-y-4">
                <h3 className="font-semibold text-lg">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Sous-total ({quantity} article{quantity > 1 ? "s" : ""})
                    </span>
                    <span>{cad.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-rose-gold font-medium">Offerte</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-baseline">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-semibold">{cad.format(subtotal)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => startCheckout(PRODUCT_ID, quantity)}
                  disabled={isLoading}
                  className="group flex items-center justify-center gap-3 w-full gradient-rose text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Lock className="h-5 w-5" />
                  {isLoading ? "Redirection…" : "Passer au paiement"}
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
