import { env } from "cloudflare:workers";
import type { AppEnv } from "@/lib/env";

/**
 * Envoi transactionnel via Resend.
 * Domaine `kinetisbrush.com` vérifié, expéditeur `commandes@kinetisbrush.com`.
 * Throw si Resend ne renvoie pas 2xx — l'appelant choisit d'isoler ou non
 * l'erreur (ex. ne pas faire échouer une sauvegarde si l'email rate).
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${(env as unknown as AppEnv).RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Kinetis Brush <commandes@kinetisbrush.com>",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend a échoué: ${res.status}`);
}
