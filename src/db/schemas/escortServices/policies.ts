import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

import * as escortServicesTables from "./tables";

export const escortServicesSelectPolicy = pgPolicy(
	"escort_services_select_policy",
	{
		for: "select",
		to: authenticatedRole,
		using: sql`true`, // Public read access
	},
).link(escortServicesTables.escortServices);

export const escortServicesInsertPolicy = pgPolicy(
	"escort_services_insert_policy",
	{
		for: "insert",
		to: authenticatedRole,
		withCheck: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortServicesTables.escortServices.escortId} 
    and user_id = (${authUid})
  )`,
	},
).link(escortServicesTables.escortServices);

export const escortServicesUpdatePolicy = pgPolicy(
	"escort_services_update_policy",
	{
		for: "update",
		to: authenticatedRole,
		using: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortServicesTables.escortServices.escortId} 
    and user_id = (${authUid})
  )`,
		withCheck: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortServicesTables.escortServices.escortId} 
    and user_id = (${authUid})
  )`,
	},
).link(escortServicesTables.escortServices);

export const escortServicesDeletePolicy = pgPolicy(
	"escort_services_delete_policy",
	{
		for: "delete",
		to: authenticatedRole,
		using: sql`exists(
    select 1 from escort_profiles 
    where id = ${escortServicesTables.escortServices.escortId} 
    and user_id = (${authUid})
  )`,
	},
).link(escortServicesTables.escortServices);
