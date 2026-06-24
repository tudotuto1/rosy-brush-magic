CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`stripe_session_id` text NOT NULL,
	`email` text NOT NULL,
	`amount_total` integer NOT NULL,
	`currency` text NOT NULL,
	`product_id` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'paid' NOT NULL,
	`tracking_number` text,
	`carrier` text,
	`tracking_status` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_stripe_session_id_unique` ON `orders` (`stripe_session_id`);
--> statement-breakpoint
CREATE INDEX `orders_email_idx` ON `orders` (`email`);
