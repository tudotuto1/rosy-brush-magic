import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews } from "@/db/schema";

/**
 * Masque l'email d'auteur côté serveur — le client ne reçoit JAMAIS
 * l'adresse complète. Forme renvoyée : `f…r@example.com`.
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || !local) return "client vérifié";
  const first = local[0] ?? "";
  const last = local.length > 1 ? local[local.length - 1] : "";
  return `${first}…${last}@${domain}`;
}

export type PublicReview = {
  id: string;
  rating: number;
  comment: string | null;
  photoKeys: string[];
  maskedEmail: string;
  createdAt: string;
};

export const getApprovedReviews = createServerFn({ method: "GET" })
  .inputValidator((d?: { productId?: string }) => ({
    productId: d?.productId || "kinetis-brush",
  }))
  .handler(async ({ data }): Promise<PublicReview[]> => {
    const rows = await getDb()
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, data.productId), eq(reviews.status, "approved")))
      .orderBy(desc(reviews.createdAt));

    return rows.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      photoKeys: JSON.parse(r.photoKeys) as string[],
      maskedEmail: maskEmail(r.email),
      createdAt: r.createdAt,
    }));
  });
