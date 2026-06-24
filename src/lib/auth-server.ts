import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuth } from "@/lib/auth";

/**
 * Lit la session courante côté serveur via les cookies de la requête entrante.
 * Retourne `null` si l'utilisateur n'est pas connecté.
 * `getRequestHeaders()` renvoie un objet typé compatible avec `new Headers(...)`.
 */
export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = new Headers(getRequestHeaders() as Record<string, string>);
  return await createAuth().api.getSession({ headers });
});
