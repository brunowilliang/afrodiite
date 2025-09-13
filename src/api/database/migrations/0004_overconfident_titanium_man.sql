CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`escort_id` text NOT NULL,
	`event_type` text NOT NULL,
	`user_session` text,
	`metadata` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_escort_event` ON `analytics_events` (`escort_id`,`event_type`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_escort_date` ON `analytics_events` (`escort_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_escort_date_event` ON `analytics_events` (`escort_id`,`created_at`,`event_type`);--> statement-breakpoint
DROP INDEX "idx_escort_event";--> statement-breakpoint
DROP INDEX "idx_created_at";--> statement-breakpoint
DROP INDEX "idx_escort_date";--> statement-breakpoint
DROP INDEX "idx_escort_date_event";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_public_id_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_slug_unique";--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "office_hours" TO "office_hours" text;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_public_id_unique` ON `escort_profiles` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_slug_unique` ON `escort_profiles` (`slug`);--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "prices" TO "prices" text;--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "characteristics" TO "characteristics" text;