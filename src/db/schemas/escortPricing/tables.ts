import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { escortProfiles } from "../escortProfiles/tables";

export const escortPricing = pgTable("escort_pricing", {
	id: text("id").primaryKey(),
	escortId: text("escort_id")
		.notNull()
		.references(() => escortProfiles.id, { onDelete: "cascade" }),

	thirtyMinutes: decimal("thirty_minutes", { precision: 10, scale: 2 }),
	oneHour: decimal("one_hour", { precision: 10, scale: 2 }),
	twoHours: decimal("two_hours", { precision: 10, scale: 2 }),
	overnight: decimal("overnight", { precision: 10, scale: 2 }),
	daily: decimal("daily", { precision: 10, scale: 2 }),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.notNull(),
});
