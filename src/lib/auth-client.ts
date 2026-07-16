import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * Référence NATIVE de `fetch`, capturée au chargement du module (au démarrage
 * de l'app), donc AVANT que le pixel Meta (fbevents.js) ne remplace le fetch
 * global — ce qui n'arrive qu'après l'action de consentement.
 *
 * Better Auth s'appuie sur better-fetch, qui utilise le fetch global : sans
 * cette capture, la requête de login (magic link) passerait par le fetch
 * instrumenté par le pixel et échouerait. On la force donc à utiliser le
 * fetch natif via `customFetchImpl`. Le pixel continue de tracker le reste.
 */
const nativeFetch =
  typeof window !== "undefined" && typeof window.fetch === "function"
    ? window.fetch.bind(window)
    : undefined;

export const authClient = createAuthClient({
  plugins: [magicLinkClient()],
  ...(nativeFetch ? { fetchOptions: { customFetchImpl: nativeFetch as typeof fetch } } : {}),
});
