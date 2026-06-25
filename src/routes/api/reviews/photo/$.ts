import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import type { AppEnv } from "@/lib/env";

/**
 * Streame une photo d'avis depuis R2.
 * Lecture publique mais portée volontairement étroite : la clé DOIT
 * commencer par `reviews/`, sinon 404 — pas de lookup d'autres préfixes
 * R2 (impossible de lire d'autres buckets via cette route).
 *
 * Les clés `reviews/<reviewId>/<i>-<uuid>.<ext>` sont non devinables
 * tant que `reviewId` et le suffixe UUID restent secrets.
 */
export const Route = createFileRoute("/api/reviews/photo/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = (params as { _splat?: string })._splat ?? "";
        if (!key.startsWith("reviews/")) {
          return new Response("Not found", { status: 404 });
        }
        const obj = await (env as unknown as AppEnv).PHOTOS.get(key);
        if (!obj) return new Response("Not found", { status: 404 });
        return new Response(obj.body, {
          headers: {
            "Content-Type": obj.httpMetadata?.contentType ?? "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
