ALTER TABLE `analytics_events` ADD `public_id` text NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_public_id` ON `analytics_events` (`public_id`);