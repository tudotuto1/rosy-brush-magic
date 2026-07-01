import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

type Dict = Record<string, string>;

const fr: Dict = {
  "topbar.before": "Livraison offerte",
  "topbar.after": "· Garantie 30 jours satisfait ou remboursé",
  "header.account": "Mon compte",
  "header.cart": "Panier",

  "hero.badge": "Nouveauté beauté",
  "hero.title.lead": "Une peau parfaite commence par des",
  "hero.title.highlight": "pinceaux propres.",
  "hero.subtitle":
    "Nettoyez et séchez vos pinceaux de maquillage en moins de 30 secondes. Fini le sébum, la poussière et les résidus accumulés au fil des jours.",
  "hero.cta": "Obtenir mon nettoyeur maintenant",
  "hero.bullet.shipping": "Livraison offerte",
  "hero.bullet.guarantee": "Garantie 30 jours",
  "hero.bullet.payment": "Paiement sécurisé",
  "hero.image.alt":
    "Avant / après : pinceau sale et terne à gauche, propre et comme neuf dans le Kinetis Brush à droite",
  "hero.image.label": "Propres en",
  "hero.image.value": "30 secondes",

  "problem.title.lead": "Ne laissez plus vos pinceaux",
  "problem.title.highlight": "gâcher votre peau.",
  "problem.card1.title": "Le problème",
  "problem.card1.text":
    "Les pinceaux sales accumulent sébum, poussière et bactéries au fil des jours.",
  "problem.card2.title": "La conséquence",
  "problem.card2.text":
    "Responsables de l'acné, des rougeurs et des pores obstrués sur votre peau.",
  "problem.card3.title": "La solution",
  "problem.card3.text":
    "Notre technologie rotative élimine les impuretés en profondeur en moins de 30 secondes.",
  "problem.image.alt":
    "Gros plan d'un visage aux joues rouges et irritées, avec un pinceau sale appliqué sur la peau",
  "problem.image.caption":
    "Un pinceau sale dépose bactéries et sébum directement sur votre peau — une cause fréquente d'acné et de rougeurs.",

  "how.eyebrow": "Comment ça marche",
  "how.title": "Propre et sec en 3 étapes",
  "how.step1.title": "Ajoutez",
  "how.step1.text": "Versez de l'eau tiède et une goutte de savon doux dans le bol.",
  "how.step2.title": "Activez",
  "how.step2.text": "Plongez le pinceau dans le collier silicone et lancez la rotation.",
  "how.step3.title": "Séchez",
  "how.step3.text": "Retirez de l'eau et faites tourner pour un séchage instantané.",

  "features.adapt.title": "S'adapte à tous vos pinceaux",
  "features.adapt.text":
    "Trois colliers en silicone multi-tailles épousent parfaitement chaque manche, du pinceau eyeliner au kabuki.",
  "features.gentle.title": "Préserve la douceur des poils",
  "features.gentle.text":
    "La rotation douce nettoie en profondeur sans abîmer les fibres délicates de vos pinceaux les plus précieux.",
  "features.usb.title": "Rechargeable via USB-C",
  "features.usb.text":
    "Une batterie longue durée pour des semaines d'utilisation. Compact, sans fil, pensé pour votre coiffeuse.",

  "buy.image.alt": "Kinetis Brush — offre du jour",
  "buy.price.value": "45,99 $",
  "buy.price.currency": "CAD",
  "buy.cta": "Ajouter au panier — 45,99 $",
  "buy.bullet.secure": "Paiement sécurisé",
  "buy.bullet.methods": "Visa · Mastercard · Apple Pay",
  "buy.bullet.guarantee": "Garantie 30 jours",

  "faq.eyebrow": "FAQ",
  "faq.title": "Vos questions, nos réponses",
  "faq.q1.q": "Quels types de savons puis-je utiliser ?",
  "faq.q1.a":
    "Un savon doux (savon de Marseille liquide, shampoing bébé ou nettoyant pinceaux dédié) avec de l'eau tiède suffit largement.",
  "faq.q2.q": "Combien de temps dure la batterie ?",
  "faq.q2.a":
    "La batterie offre jusqu'à 90 nettoyages complets sur une seule charge USB-C, soit plusieurs semaines d'utilisation.",
  "faq.q3.q": "S'adapte-t-il à tous les pinceaux ?",
  "faq.q3.a":
    "Oui — 3 colliers en silicone de tailles différentes sont fournis, compatibles avec pratiquement tous les pinceaux du marché.",
  "faq.q4.q": "Quand vais-je recevoir ma commande ?",
  "faq.q4.a":
    "Vos commandes sont préparées et expédiées par nos partenaires fournisseurs. Délai de livraison estimé : 5 à 8 jours ouvrés au Canada, avec suivi du colis par e-mail.",

  "transparency.badge": "Expédition & transparence",
  "transparency.before":
    "Kinetis Brush travaille avec des partenaires fournisseurs sélectionnés qui préparent et expédient vos commandes. Délai de livraison estimé :",
  "transparency.strong": "5 à 8 jours ouvrés",
  "transparency.after":
    "au Canada. Vous recevez un numéro de suivi par e-mail dès l'expédition, et notre garantie 30 jours satisfait ou remboursé s'applique à chaque commande.",

  "footer.tagline": "La beauté commence par des outils impeccables.",
  "footer.contact": "Contact",
  "footer.privacy": "Politique de confidentialité",
  "footer.cgv": "CGV",
  "footer.returns": "Retours",
  "footer.copyright": "© {year} Kinetis Brush. Tous droits réservés.",
  "footer.secure": "Paiement 100% sécurisé",

  "toast.canceled": "Paiement annulé. Vous pouvez réessayer.",
};

