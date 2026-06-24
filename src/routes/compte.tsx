import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Package } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getSession } from "@/lib/auth-server";

export const Route = createFileRoute("/compte")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/connexion" });
    }
    return { user: session.user };
  },
  component: ComptePage,
});

function ComptePage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    await navigate({ to: "/" });
  }

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

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 lg:py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground">Mon compte</h1>
          <p className="text-muted-foreground">
            Connecté en tant que <span className="font-medium text-foreground">{user.email}</span>.
          </p>
        </div>

        <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/40 flex items-center justify-center">
              <Package className="h-5 w-5 text-rose-gold" />
            </div>
            <h2 className="font-semibold text-lg">Historique de commandes</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Tes commandes apparaîtront ici prochainement.
          </p>
        </div>

        <div className="bg-background rounded-3xl border border-border p-6 sm:p-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">Session</h2>
            <p className="text-sm text-muted-foreground">Termine ta session sur cet appareil.</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      </main>
    </div>
  );
}
