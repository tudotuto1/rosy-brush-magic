import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "@/db/schema";
import type { AppEnv } from "@/lib/env";

/**
 * Drizzle client D1, **par-requête** sur Workers : `env.DB` est lié à la
 * requête en cours, donc on ne peut pas conserver un singleton entre
 * requêtes. Le coût d'instanciation Drizzle est négligeable.
 *
 * Cast vers AppEnv : `Cloudflare.Env` (depuis `cloudflare:workers`) n'est
 * pas augmenté ici — on s'appuie sur le contrat typé du projet.
 */
export function getDb() {
  const appEnv = env as unknown as AppEnv;
  return drizzle(appEnv.DB, { schema });
}
