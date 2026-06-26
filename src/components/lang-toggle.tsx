import { useLang, type Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["fr", "en"];

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center text-xs font-semibold border border-border rounded-full overflow-hidden"
    >
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`px-2.5 py-1 transition-colors ${
              active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
