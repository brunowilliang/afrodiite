import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { database } from "@/db";

export type UserRole = "user" | "escort";

export const auth = betterAuth({
	appName: "Moorgana",
	database,
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
	trustedOrigins: [process.env.CORS_ORIGIN || "", "moorgana://"],
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "escort",
				input: false,
				validate: (value: string): boolean => {
					const validRoles: UserRole[] = ["user", "escort"];
					return validRoles.includes(value as UserRole);
				},
			},
		},
	},
	plugins: [nextCookies()],
});
