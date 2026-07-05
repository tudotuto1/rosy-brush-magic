import { Link } from "@tanstack/react-router";
import { useConsent } from "@/lib/consent";
import { useLang } from "@/lib/i18n";

/**
 * Bannière de consentement (Loi 25). Visible tant que l'internaute n'a pas
 * choisi ; masquée dès qu'un choix est fait (granted/denied). Bilingue via t().
 */
export function ConsentBanner() {
  const { status, grant, deny } = useConsent();
  const { t } = useLang();

  if (status !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-label={t("consent.text")}
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          {t("consent.text")}{" "}
          <Link to="/confidentialite" className="text-rose-gold hover:underline whitespace-nowrap">
            {t("consent.learnMore")}
          </Link>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={deny}
            className="rounded-2xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-cream transition-colors"
          >
            {t("consent.decline")}
          </button>
          <button
            type="button"
            onClick={grant}
            className="rounded-2xl gradient-rose text-white px-5 py-2.5 text-sm font-medium shadow-md hover:shadow-xl transition-all"
          >
            {t("consent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
