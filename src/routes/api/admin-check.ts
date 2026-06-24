import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { createAuth } from "@/lib/auth";
import type { AppEnv } from "@/lib/env";

/**
 * Endpoint de diagnostic TEMPORAIRE pour /admin.
 * Ne révèle JAMAIS la valeur d'ADMIN_EMAIL — seulement la présence,
 * la longueur et le résultat de la comparaison normalisée.
 * À supprimer après le diagnostic.
 */
async function handleAdminCheck(request: Request): Promise<Response> {
  const session = await createAuth().api.getSession({ headers: request.headers });
  const sessionEmailRaw = session?.user?.email ?? null;
  const adminRaw = (env as unknown as AppEnv).ADMIN_EMAIL ?? "";

  const sessionEmailNormalized = sessionEmailRaw?.trim().toLowerCase() ?? null;
  const adminEmailNormalized = adminRaw.trim().toLowerCase();

  const matchAfterTrimLower =
    !!sessionEmailNormalized &&
    !!adminEmailNormalized &&
    sessionEmailNormalized === adminEmailNormalized;

  const body = {
    loggedIn: !!session,
    sessionEmail: sessionEmailRaw,
    sessionEmailLength: sessionEmailRaw?.length ?? 0,
    adminEmailIsSet: adminRaw.length > 0,
    adminEmailLength: adminRaw.length,
    matchAfterTrimLower,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/admin-check")({
  server: {
    handlers: {
      GET: ({ request }) => handleAdminCheck(request),
    },
  },
});
