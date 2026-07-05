import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

/**
 * Consentement aux témoins / au pixel Meta (Loi 25).
 * - "unknown" : l'internaute n'a pas encore choisi → la bannière s'affiche.
 * - "granted" : accepté → le pixel Meta peut se charger.
 * - "denied"  : refusé → aucun tracking.
 */
export type ConsentStatus = "unknown" | "granted" | "denied";

// 180 jours.
const CONSENT_MAX_AGE = 15552000;

type ConsentContextValue = {
  status: ConsentStatus;
  grant: () => void;
  deny: () => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({
  initialStatus,
  children,
}: {
  initialStatus: ConsentStatus;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<ConsentStatus>(initialStatus);

  const setConsent = useCallback((s: "granted" | "denied") => {
    setStatus(s);
    if (typeof document !== "undefined") {
      document.cookie = `consent=${s}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax`;
    }
  }, []);

  const grant = useCallback(() => setConsent("granted"), [setConsent]);
  const deny = useCallback(() => setConsent("denied"), [setConsent]);

  return (
    <ConsentContext.Provider value={{ status, grant, deny }}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
