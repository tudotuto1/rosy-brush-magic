export type AppEnv = {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  PUBLIC_APP_URL: string;
  PUBLIC_META_PIXEL_ID: string;
  ORDERS_KV: KVNamespace;
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
  META_CAPI_ACCESS_TOKEN: string;
  PHOTOS: R2Bucket;
};
