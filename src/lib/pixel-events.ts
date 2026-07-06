/**
 * Envoie un événement au pixel Meta si (et seulement si) `window.fbq` existe —
 * c'est-à-dire si l'internaute a consenti (voir meta-pixel.tsx). Sans
 * consentement, le pixel n'est jamais chargé et cette fonction ne fait rien.
 */
export function trackPixelEvent(name: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("track", name, params ?? {}, { eventID: eventId });
  } else {
    window.fbq("track", name, params ?? {});
  }
}
