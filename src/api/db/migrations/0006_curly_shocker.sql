CREATE SEQUENCE "public"."escort_public_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1000 CACHE 1;--> statement-breakpoint
ALTER TABLE "escort_profiles" ADD COLUMN "public_id" integer DEFAULT nextval('escort_public_id_seq') NOT NULL;--> statement-breakpoint
ALTER TABLE "escort_profiles" ADD CONSTRAINT "escort_profiles_public_id_unique" UNIQUE("public_id");