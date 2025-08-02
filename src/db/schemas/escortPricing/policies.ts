import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

import * as escortPricingTables from "./tables";

export const escortPricingSelectPolicy = pgPolicy(
	"escort_pricing_select_policy",
	{
		for: "select",
		to: authenticatedRole,
		using: sql`true`, // Public read access
	},
).link(escortPricingTables.escortPricing);

export const escortPricingInsertPolicy = pgPolicy(
	"escort_pricing_insert_policy",
	{
		for: "insert",
		to: authenticatedRole,
		withCheck: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortPricingTables.escortPricing.escortId} 
    and user_id = (${authUid})
  )`,
	},
).link(escortPricingTables.escortPricing);

export const escortPricingUpdatePolicy = pgPolicy(
	"escort_pricing_update_policy",
	{
		for: "update",
		to: authenticatedRole,
		using: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortPricingTables.escortPricing.escortId} 
    and user_id = (${authUid})
  )`,
		withCheck: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortPricingTables.escortPricing.escortId} 
    and user_id = (${authUid})
  )`,
	},
).link(escortPricingTables.escortPricing);

export const escortPricingDeletePolicy = pgPolicy(
	"escort_pricing_delete_policy",
	{
		for: "delete",
		to: authenticatedRole,
		using: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortPricingTables.escortPricing.escortId} 
    and user_id = (${authUid})
  )`,
	},
).link(escortPricingTables.escortPricing);
