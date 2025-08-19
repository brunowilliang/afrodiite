ALTER TABLE "escort_profiles" ADD COLUMN "district" text;--> statement-breakpoint
ALTER TABLE "escort_profiles" ADD COLUMN "zone" text;--> statement-breakpoint
ALTER TABLE "escort_profiles" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "escort_profiles" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "escort_profiles" DROP COLUMN "neighborhood";