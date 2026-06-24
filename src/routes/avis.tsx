import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { getSession } from "@/lib/auth-server";

export const Route = createFileRoute("/avis")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/connexion" });
    }
    return { user: session.user };
  },
  component: AvisPage,
});

const MAX_PHOTOS = 3;
const ACCEPT = "image/jpeg,image/png,image/webp";

const ERROR_LABELS: Record<string, string> = {
  NOT_A_BUYER: "Tu dois avoir passé une commande pour laisser un avis.",
  ALREADY_REVIEWED: "Tu as déjà laissé un avis sur ce produit.",
  PHOTO_TOO_LARGE: "Photo trop lourde (max 5 Mo).",
  INVALID_PHOTO_TYPE: "Format non supporté (JPG, PNG, WEBP).",
  TOO_MANY_PHOTOS: "3 photos maximum.",
  INVALID_RATING: "Choisis une note entre 1 et 5 étoiles.",
  UNAUTHENTICATED: "Tu dois être connecté pour laisser un avis.",
};

type Status = "idle" | "submitting" | "sent" | "error";

function AvisPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files ?? []);
    const merged = [...photos, ...incoming].slice(0, MAX_PHOTOS);
    setPhotos(merged);
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setStatus("error");
      setErrorMessage(ERROR_LABELS.INVALID_RATING);
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData();
    form.set("productId", "kinetis-brush");
    form.set("rating", String(rating));
    form.set("comment", comment);
    for (const file of photos) {
      form.append("photos", file);
    }

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          (data.error && ERROR_LABELS[data.error]) ||
            "Échec de l'envoi de l'avis. Réessaie dans un instant.",
        );
        return;
      }
      setStatus("sent");
    } catch (err) {
      console.error("[avis] submit failed:", err);
      setStatus("error");
      setErrorMessage("Échec de l'envoi de l'avis. Réessaie dans un instant.");
    }
  }

  const submitting = status === "submitting";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            <img src="/kinetis-logo.png" alt="Kinetis Brush" className="h-10 w-auto" />
          </Link>
          <Link
            to="/compte"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Mon compte
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12 lg:py-16">
        {status === "sent" ? (
          <div className="bg-background rounded-3xl border border-border p-8 sm:p-10 text-center space-y-4">
            <h1 className="font-display text-3xl text-foreground">Merci pour ton avis 💛</h1>
            <p className="text-muted-foreground">
              Ton avis sera publié après validation par notre équipe.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 gradient-rose text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-background rounded-3xl border border-border p-6 sm:p-10 space-y-7"
          >
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground">Laisser un avis</h1>
              <p className="text-sm text-muted-foreground">
                Partage ton expérience avec Kinetis Brush. Les avis sont modérés avant publication.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Ta note</label>
              <div
                className="inline-flex items-center gap-1"
                role="radiogroup"
                aria-label="Note"
                onMouseLeave={() => setHover(0)}
              >
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = (hover || rating) >= value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(value)}
                      onClick={() => setRating(value)}
                      className="p-1.5 rounded-full hover:bg-cream transition-colors"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          active ? "text-rose-gold" : "text-muted-foreground/40"
                        }`}
                        style={active ? { fill: "currentColor" } : undefined}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Ton commentaire</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={2000}
                rows={5}
                disabled={submitting}
                placeholder="Qu'as-tu pensé du produit ?"
                className="w-full rounded-2xl border border-border bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-rose-gold/40 disabled:opacity-60 resize-y"
              />
              <span className="text-xs text-muted-foreground">{comment.length} / 2000</span>
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium">
                Photos{" "}
                <span className="text-muted-foreground">
                  (jusqu'à {MAX_PHOTOS}, JPG / PNG / WEBP, 5 Mo max)
                </span>
              </span>

              {photos.length > 0 && (
                <ul className="grid grid-cols-3 gap-3">
                  {photos.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="relative aspect-square rounded-2xl border border-border bg-cream overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Aperçu ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1.5 right-1.5 inline-flex items-center justify-center h-7 w-7 rounded-full bg-background/90 border border-border hover:bg-background"
                        aria-label="Retirer la photo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {photos.length < MAX_PHOTOS && (
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-dashed border-border bg-cream text-sm font-medium cursor-pointer hover:border-rose-gold transition-colors">
                  <ImagePlus className="h-4 w-4 text-rose-gold" />
                  Ajouter une photo
                  <input
                    type="file"
                    accept={ACCEPT}
                    multiple
                    onChange={handlePhotoChange}
                    disabled={submitting}
                    className="hidden"
                  />
                </label>
              )}
              <p className="text-xs text-muted-foreground">
                {photos.length} / {MAX_PHOTOS} photo{photos.length > 1 ? "s" : ""} sélectionnée
                {photos.length > 1 ? "s" : ""}
              </p>
            </div>

            {status === "error" && errorMessage && (
              <p className="text-sm text-rose-gold">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-3 w-full gradient-rose text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
              {submitting ? "Envoi en cours…" : "Publier mon avis"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
