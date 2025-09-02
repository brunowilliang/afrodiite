DROP INDEX "sessions_token_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_public_id_unique";--> statement-breakpoint
DROP INDEX "escort_profiles_slug_unique";--> statement-breakpoint
ALTER TABLE `escort_profiles` ALTER COLUMN "public_id" TO "public_id" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_public_id_unique` ON `escort_profiles` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_slug_unique` ON `escort_profiles` (`slug`);