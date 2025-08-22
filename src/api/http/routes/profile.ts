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
import { profileUpdateSchema } from '@/api/utils/types/escort';
import { authProcedure, publicProcedure } from '../middlewares/auth';

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
		.input(
			z.object({
				// Filtros
				district: z.string().optional(),
				zone: z.string().optional(),
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
			const { district, zone, name, page, limit, sortBy, sortOrder } = input;

			// Construir condições de filtro
			const conditions = [eq(escortProfiles.is_active, true)];

			if (district) {
				conditions.push(ilike(escortProfiles.district, `%${district}%`));
			}

			if (zone) {
				conditions.push(ilike(escortProfiles.zone, `%${zone}%`));
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
					total: Number(total),
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
				filters: {
					district,
					zone,
					name,
				},
			};
		}),
	filters: publicProcedure
		.input(
			z.object({
				district: z.string().optional(), // Filtrar zonas por distrito
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
			const zoneConditions = [
				eq(escortProfiles.is_active, true),
				isNotNull(escortProfiles.zone),
				ne(escortProfiles.zone, ''),
			];

			// Filtrar por distrito se fornecido
			if (input.district) {
				zoneConditions.push(eq(escortProfiles.district, input.district));
			}

			const zonesQuery = await db
				.select({
					name: escortProfiles.zone,
					count: count(),
				})
				.from(escortProfiles)
				.where(and(...zoneConditions))
				.groupBy(escortProfiles.zone)
				.orderBy(asc(escortProfiles.zone));

			return {
				districts: districtsQuery.map((d) => ({
					name: d.name,
					count: Number(d.count),
				})),
				zones: zonesQuery.map((z) => ({
					name: z.name,
					count: Number(z.count),
				})),
			};
		}),
	detail: publicProcedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			const [profile] = await db
				.select()
				.from(escortProfiles)
				.where(
					and(
						eq(escortProfiles.slug, input.slug),
						eq(escortProfiles.is_active, true),
					),
				)
				.limit(1);

			return profile ?? null;
		}),
};
