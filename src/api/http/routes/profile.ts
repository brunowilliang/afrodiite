import {
	and,
	asc,
	count,
	desc,
	eq,
	ilike,
	isNotNull,
	ne,
	or,
} from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/api/db';
import { escortProfiles } from '@/api/db/schemas';
import { authProcedure, publicProcedure } from '@/api/http/middlewares';
import {
	profileSelectSchema,
	profileUpdateSchema,
} from '@/api/utils/types/escort';

export const profileRoutes = {
	get: authProcedure.handler(async ({ context }) => {
		return await db
			.select()
			.from(escortProfiles)
			.where(eq(escortProfiles.id, context.session.user.id))
			.limit(1)
			.then(([profile]) => profile);
	}),
	update: authProcedure
		.input(profileUpdateSchema)
		.handler(async ({ context, input }) => {
			return await db
				.update(escortProfiles)
				.set(input)
				.where(eq(escortProfiles.id, context.session.user.id));
		}),
	list: publicProcedure
		.output(
			z.object({
				data: z.array(
					profileSelectSchema.transform((data) => ({
						...data,
						public_id: String(data.public_id),
					})),
				),
				pagination: z.object({
					page: z.number(),
					limit: z.number(),
					total: z.number(),
					totalPages: z.number(),
					hasNextPage: z.boolean(),
					hasPreviousPage: z.boolean(),
				}),
				filters: z.object({
					district: z.string().optional(),
					city: z.string().optional(),
					name: z.string().optional(),
				}),
			}),
		)
		.input(
			z.object({
				// Filtros
				district: z.string().optional(),
				city: z.string().optional(),
				name: z.string().optional(),

				// Paginação
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(30),

				// Ordenação
				sortBy: z
					.enum(['artist_name', 'name', 'created_at', 'updated_at'])
					.default('artist_name'),
				sortOrder: z.enum(['asc', 'desc']).default('desc'),
			}),
		)
		.handler(async ({ input }) => {
			const { district, city, name, page, limit, sortBy, sortOrder } = input;

			// Construir condições de filtro
			const conditions = [eq(escortProfiles.is_active, true)];

			if (district) {
				conditions.push(ilike(escortProfiles.district, `%${district}%`));
			}

			if (city) {
				conditions.push(ilike(escortProfiles.city, `%${city}%`));
			}

			if (name) {
				const nameCondition = or(
					ilike(escortProfiles.artist_name, `%${name}%`),
					ilike(escortProfiles.name, `%${name}%`),
				);
				if (nameCondition) {
					conditions.push(nameCondition);
				}
			}

			// Aplicar paginação
			const offset = (page - 1) * limit;

			// Query principal
			const baseQuery = db
				.select()
				.from(escortProfiles)
				.where(and(...conditions));

			// Aplicar ordenação
			const orderedQuery = (() => {
				if (sortBy === 'artist_name') {
					return sortOrder === 'asc'
						? baseQuery.orderBy(asc(escortProfiles.artist_name))
						: baseQuery.orderBy(desc(escortProfiles.artist_name));
				}

				if (sortBy === 'name') {
					return sortOrder === 'asc'
						? baseQuery.orderBy(asc(escortProfiles.name))
						: baseQuery.orderBy(desc(escortProfiles.name));
				}

				if (sortBy === 'updated_at') {
					return sortOrder === 'asc'
						? baseQuery.orderBy(asc(escortProfiles.updated_at))
						: baseQuery.orderBy(desc(escortProfiles.updated_at));
				}

				// Default: created_at
				return sortOrder === 'asc'
					? baseQuery.orderBy(asc(escortProfiles.created_at))
					: baseQuery.orderBy(desc(escortProfiles.created_at));
			})();

			const results = await orderedQuery.limit(limit).offset(offset);

			// Contar total de resultados
			const totalCount = await db
				.select({ count: count() })
				.from(escortProfiles)
				.where(and(...conditions));

			const total = totalCount[0]?.count || 0;
			const totalPages = Math.ceil(Number(total) / limit);

			return {
				data: results,
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
				filters: {
					district,
					city,
					name,
				},
			};
		}),
	filters: publicProcedure
		.input(
			z.object({
				district: z.string().optional(),
			}),
		)
		.handler(async ({ input }) => {
			// Buscar distritos disponíveis com contagem
			const districtsQuery = await db
				.select({
					name: escortProfiles.district,
					count: count(),
				})
				.from(escortProfiles)
				.where(
					and(
						eq(escortProfiles.is_active, true),
						isNotNull(escortProfiles.district),
						ne(escortProfiles.district, ''),
					),
				)
				.groupBy(escortProfiles.district)
				.orderBy(asc(escortProfiles.district));

			// Buscar zonas disponíveis com contagem (filtrado por distrito se fornecido)
			const cityConditions = [
				eq(escortProfiles.is_active, true),
				isNotNull(escortProfiles.city),
				ne(escortProfiles.city, ''),
			];

			// Filtrar por distrito se fornecido
			if (input.district) {
				cityConditions.push(eq(escortProfiles.district, input.district));
			}

			const citiesQuery = await db
				.select({
					name: escortProfiles.city,
					count: count(),
				})
				.from(escortProfiles)
				.where(and(...cityConditions))
				.groupBy(escortProfiles.city)
				.orderBy(asc(escortProfiles.city));

			return {
				districts: districtsQuery.map((d) => ({
					name: d.name,
					count: Number(d.count),
				})),
				cities: citiesQuery.map((c) => ({
					name: c.name,
					count: Number(c.count),
				})),
			};
		}),
	detail: publicProcedure
		.output(profileSelectSchema.nullable())
		.input(
			z.object({
				public_id: z.coerce.number().int().min(1).max(2147483647),
			}),
		)
		.handler(async ({ input }) => {
			const [profile] = await db
				.select()
				.from(escortProfiles)
				.where(
					and(
						eq(escortProfiles.public_id, input.public_id),
						eq(escortProfiles.is_active, true),
					),
				)
				.limit(1);

			return profile ?? null;
		}),
};
