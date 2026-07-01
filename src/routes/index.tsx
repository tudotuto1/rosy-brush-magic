import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
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
  User,
} from "lucide-react";
import productHero from "@/assets/product-hero.jpeg";
import productMain from "@/assets/product-main.jpeg";
import productLifestyle from "@/assets/product-lifestyle.png";
import beforeAfter from "@/assets/before-after.png";
import consequencesSkin from "@/assets/consequences-skin.png";
import solutionBrush from "@/assets/solution-brush.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { ReviewsSection } from "@/components/reviews-section";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/i18n";
import { getApprovedReviews } from "@/lib/reviews-server";

export const Route = createFileRoute("/")({
  loader: async () => ({
    reviews: await getApprovedReviews({ data: { productId: "kinetis-brush" } }),
  }),
  component: Index,
});

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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
      className={`${shown ? "animate-fade-in-up" : "opacity-0"} ${className}`.trim()}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Index() {
  const { quantity, addToCart, mounted } = useCart();
  const navigate = useNavigate();
  const { reviews } = Route.useLoaderData();
  const { t } = useLang();

  useEffect(() => {
    if (window.location.search.includes("canceled=true")) {
      toast.info(t("toast.canceled"));
      window.history.replaceState({}, "", "/");
    }
    // Mount-only check — `t` may change identity later but the URL state
    // is only meaningful on the very first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddToCart() {
    addToCart(1);
    navigate({ to: "/panier" });
  }

  const problemCards = [
    { icon: AlertCircle, title: t("problem.card1.title"), text: t("problem.card1.text") },
    { icon: Frown, title: t("problem.card2.title"), text: t("problem.card2.text") },
    { icon: Sparkles, title: t("problem.card3.title"), text: t("problem.card3.text") },
  ];
  const howSteps = [
    { n: "01", icon: Droplets, title: t("how.step1.title"), text: t("how.step1.text") },
    { n: "02", icon: Power, title: t("how.step2.title"), text: t("how.step2.text") },
    { n: "03", icon: Wind, title: t("how.step3.title"), text: t("how.step3.text") },
  ];
  const features = [
    {
      icon: Ruler,
      title: t("features.adapt.title"),
      text: t("features.adapt.text"),
      img: productMain,
      reverse: false,
    },
    {
      icon: Heart,
      title: t("features.gentle.title"),
      text: t("features.gentle.text"),
      img: productLifestyle,
      reverse: true,
    },
    {
      icon: Usb,
      title: t("features.usb.title"),
      text: t("features.usb.text"),
      img: productHero,
      reverse: false,
    },
  ];
  const faqItems = [
    { q: t("faq.q1.q"), a: t("faq.q1.a") },
    { q: t("faq.q2.q"), a: t("faq.q2.a") },
    { q: t("faq.q3.q"), a: t("faq.q3.a") },
    { q: t("faq.q4.q"), a: t("faq.q4.a") },
  ];
  const copyright = t("footer.copyright").replace("{year}", String(new Date().getFullYear()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* A. Top bar */}
      <div className="gradient-rose text-white text-center text-xs sm:text-sm py-2.5 px-4 font-medium tracking-wide">
        {t("topbar.before")} <span aria-hidden>🚚</span> {t("topbar.after")}
      </div>

      {/* B. Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link
              to="/compte"
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={t("header.account")}
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/panier"
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={t("header.cart")}
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && quantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-gold text-[10px] text-white flex items-center justify-center font-semibold">
                  {quantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* C. Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-rose-gold" /> {t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-medium">
                {t("hero.title.lead")}{" "}
                <em className="text-rose-gold not-italic">{t("hero.title.highlight")}</em>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <a
                href="#buy"
                className="group inline-flex items-center gap-3 gradient-rose text-white px-7 py-4 rounded-2xl font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                {t("hero.cta")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex flex-wrap gap-6 pt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-rose-gold" /> {t("hero.bullet.shipping")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-rose-gold" /> {t("hero.bullet.guarantee")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-rose-gold" /> {t("hero.bullet.payment")}
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-accent/40 via-transparent to-transparent rounded-full blur-3xl" />
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-cream shadow-md">
                <img
                  src={beforeAfter}
                  alt={t("hero.image.alt")}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-background rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-border">
                <div className="h-10 w-10 rounded-full gradient-rose flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("hero.image.label")}</div>
                  <div className="font-semibold text-sm">{t("hero.image.value")}</div>
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
                {t("problem.title.lead")}{" "}
                <em className="text-rose-gold not-italic">{t("problem.title.highlight")}</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 grid-flow-row-dense">
            {problemCards.map((c, i) => (
              <Fragment key={c.title}>
                <Reveal delay={i * 100}>
                  <div className="h-full bg-background rounded-3xl p-8 border border-border hover:shadow-md transition-shadow">
                    <div className="h-12 w-12 rounded-2xl bg-accent/40 flex items-center justify-center mb-5">
                      <c.icon className="h-6 w-6 text-rose-gold" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{c.text}</p>
                  </div>
                </Reveal>

                {/* Illustration des conséquences (acné, rougeurs), juste sous la
                    carte « La conséquence » en mobile ; pleine largeur en desktop. */}
                {i === 1 && (
                  <Reveal delay={150} className="md:col-span-3">
                    <figure className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md">
                      <img
                        src={consequencesSkin}
                        alt={t("problem.image.alt")}
                        className="h-full w-full object-cover"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 sm:p-8">
                        <p className="text-white text-sm sm:text-base font-medium max-w-xl">
                          {t("problem.image.caption")}
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>
                )}

                {/* Illustration de la solution (avant / après), juste sous la
                    carte « La solution » en mobile ; pleine largeur en desktop. */}
                {i === 2 && (
                  <Reveal delay={150} className="md:col-span-3">
                    <figure className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md">
                      <img
                        src={solutionBrush}
                        alt={t("solution.image.alt")}
                        className="h-full w-full object-cover"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 sm:p-8">
                        <p className="text-white text-sm sm:text-base font-medium max-w-xl">
                          {t("solution.image.caption")}
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>
                )}
              </Fragment>
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
                {t("how.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">{t("how.title")}</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-6">
            {howSteps.map((s, i) => (
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
          {features.map((f) => (
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

      {/* H. Buy box */}
      <section id="buy" className="bg-cream py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center bg-background rounded-[2rem] p-6 sm:p-10 lg:p-14 shadow-md border border-border">
            <Reveal>
              <div className="aspect-square rounded-3xl overflow-hidden bg-cream">
                <img
                  src={productMain}
                  alt={t("buy.image.alt")}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
                  Kinetis Brush
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold">{t("buy.price.value")}</span>
                  <span className="text-sm text-muted-foreground">{t("buy.price.currency")}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="group flex items-center justify-center gap-3 w-full gradient-rose text-white px-7 py-5 rounded-2xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {t("buy.cta")}
                </button>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> {t("buy.bullet.secure")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> {t("buy.bullet.methods")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t("buy.bullet.guarantee")}
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
                {t("faq.eyebrow")}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">{t("faq.title")}</h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((item, i) => (
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

      <ReviewsSection reviews={reviews} />

      {/* I-bis. Transparence & expédition */}
      <section className="bg-cream py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-xs font-medium text-muted-foreground border border-border">
                <Truck className="h-3.5 w-3.5 text-rose-gold" /> {t("transparency.badge")}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("transparency.before")}{" "}
                <strong className="text-foreground">{t("transparency.strong")}</strong>{" "}
                {t("transparency.after")}
              </p>
            </div>
          </Reveal>
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
              <p className="text-sm mt-2 max-w-xs">{t("footer.tagline")}</p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <a
                href="mailto:kinetisbrush@gmail.com"
                className="hover:text-background transition-colors"
              >
                {t("footer.contact")}
              </a>
              <Link to="/confidentialite" className="hover:text-background transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link to="/cgv" className="hover:text-background transition-colors">
                {t("footer.cgv")}
              </Link>
              <Link to="/retours" className="hover:text-background transition-colors">
                {t("footer.returns")}
              </Link>
            </nav>
          </div>
          <div className="mt-10 pt-6 border-t border-background/10 text-xs text-background/50 flex flex-col sm:flex-row justify-between gap-3">
            <span>{copyright}</span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" /> {t("footer.secure")}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
