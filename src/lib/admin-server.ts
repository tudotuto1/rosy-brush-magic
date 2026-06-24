import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import type { AppEnv } from "@/lib/env";

/**
 * Vérifie que la requête entrante est portée par une session connectée
 * dont l'email matche (en minuscules) la valeur du secret ADMIN_EMAIL.
 * Retourne l'email admin si OK, sinon `null` — ne throw jamais ici pour
 * laisser les server fns choisir leur politique de réponse.
 */
async function getAdminEmailOrNull(): Promise<string | null> {
  const headers = new Headers(getRequestHeaders() as Record<string, string>);
  const session = await createAuth().api.getSession({ headers });
  const admin = (env as unknown as AppEnv).ADMIN_EMAIL?.toLowerCase();
  const userEmail = session?.user?.email?.toLowerCase();
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

export const updateOrderTracking = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { orderId: string; carrier: string; trackingNumber: string; trackingStatus: string }) => {
      if (!d.orderId) throw new Error("orderId requis");
      return {
        orderId: d.orderId,
        carrier: (d.carrier ?? "").slice(0, 100),
        trackingNumber: (d.trackingNumber ?? "").slice(0, 200),
        trackingStatus: (d.trackingStatus ?? "").slice(0, 100),
      };
    },
  )
  .handler(async ({ data }) => {
    if (!(await getAdminEmailOrNull())) throw new Error("UNAUTHORIZED");
    await getDb()
      .update(orders)
      .set({
        carrier: data.carrier || null,
        trackingNumber: data.trackingNumber || null,
        trackingStatus: data.trackingStatus || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, data.orderId));
    return { ok: true };
  });
