ALTER TABLE `analytics_events` ADD `hour` integer;--> statement-breakpoint
ALTER TABLE `analytics_events` ADD `day_of_week` integer;--> statement-breakpoint
CREATE INDEX `idx_hour_day` ON `analytics_events` (`hour`,`day_of_week`);