const en: Dict = {
  "topbar.before": "Free shipping",
  "topbar.after": "· 30-day money-back guarantee",
  "header.account": "My account",
  "header.cart": "Cart",

  "hero.badge": "New beauty pick",
  "hero.title.lead": "Flawless skin starts with",
  "hero.title.highlight": "clean brushes.",
  "hero.subtitle":
    "Clean and dry your makeup brushes in under 30 seconds. Say goodbye to oil, dust and buildup from daily use.",
  "hero.cta": "Get my cleaner now",
  "hero.bullet.shipping": "Free shipping",
  "hero.bullet.guarantee": "30-day guarantee",
  "hero.bullet.payment": "Secure payment",
  "hero.image.alt":
    "Before / after: a dirty, dull brush on the left, clean and like-new inside the Kinetis Brush on the right",
  "hero.image.label": "Clean in",
  "hero.image.value": "30 seconds",

  "problem.title.lead": "Don't let your brushes",
  "problem.title.highlight": "ruin your skin.",
  "problem.card1.title": "The problem",
  "problem.card1.text": "Dirty brushes build up oil, dust and bacteria day after day.",
  "problem.card2.title": "The consequence",
  "problem.card2.text": "They trigger breakouts, redness and clogged pores on your skin.",
  "problem.card3.title": "The solution",
  "problem.card3.text": "Our rotary technology deep-cleans every impurity in under 30 seconds.",
  "problem.image.alt":
    "Close-up of a face with red, irritated cheeks while a dirty brush is applied to the skin",
  "problem.image.caption":
    "A dirty brush deposits bacteria and oil straight onto your skin — a common cause of breakouts and redness.",

  "how.eyebrow": "How it works",
  "how.title": "Clean and dry in 3 steps",
  "how.step1.title": "Add",
  "how.step1.text": "Pour warm water and a drop of mild soap into the bowl.",
  "how.step2.title": "Spin",
  "how.step2.text": "Slip the brush into the silicone collar and start the rotation.",
  "how.step3.title": "Dry",
  "how.step3.text": "Lift out of the water and spin again for instant drying.",

  "features.adapt.title": "Fits every brush you own",
  "features.adapt.text":
    "Three multi-size silicone collars wrap every handle perfectly, from eyeliner brushes to kabuki.",
  "features.gentle.title": "Gentle on bristles",
  "features.gentle.text":
    "The soft rotation deep-cleans without damaging the delicate fibres of your most prized brushes.",
  "features.usb.title": "USB-C rechargeable",
  "features.usb.text":
    "A long-lasting battery for weeks of use. Compact, cordless, designed to live on your vanity.",

  "buy.image.alt": "Kinetis Brush — today's offer",
  "buy.price.value": "$45.99",
  "buy.price.currency": "CAD",
  "buy.cta": "Add to cart — $45.99 CAD",
  "buy.bullet.secure": "Secure payment",
  "buy.bullet.methods": "Visa · Mastercard · Apple Pay",
  "buy.bullet.guarantee": "30-day guarantee",

  "faq.eyebrow": "FAQ",
  "faq.title": "Your questions, our answers",
  "faq.q1.q": "Which soaps can I use?",
  "faq.q1.a":
    "A mild soap (liquid Marseille soap, baby shampoo or a dedicated brush cleanser) with warm water is plenty.",
  "faq.q2.q": "How long does the battery last?",
  "faq.q2.a":
    "The battery delivers up to 90 full cleanings per USB-C charge — several weeks of use.",
  "faq.q3.q": "Does it fit every brush?",
  "faq.q3.a":
    "Yes — 3 silicone collars in different sizes are included, compatible with virtually any brush on the market.",
  "faq.q4.q": "When will I receive my order?",
  "faq.q4.a":
    "Your orders are prepared and shipped by our fulfillment partners. Estimated delivery: 5 to 8 business days in Canada, with email tracking.",

  "transparency.badge": "Shipping & transparency",
  "transparency.before":
    "Kinetis Brush works with selected fulfillment partners who prepare and ship your orders. Estimated delivery time:",
  "transparency.strong": "5 to 8 business days",
  "transparency.after":
    "in Canada. You receive a tracking number by email as soon as it ships, and our 30-day satisfaction guarantee applies to every order.",

  "footer.tagline": "Beauty starts with impeccable tools.",
  "footer.contact": "Contact",
  "footer.privacy": "Privacy policy",
  "footer.cgv": "Terms of sale",
  "footer.returns": "Returns",
  "footer.copyright": "© {year} Kinetis Brush. All rights reserved.",
  "footer.secure": "100% secure payment",

  "toast.canceled": "Payment cancelled. You can try again.",
};

export const translations: Record<Lang, Dict> = { fr, en };

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  const t = useCallback(
    (key: string): string => translations[lang][key] ?? translations.fr[key] ?? key,
    [lang],
  );

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
