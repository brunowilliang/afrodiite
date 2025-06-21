CREATE TYPE "public"."ethnicity" AS ENUM('white', 'mixed', 'black', 'asian', 'indigenous');--> statement-breakpoint
CREATE TYPE "public"."eye_color" AS ENUM('brown', 'blue', 'green', 'hazel', 'gray');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('female', 'male', 'trans', 'non_binary');--> statement-breakpoint
CREATE TYPE "public"."genitalia" AS ENUM('vagina', 'penis', 'both');--> statement-breakpoint
CREATE TYPE "public"."hair_length" AS ENUM('short', 'medium', 'long');--> statement-breakpoint
CREATE TYPE "public"."hair_style" AS ENUM('straight', 'curly', 'wavy');--> statement-breakpoint
CREATE TYPE "public"."has_place" AS ENUM('own_place', 'motel_only', 'both');--> statement-breakpoint
CREATE TYPE "public"."serves_only" AS ENUM('men', 'women', 'both', 'couples');--> statement-breakpoint
CREATE TYPE "public"."service_level" AS ENUM('receive', 'perform', 'specialist', 'not_available');--> statement-breakpoint
CREATE TYPE "public"."sexual_preference" AS ENUM('heterosexual', 'homosexual', 'bisexual', 'pansexual');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
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
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text DEFAULT 'escort' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "verifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "escort_pricing" (
	"id" text PRIMARY KEY NOT NULL,
	"escort_id" text NOT NULL,
	"thirty_minutes" numeric(10, 2),
	"one_hour" numeric(10, 2),
	"two_hours" numeric(10, 2),
	"overnight" numeric(10, 2),
	"daily" numeric(10, 2),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "escort_pricing" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "escort_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"slogan" text,
	"name" text NOT NULL,
	"description" text,
	"age" integer NOT NULL,
	"phone" text NOT NULL,
	"has_place" "has_place" NOT NULL,
	"serves_only" "serves_only" NOT NULL,
	"address" text NOT NULL,
	"neighborhoods_served" jsonb DEFAULT '[]'::jsonb,
	"nearby_cities_served" jsonb DEFAULT '[]'::jsonb,
	"gender" "gender" NOT NULL,
	"genitalia" "genitalia" NOT NULL,
	"sexual_preference" "sexual_preference" NOT NULL,
	"weight" integer,
	"height" integer,
	"ethnicity" "ethnicity" NOT NULL,
	"eye_color" "eye_color" NOT NULL,
	"hair_style" "hair_style" NOT NULL,
	"hair_length" "hair_length" NOT NULL,
	"foot_size" integer,
	"has_silicone" boolean DEFAULT false,
	"has_tattoos" boolean DEFAULT false,
	"has_piercings" boolean DEFAULT false,
	"is_smoker" boolean DEFAULT false,
	"payment_methods" jsonb DEFAULT '[]'::jsonb,
	"service_locations" jsonb DEFAULT '[]'::jsonb,
	"place_amenities" jsonb DEFAULT '[]'::jsonb,
	"working_hours" jsonb NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verification_status" "verification_status" DEFAULT 'pending',
	"is_available" boolean DEFAULT false,
	"is_sponsored" boolean DEFAULT false,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "escort_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "escort_services" (
	"id" text PRIMARY KEY NOT NULL,
	"escort_id" text NOT NULL,
	"greek_kiss" "service_level" DEFAULT 'not_available',
	"feet_worship" "service_level" DEFAULT 'not_available',
	"sadomasochism" "service_level" DEFAULT 'not_available',
	"fisting" "service_level" DEFAULT 'not_available',
	"facefuck" "service_level" DEFAULT 'not_available',
	"hand_fetish" "service_level" DEFAULT 'not_available',
	"squirt" "service_level" DEFAULT 'not_available',
	"golden_shower" "service_level" DEFAULT 'not_available',
	"escort_service" "service_level" DEFAULT 'not_available',
	"travel" "service_level" DEFAULT 'not_available',
	"mouth_kiss" "service_level" DEFAULT 'not_available',
	"roleplay" "service_level" DEFAULT 'not_available',
	"anal_with_condom" "service_level" DEFAULT 'not_available',
	"vaginal_with_condom" "service_level" DEFAULT 'not_available',
	"oral_with_condom" "service_level" DEFAULT 'not_available',
	"masturbation" "service_level" DEFAULT 'not_available',
	"traditional_massage" "service_level" DEFAULT 'not_available',
	"domination" "service_level" DEFAULT 'not_available',
	"fantasy_clothes" "service_level" DEFAULT 'not_available',
	"sex_toys_penetration" "service_level" DEFAULT 'not_available',
	"erotic_accessories" "service_level" DEFAULT 'not_available',
	"oral_without_condom" "service_level" DEFAULT 'not_available',
	"striptease" "service_level" DEFAULT 'not_available',
	"tantric_massage" "service_level" DEFAULT 'not_available',
	"virtual_sex" "service_level" DEFAULT 'not_available',
	"double_penetration" "service_level" DEFAULT 'not_available',
	"triple_penetration" "service_level" DEFAULT 'not_available',
	"allows_filming" "service_level" DEFAULT 'not_available',
	"voyeurism" "service_level" DEFAULT 'not_available',
	"bondage" "service_level" DEFAULT 'not_available',
	"brown_shower" "service_level" DEFAULT 'not_available',
	"trampling" "service_level" DEFAULT 'not_available'
);
--> statement-breakpoint
ALTER TABLE "escort_services" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escort_pricing" ADD CONSTRAINT "escort_pricing_escort_id_escort_profiles_id_fk" FOREIGN KEY ("escort_id") REFERENCES "public"."escort_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escort_profiles" ADD CONSTRAINT "escort_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escort_services" ADD CONSTRAINT "escort_services_escort_id_escort_profiles_id_fk" FOREIGN KEY ("escort_id") REFERENCES "public"."escort_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "account_policy" ON "accounts" AS PERMISSIVE FOR ALL TO "authenticated" USING (((select auth.uid())) = "accounts"."user_id") WITH CHECK (((select auth.uid())) = "accounts"."user_id");--> statement-breakpoint
CREATE POLICY "session_policy" ON "sessions" AS PERMISSIVE FOR ALL TO "authenticated" USING (((select auth.uid())) = "sessions"."user_id") WITH CHECK (((select auth.uid())) = "sessions"."user_id");--> statement-breakpoint
CREATE POLICY "user_select_policy" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((select auth.uid())) = "users"."id");--> statement-breakpoint
CREATE POLICY "user_update_policy" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((select auth.uid())) = "users"."id") WITH CHECK (((select auth.uid())) = "users"."id");--> statement-breakpoint
CREATE POLICY "verification_policy" ON "verifications" AS PERMISSIVE FOR ALL TO "authenticated" USING (((select auth.uid())) = "verifications"."identifier") WITH CHECK (((select auth.uid())) = "verifications"."identifier");--> statement-breakpoint
CREATE POLICY "escort_pricing_delete_policy" ON "escort_pricing" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists(
    select 1 from escort_profiles 
    where id = "escort_pricing"."escort_id" 
    and user_id = ((select auth.uid()))
  ));--> statement-breakpoint
