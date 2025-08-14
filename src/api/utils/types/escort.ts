import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { escortProfiles } from '@/api/db/schemas/escort';

export type {
	GalleryItem,
	OfficeHour,
	Price,
} from '@/api/utils/defaults/escort';

export const profileSelectSchema = createSelectSchema(escortProfiles);
export const profileUpdateSchema = createUpdateSchema(escortProfiles);
export const profileInsertSchema = createInsertSchema(escortProfiles);

export type ProfileSelect = z.infer<typeof profileSelectSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type ProfileInsert = z.infer<typeof profileInsertSchema>;
