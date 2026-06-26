import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { Lang } from "@/lib/i18n";

/**
 * Lit la langue préférée depuis le cookie `lang=fr|en` envoyé par le navigateur.
 * Tourne côté Worker, donc le résultat est dispo dès la première frame du SSR
 * — pas de flash de langue à l'hydratation.
 */
export const getLang = createServerFn({ method: "GET" }).handler(async (): Promise<Lang> => {
  const cookie = new Headers(getRequestHeaders() as Record<string, string>).get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)lang=(fr|en)/);
  return (m?.[1] ?? "fr") as Lang;
});
