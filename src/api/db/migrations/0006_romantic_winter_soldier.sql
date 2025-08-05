CREATE TABLE "escort_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"artist_name" text,
	"slug" text,
	"description" text,
	"birthday" date,
	"phone" text,
	"email" text,
	"links" jsonb DEFAULT '{}'::jsonb,
	"city" text,
	"state" text,
	"country" text DEFAULT 'PT',
	"neighborhood" text,
	"nationality" text,
	"is_active" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"characteristics" jsonb DEFAULT '{}'::jsonb,
	"services" jsonb DEFAULT '[]'::jsonb,
	"office_hours" jsonb DEFAULT '{}'::jsonb,
	"fetishes" jsonb DEFAULT '[]'::jsonb,
	"prices" jsonb DEFAULT '[]'::jsonb,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_active_at" timestamp,
	CONSTRAINT "escort_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DROP TABLE "escort_profile" CASCADE;--> statement-breakpoint
ALTER TABLE "escort_profiles" ADD CONSTRAINT "escort_profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;