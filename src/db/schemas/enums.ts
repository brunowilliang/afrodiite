import { pgEnum } from "drizzle-orm/pg-core";

// Physical characteristics enums
export const genderEnum = pgEnum("gender", [
	"female",
	"male",
	"trans",
	"non_binary",
]);
export const genitaliaEnum = pgEnum("genitalia", ["vagina", "penis", "both"]);
export const sexualPreferenceEnum = pgEnum("sexual_preference", [
	"heterosexual",
	"homosexual",
	"bisexual",
	"pansexual",
]);
export const ethnicityEnum = pgEnum("ethnicity", [
	"white",
	"mixed",
	"black",
	"asian",
	"indigenous",
]);
export const eyeColorEnum = pgEnum("eye_color", [
	"brown",
	"blue",
	"green",
	"hazel",
	"gray",
]);
export const hairStyleEnum = pgEnum("hair_style", [
	"straight",
	"curly",
	"wavy",
]);
export const hairLengthEnum = pgEnum("hair_length", [
	"short",
	"medium",
	"long",
]);

// Service related enums
export const hasPlaceEnum = pgEnum("has_place", [
	"own_place",
	"motel_only",
	"both",
]);
export const servesOnlyEnum = pgEnum("serves_only", [
	"men",
	"women",
	"both",
	"couples",
]);
export const serviceLevelEnum = pgEnum("service_level", [
	"receive",
	"perform",
	"specialist",
	"not_available",
]);

// Status enums
export const verificationStatusEnum = pgEnum("verification_status", [
	"pending",
	"approved",
	"rejected",
]);

// TypeScript types for better type safety
export type Gender = (typeof genderEnum.enumValues)[number];
export type Genitalia = (typeof genitaliaEnum.enumValues)[number];
export type SexualPreference = (typeof sexualPreferenceEnum.enumValues)[number];
export type Ethnicity = (typeof ethnicityEnum.enumValues)[number];
export type EyeColor = (typeof eyeColorEnum.enumValues)[number];
export type HairStyle = (typeof hairStyleEnum.enumValues)[number];
export type HairLength = (typeof hairLengthEnum.enumValues)[number];
export type HasPlace = (typeof hasPlaceEnum.enumValues)[number];
export type ServesOnly = (typeof servesOnlyEnum.enumValues)[number];
export type ServiceLevel = (typeof serviceLevelEnum.enumValues)[number];
export type VerificationStatus =
	(typeof verificationStatusEnum.enumValues)[number];
