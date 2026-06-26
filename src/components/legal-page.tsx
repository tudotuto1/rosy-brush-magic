import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/i18n";

export function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { lang } = useLang();
  const backLabel = lang === "fr" ? "Retour à l'accueil" : "Back to home";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 lg:py-16">
        <article className="bg-background rounded-3xl border border-border p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-4xl text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="legal-content space-y-5 text-foreground leading-relaxed">{children}</div>
        </article>
      </main>
    </div>
  );
}
