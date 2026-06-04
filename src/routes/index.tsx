import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
  Star,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Frown,
  Droplets,
  Power,
  Wind,
  Ruler,
  Heart,
  Usb,
  Lock,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import productHero from "@/assets/product-hero.jpeg";
import productMain from "@/assets/product-main.jpeg";
import productLifestyle from "@/assets/product-lifestyle.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCheckout } from "@/hooks/use-checkout";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={shown ? "animate-fade-in-up" : "opacity-0"}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 text-rose-gold" style={{ fill: "currentColor" }} />
      ))}
    </div>
  );
}

function Index() {
  const { startCheckout, isLoading, error } = useCheckout();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (window.location.search.includes("canceled=true")) {
      toast.info("Paiement annulé. Vous pouvez réessayer.");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* A. Top bar */}
      <div className="gradient-rose text-white text-center text-xs sm:text-sm py-2.5 px-4 font-medium tracking-wide">
        Livraison gratuite aujourd'hui <span aria-hidden>🚚</span> · Garantie 30 jours satisfait ou
        remboursé
      </div>

      {/* B. Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </a>
          <button
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Panier"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-gold text-[10px] text-white flex items-center justify-center font-semibold">
              1
            </span>
          </button>
        </div>
      </header>

      {/* C. Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-rose-gold" /> Nouveauté beauté virale
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-medium">
                Une peau parfaite commence par des{" "}
                <em className="text-rose-gold not-italic">pinceaux propres.</em>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Nettoyez et séchez vos pinceaux de maquillage en moins de 30 secondes. Éliminez 99%
                des bactéries causant l'acné.
              </p>
              <div className="flex items-center gap-3">
                <Stars />
                <span className="text-sm text-muted-foreground">
                  Recommandé par <strong className="text-foreground">+10 000</strong> passionnées de
                  beauté
                </span>
              </div>
              <a
                href="#buy"
                className="group inline-flex items-center gap-3 gradient-rose text-white px-7 py-4 rounded-2xl font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Obtenir mon nettoyeur maintenant
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex flex-wrap gap-6 pt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-rose-gold" /> Livraison offerte
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-rose-gold" /> Garantie 30 jours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-rose-gold" /> Paiement sécurisé
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-accent/40 via-transparent to-transparent rounded-full blur-3xl" />
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream shadow-md">
                <img
                  src={productHero}
                  alt="Kinetis Brush nettoyeur de pinceaux électrique sur une coiffeuse"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-background rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-border">
                <div className="h-10 w-10 rounded-full gradient-rose flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Propres en</div>
                  <div className="font-semibold text-sm">30 secondes</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* D. Problème vs Solution */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
                Ne laissez plus vos pinceaux{" "}
                <em className="text-rose-gold not-italic">gâcher votre peau.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertCircle,
                title: "Le problème",
                text: "Les pinceaux sales accumulent sébum, poussière et bactéries au fil des jours.",
              },
              {
                icon: Frown,
                title: "La conséquence",
                text: "Responsables de l'acné, des rougeurs et des pores obstrués sur votre peau.",
              },
              {
                icon: Sparkles,
                title: "La solution",
                text: "Notre technologie rotative élimine 99% des impuretés en moins de 30 secondes.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div className="h-full bg-background rounded-3xl p-8 border border-border hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-2xl bg-accent/40 flex items-center justify-center mb-5">
                    <c.icon className="h-6 w-6 text-rose-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* E. How it works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-gold mb-3 font-semibold">
                Comment ça marche
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
                Propre et sec en 3 étapes
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-6">
            {[
              {
                n: "01",
                icon: Droplets,
                title: "Ajoutez",
                text: "Versez de l'eau tiède et une goutte de savon doux dans le bol.",
              },
              {
                n: "02",
                icon: Power,
                title: "Activez",
                text: "Plongez le pinceau dans le collier silicone et lancez la rotation.",
              },
              {
                n: "03",
                icon: Wind,
                title: "Séchez",
                text: "Retirez de l'eau et faites tourner pour un séchage instantané.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <span className="font-display text-7xl lg:text-8xl text-accent/60 leading-none">
                      {s.n}
                    </span>
                    <s.icon className="absolute -bottom-2 -right-2 h-7 w-7 text-rose-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* F. Features (zigzag) */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-20 lg:space-y-28">
          {[
            {
              icon: Ruler,
              title: "S'adapte à tous vos pinceaux",
              text: "Trois colliers en silicone multi-tailles épousent parfaitement chaque manche, du pinceau eyeliner au kabuki.",
              img: productMain,
              reverse: false,
            },
            {
              icon: Heart,
              title: "Préserve la douceur des poils",
              text: "La rotation douce nettoie en profondeur sans abîmer les fibres délicates de vos pinceaux les plus précieux.",
              img: productLifestyle,
              reverse: true,
            },
            {
              icon: Usb,
              title: "Rechargeable via USB-C",
              text: "Une batterie longue durée pour des semaines d'utilisation. Compact, sans fil, pensé pour votre coiffeuse.",
              img: productHero,
              reverse: false,
            },
          ].map((f, i) => (
            <Reveal key={f.title}>
              <div
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${f.reverse ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div>
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-background shadow-md">
                    <img src={f.img} alt={f.title} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="h-12 w-12 rounded-2xl bg-accent/40 flex items-center justify-center">
                    <f.icon className="h-6 w-6 text-rose-gold" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-medium leading-tight">{f.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* G. Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-gold mb-3 font-semibold">
                Témoignages
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
                Elles ont transformé leur routine
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sophie M.",
                text: "Incroyable, mes pinceaux sèchent instantanément et je n'ai plus de boutons depuis que je l'utilise. Un must-have.",
              },
              {
                name: "Camille L.",
                text: "Je détestais nettoyer mes pinceaux à la main. En 30 secondes c'est fait, ils sont comme neufs. Je recommande !",
              },
              {
                name: "Léa B.",
                text: "Le design est sublime sur ma coiffeuse et le résultat est bluffant. Ma peau me dit merci chaque matin.",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="h-full bg-cream rounded-3xl p-8 border border-border">
                  <Stars className="mb-4" />
                  <p className="text-foreground leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-rose flex items-center justify-center text-white font-semibold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">Cliente vérifiée</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* H. Buy box */}
      <section id="buy" className="bg-cream py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center bg-background rounded-[2rem] p-6 sm:p-10 lg:p-14 shadow-md border border-border">
            <Reveal>
              <div className="aspect-square rounded-3xl overflow-hidden bg-cream">
                <img
                  src={productMain}
                  alt="Kinetis Brush — offre du jour"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-gold text-white text-xs font-semibold">
                  -50% Aujourd'hui
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
                  Kinetis Brush
                </h2>
                <div className="flex items-center gap-3">
                  <Stars />
                  <span className="text-sm text-muted-foreground">2 187 avis</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-semibold">29,90€</span>
                  <span className="text-lg text-muted-foreground line-through">59,90€</span>
                  <span className="text-sm font-semibold text-rose-gold">Économisez 30€</span>
                </div>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-gold" />
                  Stock limité — forte demande suite à sa viralité sur TikTok
                </p>
                <button
                  type="button"
                  onClick={() => startCheckout("kinetis-brush")}
                  disabled={isLoading}
                  className="group flex items-center justify-center gap-3 w-full gradient-rose text-white px-7 py-5 rounded-2xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isLoading ? "Redirection…" : "Ajouter au panier — 29,90€"}
                </button>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Paiement sécurisé
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Visa · Mastercard · PayPal
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Garantie 30 jours
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* I. FAQ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-gold mb-3 font-semibold">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
                Vos questions, nos réponses
              </h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {[
              {
                q: "Quels types de savons puis-je utiliser ?",
                a: "Un savon doux (savon de Marseille liquide, shampoing bébé ou nettoyant pinceaux dédié) avec de l'eau tiède suffit largement.",
              },
              {
                q: "Combien de temps dure la batterie ?",
                a: "La batterie offre jusqu'à 90 nettoyages complets sur une seule charge USB-C, soit plusieurs semaines d'utilisation.",
              },
              {
                q: "S'adapte-t-il à tous les pinceaux ?",
                a: "Oui — 3 colliers en silicone de tailles différentes sont fournis, compatibles avec pratiquement tous les pinceaux du marché.",
              },
              {
                q: "Quand vais-je recevoir ma commande ?",
                a: "Livraison gratuite en 3 à 5 jours ouvrés partout en France métropolitaine, avec suivi du colis par e-mail.",
              },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-2xl px-6 bg-cream"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* J. Footer */}
      <footer className="bg-foreground text-background/80 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div>
                <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
              </div>
              <p className="text-sm mt-2 max-w-xs">
                La beauté commence par des outils impeccables.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {["Contact", "Politique de confidentialité", "CGV", "Retours"].map((l) => (
                <a key={l} href="#" className="hover:text-background transition-colors">
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-10 pt-6 border-t border-background/10 text-xs text-background/50 flex flex-col sm:flex-row justify-between gap-3">
            <span>© {new Date().getFullYear()} Kinetis Brush. Tous droits réservés.</span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" /> Paiement 100% sécurisé
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
