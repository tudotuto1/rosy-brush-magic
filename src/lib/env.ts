export type AppEnv = {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  PUBLIC_APP_URL: string;
  ORDERS_KV: KVNamespace;
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  RESEND_API_KEY: string;
};
