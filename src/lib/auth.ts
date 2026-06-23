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
  return betterAuth({
    database: appEnv.DB,
    baseURL: appEnv.PUBLIC_APP_URL,
    secret: appEnv.BETTER_AUTH_SECRET,
    trustedOrigins: [appEnv.PUBLIC_APP_URL],
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
