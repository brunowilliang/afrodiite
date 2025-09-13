CREATE TABLE `escort_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`escort_id` text NOT NULL,
	`reviewer_name` text NOT NULL,
	`reviewer_email` text,
	`reviewer_phone` text,
	`rating` integer NOT NULL,
	`title` text,
	`comment` text NOT NULL,
	`status` text DEFAULT 'pending',
	`escort_response` text,
	`escort_responded_at` integer,
	`ip_address` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`escort_id`) REFERENCES `escort_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_escort_status` ON `escort_reviews` (`escort_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_reviews_created_at` ON `escort_reviews` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reviews_rating` ON `escort_reviews` (`escort_id`,`rating`);