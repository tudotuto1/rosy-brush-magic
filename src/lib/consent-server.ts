import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import type { ConsentStatus } from "@/lib/consent";
import type { AppEnv } from "@/lib/env";

/**
 * Lit le cookie `consent=granted|denied` côté Worker (même pattern que
 * lang-server.ts), pour connaître le choix de l'internaute dès la première
 * frame du SSR — pas de flash de bannière ni de pixel avant hydratation.
 */
export const getConsent = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConsentStatus> => {
    const cookie = new Headers(getRequestHeaders() as Record<string, string>).get("cookie") ?? "";
    const m = cookie.match(/(?:^|;\s*)consent=(granted|denied)/);
    return (m?.[1] ?? "unknown") as ConsentStatus;
  },
);

/**
 * Expose l'ID public du pixel Meta (var Worker, pas un secret) au client.
 */
export const getMetaPixelId = createServerFn({ method: "GET" }).handler(
  async (): Promise<string> => {
    const appEnv = env as unknown as AppEnv;
    return appEnv.PUBLIC_META_PIXEL_ID ?? "";
  },
);
