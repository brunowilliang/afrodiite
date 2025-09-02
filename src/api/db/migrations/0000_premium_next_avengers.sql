CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`plan` text NOT NULL,
	`reference_id` text NOT NULL,
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`status` text DEFAULT 'incomplete',
	`period_start` integer,
	`period_end` integer,
	`cancel_at_period_end` integer,
	`seats` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`stripe_customer_id` text,
	`role` text DEFAULT 'escort' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `escort_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` integer NOT NULL,
	`name` text NOT NULL,
	`artist_name` text,
	`slug` text,
	`description` text,
	`birthday` text,
	`phone` text,
	`whatsapp` text,
	`email` text,
	`nationality` text,
	`links` text DEFAULT '{}',
	`district` text,
	`city` text,
	`country` text,
	`is_active` integer,
	`is_verified` integer,
	`office_hours` text DEFAULT '[{"day":"monday","is_available":false,"start":"00:00","end":"23:59"},{"day":"tuesday","is_available":false,"start":"00:00","end":"23:59"},{"day":"wednesday","is_available":false,"start":"00:00","end":"23:59"},{"day":"thursday","is_available":false,"start":"00:00","end":"23:59"},{"day":"friday","is_available":false,"start":"00:00","end":"23:59"},{"day":"saturday","is_available":false,"start":"00:00","end":"23:59"},{"day":"sunday","is_available":false,"start":"00:00","end":"23:59"}]',
	`prices` text DEFAULT '[{"slot":"30m","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"1h","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"2h","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"4h","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"overnight","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"daily","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"travel","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"},{"slot":"outcall","is_available":false,"amount":0,"negotiated":false,"currency":"EUR"}]',
	`characteristics` text DEFAULT '{"gender":"","age":0,"height":0,"weight":0,"hair_color":"","eye_color":"","sexual_preference":"","ethnicity":"","silicone":false,"tattoos":false,"piercings":false,"smoker":false,"languages":""}',
	`services` text DEFAULT '[]',
	`gallery` text DEFAULT '[]',
	`created_at` integer,
	`updated_at` integer,
	`last_active_at` integer,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_public_id_unique` ON `escort_profiles` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `escort_profiles_slug_unique` ON `escort_profiles` (`slug`);
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS escort_public_id_ai
AFTER INSERT ON escort_profiles
FOR EACH ROW
WHEN NEW.public_id IS NULL
BEGIN
  UPDATE escort_profiles
  SET public_id = (
    SELECT COALESCE(MAX(public_id), 999) + 1
    FROM escort_profiles
  )
  WHERE rowid = NEW.rowid;
END;