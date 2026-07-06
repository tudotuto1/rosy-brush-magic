/**
 * API Conversions Meta (server-side) — envoie l'événement Purchase depuis le
 * Worker, en complément du pixel navigateur. Le même `event_id` est partagé
 * avec le pixel client (order.id) pour que Meta déduplique les deux envois.
 */

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sendPurchaseCapi(params: {
  pixelId: string;
  accessToken: string;
  eventId: string;
  email: string | null;
  value: number;
  currency: string;
  contentIds: string[];
}): Promise<void> {
  const em = params.email ? [await sha256Hex(params.email)] : undefined;
  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: "website",
        user_data: em ? { em } : {},
        custom_data: {
          currency: params.currency,
          value: params.value,
          content_ids: params.contentIds,
          content_type: "product",
        },
      },
    ],
  };
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${params.pixelId}/events?access_token=${params.accessToken}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!res.ok) {
    throw new Error(`Meta CAPI a échoué: ${res.status} ${await res.text().catch(() => "")}`);
  }
}
