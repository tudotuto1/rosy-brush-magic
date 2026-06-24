import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { createAuth } from "@/lib/auth";

/**
 * Commandes du user connecté, triées de la plus récente à la plus ancienne.
 * Retourne `[]` si non connecté ou si aucun email (cookies absents).
 */
export const getMyOrders = createServerFn({ method: "GET" }).handler(async () => {
  const headers = new Headers(getRequestHeaders() as Record<string, string>);
  const session = await createAuth().api.getSession({ headers });
  if (!session?.user?.email) return [];
  return await getDb()
    .select()
    .from(orders)
    .where(eq(orders.email, session.user.email))
    .orderBy(desc(orders.createdAt));
});
