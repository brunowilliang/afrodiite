import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/api/db';
import { polar } from '@/api/lib/polar';
import { escortProfiles, users } from '../db/schemas';

// Schema para validação dos dados do usuário
const CreateSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
});

const DeleteSchema = z.object({
	customerId: z.string().optional().nullable(),
});

type CreateProfile = z.infer<typeof CreateSchema>;
type DeleteUser = z.infer<typeof DeleteSchema>;

export const createUserProfile = async (data: CreateProfile) => {
	// Valida os dados de entrada
	const user = CreateSchema.parse(data);
	try {
		console.log('🔄 Criando profile para usuário:', user.id);

		// 1. Cria o profile do escort
		await db.insert(escortProfiles).values({
			id: user.id,
			name: user.name,
		});

		console.log('✅ Profile criado');

		// 2. Cria o customer no Polar
		const customerResult = await polar.customers.create({
			email: user.email,
			externalId: user.id,
			metadata: {
				name: user.name,
				source: 'afrodiite web',
			},
		});

		if (!customerResult || !customerResult.id) {
			throw new Error('Failed to create Polar customer');
		}

		console.log('✅ Customer criado no Polar:', customerResult.id);

		// 3. Salva o customer_id na tabela de usuários
		await db
			.update(users)
			.set({
				polar_customer_id: customerResult.id,
			})
			.where(eq(users.id, user.id));

		console.log('✅ Customer ID salvo na tabela de usuários');

		return {
			success: true,
			profileId: user.id,
			customerId: customerResult.id,
		};
	} catch (error) {
		console.error('❌ Erro ao criar profile completo:', error);
		throw error;
	}
};

export const deleteCustomer = async (data: DeleteUser) => {
	// Valida os dados de entrada
	const user = DeleteSchema.parse(data);

	try {
		console.log('🔄 Deletando customer do Polar:', data.customerId);

		// 2. Deleta o customer no Polar (se existir)
		if (user.customerId) {
			try {
				await polar.customers.delete({
					id: user.customerId,
				});
				console.log('✅ Customer deletado no Polar:', user.customerId);
			} catch (polarError) {
				console.error('⚠️ Erro ao deletar customer no Polar:', polarError);
			}
		}

		return {
			success: true,
			deletedCustomerId: user.customerId,
		};
	} catch (error) {
		console.error('❌ Erro ao deletar customer do Polar:', error);
		throw error;
	}
};
