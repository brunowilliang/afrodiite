import z from 'zod';
import { DAYS, SLOTS } from '@/api/utils/defaults/escort';
import type { Day, Slot } from '@/api/utils/types/escort';

// Characteristics
export const characteristicsZ = z.object({
	gender: z.string().min(1),
	age: z.coerce.number().min(18).max(100),
	height: z.coerce.number().min(1).max(250),
	weight: z.coerce.number().min(1),
	hair_color: z.string().min(1),
	eye_color: z.string().min(1),
	sexual_preference: z.string().min(1),
	ethnicity: z.string().min(1),
	silicone: z.boolean(),
	tattoos: z.boolean(),
	piercings: z.boolean(),
	smoker: z.boolean(),
	languages: z.string().min(1),
});

// Office hours (single day shape without the "day" key)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const officeHourZ = z.object({
	is_available: z.boolean(),
	start: z.string().regex(timeRegex),
	end: z.string().regex(timeRegex),
});

// Price (single slot shape without the "slot" key)
export const priceZ = z.object({
	is_available: z.boolean(),
	amount: z.number().min(0),
	currency: z.literal('EUR'),
});

const priceWithRuleZ = priceZ.superRefine((val, ctx) => {
	if (val.is_available && (val.amount ?? 0) <= 0) {
		ctx.addIssue({
			code: 'custom',
			message: 'Quando ativo, o valor deve ser maior que 0.',
			path: ['amount'],
		});
	}
});

// Information
export const informationZ = z.object({
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

// Location
export const locationZ = z.object({
	country: z.string().min(1).default('Portugal'),
	state: z.string().min(1),
	city: z.string().min(1),
	neighborhood: z.string().min(1),
});

// Office hours object by day (with start<end business rule)
const officeDayWithCheckZ = officeHourZ.superRefine((val, ctx) => {
	if (!val.is_available) return;
	if ((val.start ?? '') >= (val.end ?? '')) {
		ctx.addIssue({
			code: 'custom',
			message: 'Hora de início deve ser menor que a hora de fim',
			path: ['end'],
		});
	}
});

export const officeHoursByDayZ = z
	.object(
		Object.fromEntries(
			(DAYS as readonly Day[]).map((d) => [d, officeDayWithCheckZ]),
		) as Record<Day, typeof officeDayWithCheckZ>,
	)
	.superRefine((val, ctx) => {
		const anyActive = (
			Object.values(val) as Array<z.infer<typeof officeDayWithCheckZ>>
		).some((v) => !!v.is_available);
		if (!anyActive) {
			// Anexa o erro na primeira chave para melhor UX
			const firstDay = (DAYS as readonly Day[])[0];
			ctx.addIssue({
				code: 'custom',
				message: 'Ative pelo menos um dia para salvar os horários.',
				path: [firstDay, 'is_available'],
			});
			// E também na raiz para garantir que o resolver marque o form como inválido
			ctx.addIssue({
				code: 'custom',
				message: 'Ative pelo menos um dia para salvar os horários.',
				path: [],
			});
		}
	});

// Prices object by slot
export const pricesBySlotZ = z
	.object(
		Object.fromEntries(
			(SLOTS as readonly Slot[]).map((s) => [s, priceWithRuleZ]),
		) as Record<Slot, typeof priceWithRuleZ>,
	)
	.superRefine((val, ctx) => {
		const anyValid = (
			Object.values(val) as Array<z.infer<typeof priceWithRuleZ>>
		).some((v) => !!v.is_available && (v.amount ?? 0) > 0);
		if (!anyValid) {
			const firstSlot = (SLOTS as readonly Slot[])[0];
			ctx.addIssue({
				code: 'custom',
				message: 'Pelo menos um item deve estar ativo.',
				path: [firstSlot, 'amount'],
			});
		}
	});
