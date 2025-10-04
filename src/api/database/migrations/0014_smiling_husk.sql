ALTER TABLE `analytics_events` RENAME COLUMN "day_of_week" TO "day";--> statement-breakpoint
DROP INDEX `idx_hour_day`;--> statement-breakpoint
DROP INDEX "idx_escort_event";--> statement-breakpoint
DROP INDEX "idx_created_at";--> statement-breakpoint
DROP INDEX "idx_escort_date";--> statement-breakpoint
DROP INDEX "idx_escort_date_event";--> statement-breakpoint
DROP INDEX "idx_hour_day";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_public_id_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_slug_unique";--> statement-breakpoint
DROP INDEX "idx_reviews_escort_status";--> statement-breakpoint
DROP INDEX "idx_reviews_created_at";--> statement-breakpoint
DROP INDEX "idx_reviews_rating";--> statement-breakpoint
ALTER TABLE `analytics_events` ALTER COLUMN "hour" TO "hour" integer NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_escort_event` ON `analytics_events` (`escort_id`,`event_type`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_escort_date` ON `analytics_events` (`escort_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_escort_date_event` ON `analytics_events` (`escort_id`,`created_at`,`event_type`);--> statement-breakpoint
CREATE INDEX `idx_hour_day` ON `analytics_events` (`hour`,`day`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_public_id_unique` ON `escort_profiles` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_slug_unique` ON `escort_profiles` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_reviews_escort_status` ON `escort_reviews` (`escort_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_reviews_created_at` ON `escort_reviews` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reviews_rating` ON `escort_reviews` (`escort_id`,`rating`);--> statement-breakpoint
ALTER TABLE `analytics_events` ALTER COLUMN "day" TO "day" text NOT NULL;--> statement-breakpoint
ALTER TABLE `analytics_events` ADD `device` text NOT NULL;--> statement-breakpoint
ALTER TABLE `analytics_events` DROP COLUMN `user_session`;--> statement-breakpoint
ALTER TABLE `analytics_events` DROP COLUMN `metadata`;