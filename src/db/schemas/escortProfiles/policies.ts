import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

import * as escortProfilesTables from "./tables";

export const escortProfileSelectPolicy = pgPolicy(
	"escort_profile_select_policy",
	{
		for: "select",
		to: authenticatedRole,
		using: sql`true`, // Public read access
	},
).link(escortProfilesTables.escortProfiles);

export const escortProfileInsertPolicy = pgPolicy(
	"escort_profile_insert_policy",
	{
		for: "insert",
		to: authenticatedRole,
		withCheck: sql`(${authUid}) = ${escortProfilesTables.escortProfiles.userId}`,
	},
).link(escortProfilesTables.escortProfiles);

export const escortProfileUpdatePolicy = pgPolicy(
	"escort_profile_update_policy",
	{
		for: "update",
		to: authenticatedRole,
		using: sql`(${authUid}) = ${escortProfilesTables.escortProfiles.userId}`,
		withCheck: sql`(${authUid}) = ${escortProfilesTables.escortProfiles.userId}`,
	},
).link(escortProfilesTables.escortProfiles);

export const escortProfileDeletePolicy = pgPolicy(
	"escort_profile_delete_policy",
	{
		for: "delete",
		to: authenticatedRole,
		using: sql`(${authUid}) = ${escortProfilesTables.escortProfiles.userId}`,
	},
).link(escortProfilesTables.escortProfiles);
