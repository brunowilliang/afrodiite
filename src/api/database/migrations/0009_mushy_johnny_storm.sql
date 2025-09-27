PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_escort_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
INSERT INTO `__new_escort_reviews`("id", "escort_id", "reviewer_name", "reviewer_email", "reviewer_phone", "rating", "title", "comment", "status", "escort_response", "escort_responded_at", "ip_address", "created_at", "updated_at") SELECT "id", "escort_id", "reviewer_name", "reviewer_email", "reviewer_phone", "rating", "title", "comment", "status", "escort_response", "escort_responded_at", "ip_address", "created_at", "updated_at" FROM `escort_reviews`;--> statement-breakpoint
DROP TABLE `escort_reviews`;--> statement-breakpoint
ALTER TABLE `__new_escort_reviews` RENAME TO `escort_reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_reviews_escort_status` ON `escort_reviews` (`escort_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_reviews_created_at` ON `escort_reviews` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reviews_rating` ON `escort_reviews` (`escort_id`,`rating`);