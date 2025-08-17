CREATE TABLE "escort_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"artist_name" text,
	"slug" text,
	"description" text,
	"birthday" date,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"links" jsonb DEFAULT '{}'::jsonb,
	"city" text,
	"state" text,
	"country" text,
	"neighborhood" text,
	"nationality" text,
	"is_active" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"office_hours" jsonb DEFAULT '[{"day":"monday","is_available":true,"start":"00:00","end":"23:59"},{"day":"tuesday","is_available":true,"start":"00:00","end":"23:59"},{"day":"wednesday","is_available":true,"start":"00:00","end":"23:59"},{"day":"thursday","is_available":true,"start":"00:00","end":"23:59"},{"day":"friday","is_available":true,"start":"00:00","end":"23:59"},{"day":"saturday","is_available":true,"start":"00:00","end":"23:59"},{"day":"sunday","is_available":true,"start":"00:00","end":"23:59"}]'::jsonb,
	"prices" jsonb DEFAULT '[{"slot":"30m","is_available":true,"amount":0,"currency":"EUR"},{"slot":"1h","is_available":true,"amount":0,"currency":"EUR"},{"slot":"2h","is_available":true,"amount":0,"currency":"EUR"},{"slot":"4h","is_available":true,"amount":0,"currency":"EUR"},{"slot":"overnight","is_available":true,"amount":0,"currency":"EUR"},{"slot":"daily","is_available":true,"amount":0,"currency":"EUR"},{"slot":"travel_daily","is_available":true,"amount":0,"currency":"EUR"}]'::jsonb,
	"characteristics" jsonb DEFAULT '{"gender":"","age":"","height":"","weight":"","hair_color":"","eye_color":"","sexual_preference":"","ethnicity":"","silicone":false,"tattoos":false,"piercings":false,"smoker":false,"languages":""}'::jsonb,
	"services" jsonb DEFAULT '{}'::jsonb,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_active_at" timestamp,
	CONSTRAINT "escort_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"reference_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'incomplete',
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean,
	"seats" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"stripe_customer_id" text,
	"role" text DEFAULT 'escort' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "escort_profiles" ADD CONSTRAINT "escort_profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;