import { sql } from "drizzle-orm";
// RLS Policies for Auth Domain - Safe to edit
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";

// Import auth tables from this domain
import * as authTables from "./tables";

// RLS Policies for User table
export const userSelectPolicy = pgPolicy("user_select_policy", {
	for: "select",
	to: authenticatedRole,
	using: sql`(${authUid}) = ${authTables.users.id}`,
}).link(authTables.users);

export const userUpdatePolicy = pgPolicy("user_update_policy", {
	for: "update",
	to: authenticatedRole,
	using: sql`(${authUid}) = ${authTables.users.id}`,
	withCheck: sql`(${authUid}) = ${authTables.users.id}`,
}).link(authTables.users);

// RLS Policies for Session table
export const sessionPolicy = pgPolicy("session_policy", {
	for: "all",
	to: authenticatedRole,
	using: sql`(${authUid}) = ${authTables.sessions.userId}`,
	withCheck: sql`(${authUid}) = ${authTables.sessions.userId}`,
}).link(authTables.sessions);

// RLS Policies for Account table
export const accountPolicy = pgPolicy("account_policy", {
	for: "all",
	to: authenticatedRole,
	using: sql`(${authUid}) = ${authTables.accounts.userId}`,
	withCheck: sql`(${authUid}) = ${authTables.accounts.userId}`,
}).link(authTables.accounts);

// RLS Policies for Verification table
export const verificationPolicy = pgPolicy("verification_policy", {
	for: "all",
	to: authenticatedRole,
	using: sql`(${authUid}) = ${authTables.verifications.identifier}`,
	withCheck: sql`(${authUid}) = ${authTables.verifications.identifier}`,
}).link(authTables.verifications);