CREATE POLICY "escort_pricing_insert_policy" ON "escort_pricing" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists(
    select 1 from escort_profiles 
    where id = "escort_pricing"."escort_id" 
    and user_id = ((select auth.uid()))
  ));--> statement-breakpoint
CREATE POLICY "escort_pricing_select_policy" ON "escort_pricing" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "escort_pricing_update_policy" ON "escort_pricing" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists(
    select 1 from escort_profiles 
    where id = "escort_pricing"."escort_id" 
    and user_id = ((select auth.uid()))
  )) WITH CHECK (exists(
    select 1 from escort_profiles 
    where id = "escort_pricing"."escort_id" 
    and user_id = ((select auth.uid()))
  ));--> statement-breakpoint
CREATE POLICY "escort_profile_delete_policy" ON "escort_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((select auth.uid())) = "escort_profiles"."user_id");--> statement-breakpoint
CREATE POLICY "escort_profile_insert_policy" ON "escort_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((select auth.uid())) = "escort_profiles"."user_id");--> statement-breakpoint
CREATE POLICY "escort_profile_select_policy" ON "escort_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "escort_profile_update_policy" ON "escort_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((select auth.uid())) = "escort_profiles"."user_id") WITH CHECK (((select auth.uid())) = "escort_profiles"."user_id");--> statement-breakpoint
CREATE POLICY "escort_services_delete_policy" ON "escort_services" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists(
    select 1 from escort_profiles 
    where id = "escort_services"."escort_id" 
    and user_id = ((select auth.uid()))
  ));--> statement-breakpoint
CREATE POLICY "escort_services_insert_policy" ON "escort_services" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists(
    select 1 from escort_profiles 
    where id = "escort_services"."escort_id" 
    and user_id = ((select auth.uid()))
  ));--> statement-breakpoint
CREATE POLICY "escort_services_select_policy" ON "escort_services" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "escort_services_update_policy" ON "escort_services" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists(
    select 1 from escort_profiles 
    where id = "escort_services"."escort_id" 
    and user_id = ((select auth.uid()))
  )) WITH CHECK (exists(
    select 1 from escort_profiles 
    where id = "escort_services"."escort_id" 
    and user_id = ((select auth.uid()))
  ));