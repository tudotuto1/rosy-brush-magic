import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "cloudflare:workers";
import type { AppEnv } from "@/lib/env";

/**
 * Better Auth instance — créée PAR REQUÊTE.
 * Le binding D1 (`env.DB`) et les secrets sont liés à la requête Worker en cours,
 * donc on ne peut pas conserver un singleton entre requêtes.
 */
export function createAuth() {
  const appEnv = env as unknown as AppEnv;

  // Better Auth valide l'en-tête `Origin` contre `trustedOrigins` (403
  // "Invalid origin" sinon). Le site est joignable à la fois sur l'apex et sur
  // `www.` (Safari masque « www. » dans la barre d'adresse, ce qui rend le
  // problème invisible), donc on fait confiance aux deux, dérivés de
  // PUBLIC_APP_URL quelle que soit la variante configurée.
  const appUrl = new URL(appEnv.PUBLIC_APP_URL);
  const bareHost = appUrl.host.replace(/^www\./, "");
  const trustedOrigins = [`${appUrl.protocol}//${bareHost}`, `${appUrl.protocol}//www.${bareHost}`];

  return betterAuth({
    database: appEnv.DB,
    baseURL: appEnv.PUBLIC_APP_URL,
    secret: appEnv.BETTER_AUTH_SECRET,
    trustedOrigins,
    // Better Auth tourne derrière le proxy Cloudflare. Depuis la 1.4.3, il ne
    // fait plus confiance par défaut aux en-têtes X-Forwarded-* et infère alors
    // une mauvaise origine quand l'en-tête `Origin` est absent (ce que le pixel
    // Meta provoque) → 403 "Invalid origin". On réactive la confiance au proxy.
    advanced: { trustedProxyHeaders: true },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${appEnv.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Kinetis Brush <connexion@kinetisbrush.com>",
              to: email,
              subject: "Ta connexion à Kinetis Brush",
              html: `<p>Bonjour,</p><p>Clique pour te connecter :</p><p><a href="${url}">Se connecter à Kinetis Brush</a></p><p>Ce lien expire dans quelques minutes. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>`,
            }),
          });
          if (!res.ok) throw new Error(`Resend a échoué: ${res.status}`);
        },
      }),
      // DOIT rester le dernier plugin (intercepte les hooks de tous les autres).
      tanstackStartCookies(),
    ],
  });
}
