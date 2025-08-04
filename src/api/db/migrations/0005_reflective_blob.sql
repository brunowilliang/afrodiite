CREATE TABLE "escort_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT false
);
--> statement-breakpoint
DROP TABLE "escort_profiles" CASCADE;--> statement-breakpoint
ALTER TABLE "escort_profile" ADD CONSTRAINT "escort_profile_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;