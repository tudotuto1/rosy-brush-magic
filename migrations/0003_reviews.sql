CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text DEFAULT 'kinetis-brush' NOT NULL,
	`email` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`photo_keys` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `reviews_status_idx` ON `reviews` (`status`);
--> statement-breakpoint
CREATE INDEX `reviews_email_idx` ON `reviews` (`email`);
--> statement-breakpoint
CREATE INDEX `reviews_product_id_idx` ON `reviews` (`product_id`);
