// src/api/utils/schemas/escort-forms.ts
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { escortProfiles } from '@/api/database/schemas';
import {
	CharacteristicsSchema,
	GallerySchema,
	OfficeHourSchema,
	PriceSchema,
} from './escort-core';

// Regex para validações
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Estende o schema base com validações de formulário
export const CharacteristicsFormSchema = CharacteristicsSchema.extend({
	gender: z.string().min(1, 'Gênero é obrigatório'),
	age: z.coerce
		.number()
		.min(18, 'Você deve ter pelo menos 18 anos')
		.max(100, 'Idade máxima é 100 anos'),
	height: z.coerce
		.number()
		.min(1.0, 'Altura deve ser pelo menos 1,00m')
		.max(2.5, 'Altura deve ser no máximo 2,50m'),
	weight: z.coerce
		.number()
		.min(30, 'Peso deve ser pelo menos 30kg')
		.max(200, 'Peso deve ser no máximo 200kg'),
	hair_color: z.string().min(1, 'Cor do cabelo é obrigatória'),
	eye_color: z.string().min(1, 'Cor dos olhos é obrigatória'),
	sexual_preference: z.string().min(1, 'Preferência sexual é obrigatória'),
	ethnicity: z.string().min(1, 'Etnia é obrigatória'),
	languages: z.string().min(1, 'Idiomas é obrigatório'),
});

export const OfficeHourFormSchema = OfficeHourSchema.extend({
	start: z.string().regex(timeRegex, 'Hora inválida (HH:MM)'),
	end: z.string().regex(timeRegex, 'Hora inválida (HH:MM)'),
}).refine(
	(data) => {
		const [startH, startM] = data.start.split(':').map(Number);
		const [endH, endM] = data.end.split(':').map(Number);
		const startMinutes = startH * 60 + startM;
		const endMinutes = endH * 60 + endM;
		return endMinutes > startMinutes;
	},
	{
		message: 'Horário de fim deve ser após o início',
	},
);

export const GalleryFormSchema = GallerySchema.extend({
	url: z.url('URL inválida'),
	size: z.number().int().nonnegative('Tamanho deve ser positivo'),
	order: z.number().int().nonnegative('Ordem deve ser positiva'),
});

// Validação de informações pessoais
const informationZ = z.object({
	artist_name: z.string().min(1),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	description: z.string().min(1),
	birthday: z
		.string()
		.trim()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			error: 'Data inválida',
		})
		.superRefine((val, ctx) => {
			const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(val);
			if (!m) return;
			const y = Number(m[1]);
			const mo = Number(m[2]);
			const d = Number(m[3]);
			// Limites simples e validação de data real
			if (y < 1900 || y > 2100) {
				ctx.addIssue({ code: 'custom', message: 'Ano inválido.', path: [] });
				return;
			}
			if (mo < 1 || mo > 12) {
				ctx.addIssue({ code: 'custom', message: 'Mês inválido.', path: [] });
				return;
			}
			const date = new Date(Date.UTC(y, mo - 1, d));
			if (
				date.getUTCFullYear() !== y ||
				date.getUTCMonth() !== mo - 1 ||
				date.getUTCDate() !== d
			) {
				ctx.addIssue({ code: 'custom', message: 'Dia inválido.', path: [] });
			}

			const now = new Date();
			let age = now.getFullYear() - y;
			const nm = now.getMonth() + 1;
			const nd = now.getDate();
			if (nm < mo || (nm === mo && nd < d)) age--;
			if (age < 18) {
				ctx.addIssue({
					code: 'custom',
					message: 'É necessário ter 18 anos ou mais.',
					path: [],
				});
			}
		})
		.nonempty(),
	nationality: z.string().min(1),
	phone: z.string().min(1).max(15, {
		error: 'Informe um número de telefone válido',
	}),
	whatsapp: z.string().min(1).max(15, {
		error: 'Informe um número de telefone válido',
	}),
});

// Schema principal do perfil para formulários
export const escortProfileSchema = createInsertSchema(escortProfiles, {
	// Information fields
	name: z.string().min(1),
	artist_name: informationZ.shape.artist_name.optional(),
	slug: informationZ.shape.slug.optional(),
	description: informationZ.shape.description.optional(),
	birthday: informationZ.shape.birthday.optional(),
	nationality: informationZ.shape.nationality.optional(),
	phone: informationZ.shape.phone.optional(),
	whatsapp: informationZ.shape.whatsapp.optional(),
	email: z.email().optional(),

	// Location fields
	country: z.string().min(1).default('Portugal'),
	district: z.string().min(1).optional(),
	city: z.string().min(1).optional(),

	// Status fields
	is_visible: z.boolean().default(false).optional(),
	is_onboarding_complete: z.boolean().default(false).optional(),

	// Content fields - usando os schemas de formulário
	characteristics: CharacteristicsFormSchema.optional(),
	office_hours: z.array(OfficeHourFormSchema).optional(),
	prices: z
		.array(
			PriceSchema.extend({
				amount: z.number().min(0, 'Valor deve ser positivo').optional(),
				negotiated: z.boolean().optional(),
			}),
		)
		.optional(),
	services: z.array(z.number()).default([]).optional(),
	gallery: z.array(GalleryFormSchema).default([]).optional(),
	links: z.record(z.string(), z.unknown()).default({}).optional(),
});

// Exporta o tipo
export type EscortProfileForm = z.infer<typeof escortProfileSchema>;

// Schemas do perfil para operações no banco
export const profileSelectSchema = createSelectSchema(escortProfiles, {
	public_id: z.coerce.number().optional(),
});
export const profileUpdateSchema = createUpdateSchema(escortProfiles, {
	public_id: z.coerce.number().optional(),
});
export const profileInsertSchema = createInsertSchema(escortProfiles, {
	public_id: z.coerce.number().optional(),
});

export namespace IProfile {
	export type Select = z.infer<typeof profileSelectSchema>;
	export type Update = z.infer<typeof profileUpdateSchema>;
	export type Insert = z.infer<typeof profileInsertSchema>;
}

export type ProfileSelect = IProfile.Select;
export type ProfileUpdate = IProfile.Update;
export type ProfileInsert = IProfile.Insert;
