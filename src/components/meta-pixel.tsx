import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Charge le pixel Meta UNIQUEMENT après consentement explicite (Loi 25).
 * Tant que `status !== "granted"`, aucun script n'est injecté et rien n'est
 * envoyé à Meta. Une fois accordé, le snippet de base est injecté une seule
 * fois, puis un événement `PageView` est envoyé.
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  const { status } = useConsent();
  const loaded = useRef(false);

  useEffect(() => {
    // SSR-safe : on ne touche à `window` que côté client.
    if (typeof window === "undefined") return;
    if (status !== "granted" || !pixelId || loaded.current) return;
    loaded.current = true;

    // Snippet de base Meta Pixel (fbevents.js).
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    // Désactive autoConfig AVANT l'init : sinon Meta instrumente les clics et
    // requêtes de la page, ce qui perturbe la requête d'auth de Better Auth
    // (échec "403 Invalid origin" au login après consentement).
    window.fbq?.("set", "autoConfig", false, pixelId);
    window.fbq?.("init", pixelId);
    window.fbq?.("track", "PageView");
  }, [status, pixelId]);

  // Aucun rendu : le pixel n'a pas d'UI. Sans consentement → aucun script.
  if (status !== "granted") return null;
  return null;
}
