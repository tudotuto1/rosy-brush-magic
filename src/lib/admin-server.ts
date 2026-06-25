import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { orders, reviews } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import type { AppEnv } from "@/lib/env";

/**
 * Vérifie que la requête entrante est portée par une session connectée
 * dont l'email matche (en minuscules, trimmé) la valeur du secret ADMIN_EMAIL.
 * Retourne l'email admin si OK, sinon `null` — ne throw jamais ici pour
 * laisser les server fns choisir leur politique de réponse.
 */
async function getAdminEmailOrNull(): Promise<string | null> {
  const headers = new Headers(getRequestHeaders() as Record<string, string>);
  const session = await createAuth().api.getSession({ headers });
  const admin = (env as unknown as AppEnv).ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = session?.user?.email?.trim().toLowerCase();
  return userEmail && admin && userEmail === admin ? userEmail : null;
}

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const email = await getAdminEmailOrNull();
  return email ? { email } : null;
});

export const getAllOrders = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await getAdminEmailOrNull())) throw new Error("UNAUTHORIZED");
  return await getDb().select().from(orders).orderBy(desc(orders.createdAt));
});

export const getPendingReviews = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await getAdminEmailOrNull())) throw new Error("UNAUTHORIZED");
  const rows = await getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.status, "pending"))
    .orderBy(desc(reviews.createdAt));
  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    photoKeys: JSON.parse(r.photoKeys) as string[],
    email: r.email,
    createdAt: r.createdAt,
  }));
});

export const moderateReview = createServerFn({ method: "POST" })
  .inputValidator((d: { reviewId: string; action: "approve" | "reject" }) => {
    if (!d.reviewId) throw new Error("reviewId requis");
    if (d.action !== "approve" && d.action !== "reject") throw new Error("action invalide");
    return d;
  })
  .handler(async ({ data }) => {
    if (!(await getAdminEmailOrNull())) throw new Error("UNAUTHORIZED");
    const db = getDb();

    // En reject : on supprime les photos R2 pour ne pas laisser orphelines.
    if (data.action === "reject") {
      const rows = await db.select().from(reviews).where(eq(reviews.id, data.reviewId)).limit(1);
      const keys = rows[0] ? (JSON.parse(rows[0].photoKeys) as string[]) : [];
      for (const key of keys) {
        try {
          await (env as unknown as AppEnv).PHOTOS.delete(key);
        } catch (error) {
          // Best effort — un échec de delete R2 ne doit pas bloquer la modération.
          console.error("[admin] PHOTOS.delete failed for", key, error);
        }
      }
    }

    await db
      .update(reviews)
      .set({
        status: data.action === "approve" ? "approved" : "rejected",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(reviews.id, data.reviewId));

    return { ok: true };
  });

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildTrackingEmail({
  carrier,
  trackingNumber,
  trackingStatus,
  appUrl,
}: {
  carrier: string;
  trackingNumber: string;
  trackingStatus: string;
  appUrl: string;
}): string {
  const carrierLabel = carrier ? escapeHtml(carrier) : "notre transporteur";
  const statusLine = trackingStatus
    ? `<p>Statut actuel : <strong>${escapeHtml(trackingStatus)}</strong></p>`
    : "";
  return `
    <p>Bonjour,</p>
    <p>Bonne nouvelle : ta commande Kinetis Brush vient d'être expédiée 📦</p>
    <p>
      Transporteur : <strong>${carrierLabel}</strong><br/>
      Numéro de suivi : <strong style="font-family:monospace">${escapeHtml(trackingNumber)}</strong>
    </p>
    ${statusLine}
    <p>Tu peux retrouver le détail de ta commande à tout moment sur ton espace client :</p>
    <p><a href="${escapeHtml(appUrl)}/compte">Voir ma commande</a></p>
    <p>Merci pour ta confiance,<br/>L'équipe Kinetis Brush</p>
  `;
}

export const updateOrderTracking = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      orderId: string;
      carrier: string;
      trackingNumber: string;
      trackingStatus: string;
      notify?: boolean;
    }) => {
      if (!d.orderId) throw new Error("orderId requis");
      return {
        orderId: d.orderId,
        carrier: (d.carrier ?? "").slice(0, 100),
        trackingNumber: (d.trackingNumber ?? "").slice(0, 200),
        trackingStatus: (d.trackingStatus ?? "").slice(0, 100),
        notify: d.notify ?? false,
      };
    },
  )
  .handler(async ({ data }) => {
    if (!(await getAdminEmailOrNull())) throw new Error("UNAUTHORIZED");

    const db = getDb();

    // On lit d'abord la commande pour récupérer l'email destinataire fiable
    // (le client admin ne l'envoie jamais — défense en profondeur).
    const [existing] = await db.select().from(orders).where(eq(orders.id, data.orderId)).limit(1);
    if (!existing) throw new Error("Commande introuvable");

    await db
      .update(orders)
      .set({
        carrier: data.carrier || null,
        trackingNumber: data.trackingNumber || null,
        trackingStatus: data.trackingStatus || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, data.orderId));

    let emailSent = false;
    if (data.notify && data.trackingNumber && existing.email) {
      try {
        await sendEmail({
          to: existing.email,
          subject: "📦 Ta commande Kinetis Brush est en route",
          html: buildTrackingEmail({
            carrier: data.carrier,
            trackingNumber: data.trackingNumber,
            trackingStatus: data.trackingStatus,
            appUrl: (env as unknown as AppEnv).PUBLIC_APP_URL,
          }),
        });
        emailSent = true;
      } catch (error) {
        // Un échec d'email ne doit JAMAIS faire échouer la sauvegarde du suivi.
        console.error("[admin] email Resend failed (suivi déjà persisté):", error);
      }
    }

    return { ok: true, emailSent };
  });
