import { pgTable, text } from "drizzle-orm/pg-core";
import { serviceLevelEnum } from "../enums";
import { escortProfiles } from "../escortProfiles/tables";

export const escortServices = pgTable("escort_services", {
	id: text("id").primaryKey(),
	escortId: text("escort_id")
		.notNull()
		.references(() => escortProfiles.id, { onDelete: "cascade" }),

	// All services with their levels
	greekKiss: serviceLevelEnum("greek_kiss").default("not_available"),
	feetWorship: serviceLevelEnum("feet_worship").default("not_available"),
	sadomasochism: serviceLevelEnum("sadomasochism").default("not_available"),
	fisting: serviceLevelEnum("fisting").default("not_available"),
	facefuck: serviceLevelEnum("facefuck").default("not_available"),
	handFetish: serviceLevelEnum("hand_fetish").default("not_available"),
	squirt: serviceLevelEnum("squirt").default("not_available"),
	goldenShower: serviceLevelEnum("golden_shower").default("not_available"),
	escortService: serviceLevelEnum("escort_service").default("not_available"),
	travel: serviceLevelEnum("travel").default("not_available"),
	mouthKiss: serviceLevelEnum("mouth_kiss").default("not_available"),
	roleplay: serviceLevelEnum("roleplay").default("not_available"),
	analWithCondom: serviceLevelEnum("anal_with_condom").default("not_available"),
	vaginalWithCondom: serviceLevelEnum("vaginal_with_condom").default(
		"not_available",
	),
	oralWithCondom: serviceLevelEnum("oral_with_condom").default("not_available"),
	masturbation: serviceLevelEnum("masturbation").default("not_available"),
	traditionalMassage: serviceLevelEnum("traditional_massage").default(
		"not_available",
	),
	domination: serviceLevelEnum("domination").default("not_available"),
	fantasyClothes: serviceLevelEnum("fantasy_clothes").default("not_available"),
	sexToysPenetration: serviceLevelEnum("sex_toys_penetration").default(
		"not_available",
	),
	eroticAccessories:
		serviceLevelEnum("erotic_accessories").default("not_available"),
	oralWithoutCondom: serviceLevelEnum("oral_without_condom").default(
		"not_available",
	),
	striptease: serviceLevelEnum("striptease").default("not_available"),
	tantricMassage: serviceLevelEnum("tantric_massage").default("not_available"),
	virtualSex: serviceLevelEnum("virtual_sex").default("not_available"),
	doublePenetration:
		serviceLevelEnum("double_penetration").default("not_available"),
	triplePenetration:
		serviceLevelEnum("triple_penetration").default("not_available"),
	allowsFilming: serviceLevelEnum("allows_filming").default("not_available"),
	voyeurism: serviceLevelEnum("voyeurism").default("not_available"),
	bondage: serviceLevelEnum("bondage").default("not_available"),
	brownShower: serviceLevelEnum("brown_shower").default("not_available"),
	trampling: serviceLevelEnum("trampling").default("not_available"),
});
