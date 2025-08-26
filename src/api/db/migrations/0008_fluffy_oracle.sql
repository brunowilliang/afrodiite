ALTER TABLE "escort_profiles" ALTER COLUMN "public_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "escort_profiles" ALTER COLUMN "public_id" SET DEFAULT nextval('escort_public_id_seq');