import { Star } from "lucide-react";
import type { PublicReview } from "@/lib/reviews-server";

const dateFormatter = new Intl.DateTimeFormat("fr-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function StarsRow({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= rating;
        return (
          <Star
            key={n}
            className={`h-4 w-4 ${active ? "text-rose-gold" : "text-muted-foreground/30"}`}
            style={active ? { fill: "currentColor" } : undefined}
          />
        );
      })}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: PublicReview[] }) {
  if (reviews.length === 0) return null;

  const total = reviews.length;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const avgLabel = avg.toFixed(1).replace(".", ",");

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">Avis clients</h2>
          <div className="inline-flex items-center gap-3">
            <StarsRow rating={Math.round(avg)} />
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{avgLabel}</strong> / 5 · {total} avis vérifié
              {total > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: PublicReview }) {
  const dateLabel = dateFormatter.format(new Date(review.createdAt));
  const photos = review.photoKeys.slice(0, 3);

  return (
    <article className="bg-cream rounded-3xl border border-border p-6 space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <StarsRow rating={review.rating} />
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">{review.maskedEmail}</span> · {dateLabel}
          </div>
        </div>
        <span className="text-xs font-semibold text-rose-gold uppercase tracking-wide">
          Vérifié
        </span>
      </header>

      {review.comment && <p className="text-foreground leading-relaxed">"{review.comment}"</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((key) => (
            <div
              key={key}
              className="aspect-square rounded-2xl overflow-hidden bg-background border border-border"
            >
              <img
                src={`/api/reviews/photo/${key}`}
                alt="Photo d'avis client"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
