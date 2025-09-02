ALTER TABLE `escort_profiles` RENAME COLUMN "is_active" TO "is_visible";--> statement-breakpoint
ALTER TABLE `escort_profiles` DROP COLUMN `is_verified`;