import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "../auth/tables";
import {
	ethnicityEnum,
	eyeColorEnum,
	genderEnum,
	genitaliaEnum,
	hairLengthEnum,
	hairStyleEnum,
	hasPlaceEnum,
	servesOnlyEnum,
	sexualPreferenceEnum,
	verificationStatusEnum,
} from "../enums";

export const escortProfiles = pgTable("escort_profiles", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	// Basic Info
	slogan: text("slogan"),
	name: text("name").notNull(),
	description: text("description"),
	age: integer("age").notNull(),
	phone: text("phone").notNull(),

	// Service Info
	hasPlace: hasPlaceEnum("has_place").notNull(),
	servesOnly: servesOnlyEnum("serves_only").notNull(),

	// Location
	address: text("address").notNull(),
	neighborhoodsServed: jsonb("neighborhoods_served")
		.$type<string[]>()
		.default([]),
	nearbyCitiesServed: jsonb("nearby_cities_served")
		.$type<string[]>()
		.default([]),

	// Physical Characteristics
	gender: genderEnum("gender").notNull(),
	genitalia: genitaliaEnum("genitalia").notNull(),
	sexualPreference: sexualPreferenceEnum("sexual_preference").notNull(),
	weight: integer("weight"),
	height: integer("height"),
	ethnicity: ethnicityEnum("ethnicity").notNull(),
	eyeColor: eyeColorEnum("eye_color").notNull(),
	hairStyle: hairStyleEnum("hair_style").notNull(),
	hairLength: hairLengthEnum("hair_length").notNull(),
	footSize: integer("foot_size"),
	hasSilicone: boolean("has_silicone").default(false),
	hasTattoos: boolean("has_tattoos").default(false),
	hasPiercings: boolean("has_piercings").default(false),
	isSmoker: boolean("is_smoker").default(false),

	// Payment & Location
	paymentMethods: jsonb("payment_methods").$type<string[]>().default([]),
	serviceLocations: jsonb("service_locations").$type<string[]>().default([]),
	placeAmenities: jsonb("place_amenities").$type<string[]>().default([]),

	// Working Hours
	workingHours: jsonb("working_hours")
		.$type<{
			monday: { start: string; end: string };
			tuesday: { start: string; end: string };
			wednesday: { start: string; end: string };
			thursday: { start: string; end: string };
			friday: { start: string; end: string };
			saturday: { start: string; end: string };
			sunday: { start: string; end: string };
		}>()
		.notNull(),

	// Profile Status
	isVerified: boolean("is_verified").default(false),
	verificationStatus: verificationStatusEnum("verification_status").default(
		"pending",
	),
	isAvailable: boolean("is_available").default(false),
	isSponsored: boolean("is_sponsored").default(false),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.notNull(),
});
