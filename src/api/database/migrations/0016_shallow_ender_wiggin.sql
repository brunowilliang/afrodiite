ALTER TABLE `escort_reviews` ADD `public_id` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `escort_reviews_public_id_unique` ON `escort_reviews` (`public_id`);