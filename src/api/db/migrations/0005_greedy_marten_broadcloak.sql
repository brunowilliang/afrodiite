DROP INDEX "idx_escort_event";--> statement-breakpoint
DROP INDEX "idx_created_at";--> statement-breakpoint
DROP INDEX "idx_escort_date";--> statement-breakpoint
DROP INDEX "idx_escort_date_event";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_public_id_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_slug_unique";--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "office_hours" TO "office_hours" text DEFAULT '[{"day":"monday","is_available":false,"start":"00:00","end":"23:59"},{"day":"tuesday","is_available":false,"start":"00:00","end":"23:59"},{"day":"wednesday","is_available":false,"start":"00:00","end":"23:59"},{"day":"thursday","is_available":false,"start":"00:00","end":"23:59"},{"day":"friday","is_available":false,"start":"00:00","end":"23:59"},{"day":"saturday","is_available":false,"start":"00:00","end":"23:59"},{"day":"sunday","is_available":false,"start":"00:00","end":"23:59"}]';--> statement-breakpoint
CREATE INDEX `idx_escort_event` ON `analytics_events` (`escort_id`,`event_type`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_escort_date` ON `analytics_events` (`escort_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_escort_date_event` ON `analytics_events` (`escort_id`,`created_at`,`event_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_public_id_unique` ON `escort_profiles` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_slug_unique` ON `escort_profiles` (`slug`);--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "prices" TO "prices" text DEFAULT '[{"slot":"30m","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"1h","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"2h","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"4h","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"overnight","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"daily","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"travel","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"outcall","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"}]';--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "characteristics" TO "characteristics" text DEFAULT '{"gender":"","age":0,"height":0,"weight":0,"hair_color":"","eye_color":"","sexual_preference":"","ethnicity":"","silicone":false,"tattoos":false,"piercings":false,"smoker":false,"languages":""}';