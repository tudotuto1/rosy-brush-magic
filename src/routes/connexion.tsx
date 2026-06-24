import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/connexion")({
  component: ConnexionPage,
});

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus({ kind: "loading" });
    const { error } = await authClient.signIn.magicLink({
      email: trimmed,
      callbackURL: "/compte",
    });
    if (error) {
      setStatus({
        kind: "error",
        message: "L'envoi du lien a échoué. Vérifie ton adresse et réessaie.",
      });
      return;
    }
    setStatus({ kind: "sent", email: trimmed });
  }

  const isLoading = status.kind === "loading";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-background rounded-3xl shadow-md border border-border p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-foreground">Connexion</h1>
            <p className="text-sm text-muted-foreground">
              Reçois un lien magique par email. Pas de mot de passe à retenir.
            </p>
          </div>

          {status.kind === "sent" ? (
            <div className="rounded-2xl border border-border bg-cream p-5 space-y-2">
              <div className="font-medium">Email envoyé ✅</div>
              <p className="text-sm text-muted-foreground">
                Un lien de connexion vient d'être envoyé à{" "}
                <span className="text-foreground font-medium">{status.email}</span>. Vérifie ta
                boîte de réception (et tes spams).
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Adresse email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-rose-gold/40 disabled:opacity-60"
                  placeholder="tu@exemple.com"
                />
              </label>
              {status.kind === "error" && (
                <p className="text-sm text-rose-gold">{status.message}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex items-center justify-center gap-3 w-full gradient-rose text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
                {isLoading ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
