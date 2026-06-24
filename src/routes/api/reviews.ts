import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, reviews } from "@/db/schema";
import { createAuth } from "@/lib/auth";
import type { AppEnv } from "@/lib/env";

const MAX_PHOTOS = 3;
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
// PAS de SVG (risque script). Pas non plus de gif (réduit la surface).
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedMime = (typeof ALLOWED_MIME)[number];

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function extFor(mime: AllowedMime): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

async function handlePostReview(request: Request): Promise<Response> {
  const appEnv = env as unknown as AppEnv;

  // (1) Authentifié.
  const session = await createAuth().api.getSession({ headers: request.headers });
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return jsonResponse({ error: "UNAUTHENTICATED" }, 401);

  const db = getDb();

  // (2) Acheteur vérifié : au moins une commande à son email.
  const bought = await db.select().from(orders).where(eq(orders.email, email)).limit(1);
  if (bought.length === 0) return jsonResponse({ error: "NOT_A_BUYER" }, 403);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: "INVALID_BODY" }, 400);
  }

  const rating = Number(form.get("rating"));
  const comment = (form.get("comment")?.toString() ?? "").slice(0, 2000);
  const productId = form.get("productId")?.toString() || "kinetis-brush";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return jsonResponse({ error: "INVALID_RATING" }, 400);
  }

  // Anti-spam : un seul avis non-rejeté par (email, productId).
  const dup = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.email, email),
        eq(reviews.productId, productId),
        ne(reviews.status, "rejected"),
      ),
    )
    .limit(1);
  if (dup.length > 0) return jsonResponse({ error: "ALREADY_REVIEWED" }, 409);

  // (3) Validation des photos.
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_PHOTOS) return jsonResponse({ error: "TOO_MANY_PHOTOS" }, 400);

  const reviewId = crypto.randomUUID();
  const keys: string[] = [];
  for (const [i, file] of files.entries()) {
    if (file.size > MAX_SIZE) return jsonResponse({ error: "PHOTO_TOO_LARGE" }, 400);
    if (!ALLOWED_MIME.includes(file.type as AllowedMime)) {
      return jsonResponse({ error: "INVALID_PHOTO_TYPE" }, 400);
    }
    const mime = file.type as AllowedMime;
    const key = `reviews/${reviewId}/${i}-${crypto.randomUUID()}.${extFor(mime)}`;
    await appEnv.PHOTOS.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: mime },
    });
    keys.push(key);
  }

  const now = new Date().toISOString();
  await db.insert(reviews).values({
    id: reviewId,
    productId,
    email,
    rating,
    comment: comment || null,
    photoKeys: JSON.stringify(keys),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  return jsonResponse({ ok: true }, 200);
}

export const Route = createFileRoute("/api/reviews")({
  server: {
    handlers: {
      POST: ({ request }) => handlePostReview(request),
      ANY: () => jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405),
    },
  },
});
