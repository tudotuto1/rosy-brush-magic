import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Table `orders` — historique des commandes payées via Stripe.
 * Distincte des tables Better Auth (user / session / account / verification).
 *
 * Source de vérité côté D1 ; la PR Phase 4 maintient un dual-write KV
 * transitoire pour ne pas casser /success existant.
 */
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  email: text("email").notNull(),
  amountTotal: integer("amount_total").notNull(), // en cents
  currency: text("currency").notNull(),
  productId: text("product_id"),
  quantity: integer("quantity").notNull().default(1),
  status: text("status").notNull().default("paid"),
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  trackingStatus: text("tracking_status"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

/**
 * Table `reviews` — avis clients.
 * Distincte des tables Better Auth et de `orders`.
 *
 * `photo_keys` contient un JSON array de clés R2 (bucket `kinetis-reviews`).
 * `status` permet la modération (pending / approved / rejected) avant publication.
 */
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().default("kinetis-brush"),
  email: text("email").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  photoKeys: text("photo_keys").notNull().default("[]"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
