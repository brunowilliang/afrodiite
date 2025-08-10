ALTER TABLE "escort_profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "view_active_escorts" ON "escort_profiles" CASCADE;