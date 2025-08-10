ALTER TABLE "escort_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER POLICY "public_read_active_escorts" ON "escort_profiles" RENAME TO "view_active_escorts";