import { z } from 'zod';
import { db } from '@/api/database';
import { escortProfiles } from '@/api/database/schemas';
import { stripeClient } from './auth.server';

const CreateSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
});

type CreateProfile = z.infer<typeof CreateSchema>;

export const createUserProfile = async (user: CreateProfile) => {
	try {
		console.log('🔄 Criando profile para usuário:', user.id);

		await db.insert(escortProfiles).values({
			id: user.id,
			name: user.name,
		});

		console.log('✅ Profile criado');

		return {
			success: true,
			profileId: user.id,
		};
	} catch (error) {
		console.error('❌ Erro ao criar profile completo:', error);
		throw error;
	}
};

const DeleteSchema = z.object({
	stripeCustomerId: z.string(),
});

type DeleteUser = z.infer<typeof DeleteSchema>;

export const deleteCustomer = async (data: DeleteUser) => {
	console.log('🔄 Deletando customer do Stripe:', data.stripeCustomerId);

	const customer = await stripeClient.customers.del(data.stripeCustomerId);

	if (!customer) {
		throw new Error('Failed to delete customer');
	}

	return {
		success: true,
		deletedCustomerId: data.stripeCustomerId,
	};
};
