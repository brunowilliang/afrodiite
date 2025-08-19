import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { escortProfiles } from '@/api/db/schemas';

// Characteristics
export const characteristicsZ = z.object({
	gender: z.string().min(1),
	age: z.coerce
		.number()
		.min(18, {
			error: 'Voce deve ter pelo menos 18 anos',
		})
		.max(100),
	height: z.coerce
		.number({
			error: 'Altura inválida',
		})
		.min(1.0, {
			error: 'Altura deve ser pelo menos 1,00m',
		})
		.max(2.5, {
			error: 'Altura deve ser no máximo 2,50m',
		}),
	weight: z.coerce
		.number({
			error: 'Peso inválido',
		})
		.min(30, {
			error: 'Peso deve ser pelo menos 30kg',
		})
		.max(200, {
			error: 'Peso deve ser no máximo 200kg',
		}),
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

// Information
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

// Location
const locationZ = z.object({
	country: z.string().min(1).default('Portugal'),
	state: z.string().min(1),
	city: z.string().min(1),
	neighborhood: z.string().min(1),
});

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
	country: locationZ.shape.country.optional(),
	district: z.string().min(1).optional(),
	zone: z.string().min(1).optional(),

	// Status fields
	is_active: z.boolean().default(false).optional(),
	is_verified: z.boolean().default(false).optional(),

	// Content fields
	characteristics: characteristicsZ.optional(),
	office_hours: z
		.array(
			z.object({
				day: z.string().min(1),
				is_available: z.boolean(),
				start: z.string().regex(timeRegex),
				end: z.string().regex(timeRegex),
			}),
		)
		.optional(),
	prices: z
		.array(
			z.object({
				slot: z.string().min(1),
				is_available: z.boolean(),
				amount: z.number().min(0).optional(),
				currency: z.literal('EUR').optional(),
			}),
		)
		.optional(),
	services: z.array(z.number()).default([]).optional(),
	gallery: z
		.array(
			z.object({
				id: z.string().min(1),
				path: z.string().min(1),
				url: z.string().url(),
				size: z.number().int().nonnegative(),
				width: z.number().int().nonnegative(),
				height: z.number().int().nonnegative(),
				order: z.number().int().nonnegative(),
				createdAt: z.string().min(1),
			}),
		)
		.default([])
		.optional(),
	links: z.record(z.string(), z.unknown()).default({}).optional(),
});

// const schema = escortProfileSchema.pick({
// 	name: true,
// });

// export const TestComponent = () => {
// 	const form = useForm({
// 		resolver: zodResolver(schema),
// 		mode: 'onChange',
// 		defaultValues: {
// 			name: '',
// 		},
// 	});

// 	const handleSubmit = (values: z.infer<typeof schema>) => {
// 		console.log(values);
// 	};

// 	return (
// 		<Form
// 			validationBehavior="aria"
// 			onSubmit={form.handleSubmit(handleSubmit)}
// 			className="w-full space-y-3"
// 		>
// 			<Controller
// 				control={form.control}
// 				name="name"
// 				render={({ field, fieldState }) => (
// 					<Input
// 						label="Nome"
// 						isRequired
// 						value={field.value}
// 						onValueChange={field.onChange}
// 						onBlur={field.onBlur}
// 						ref={field.ref}
// 						name={field.name}
// 						isInvalid={!!fieldState.error}
// 						errorMessage={fieldState.error?.message}
// 					/>
// 				)}
// 			/>

// 			<Button type="submit">Salvar</Button>
// 		</Form>
// 	);
// };
