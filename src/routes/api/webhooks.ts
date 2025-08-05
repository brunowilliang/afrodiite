import { Webhooks } from '@polar-sh/tanstack-start';
import { createServerFileRoute } from '@tanstack/react-start/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/api/db';
import { escortProfiles, users } from '@/api/db/schemas';
import { env } from '@/lib/env';

const SubscriptionSchema = z.object({
	customerId: z.string(),
	id: z.string(),
	status: z.string(),
});

const activateProfile = async (customerId: string) => {
	try {
		console.log('🔄 Ativando perfil para customer:', customerId);

		// Buscar usuário pelo polar_customer_id
		const user = await db
			.select()
			.from(users)
			.where(eq(users.polar_customer_id, customerId))
			.limit(1);

		if (!user || user.length === 0) {
			console.error('❌ Usuário não encontrado para customer_id:', customerId);
			return { success: false, error: 'User not found' };
		}

		const userId = user[0].id;

		// Ativar o perfil do escort
		await db
			.update(escortProfiles)
			.set({
				isActive: true,
				updatedAt: new Date(),
			})
			.where(eq(escortProfiles.id, userId));

		console.log('✅ Perfil ativado para usuário:', userId);
		return { success: true, userId, customerId };
	} catch (error) {
		console.error('❌ Erro ao ativar perfil:', error);
		throw error;
	}
};

const deactivateProfile = async (customerId: string) => {
	try {
		console.log('🔄 Desativando perfil para customer:', customerId);

		// Buscar usuário pelo polar_customer_id
		const user = await db
			.select()
			.from(users)
			.where(eq(users.polar_customer_id, customerId))
			.limit(1);

		if (!user || user.length === 0) {
			console.error('❌ Usuário não encontrado para customer_id:', customerId);
			return { success: false, error: 'User not found' };
		}

		const userId = user[0].id;

		// Desativar o perfil do escort
		await db
			.update(escortProfiles)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(escortProfiles.id, userId));

		console.log('✅ Perfil desativado para usuário:', userId);
		return { success: true, userId, customerId };
	} catch (error) {
		console.error('❌ Erro ao desativar perfil:', error);
		throw error;
	}
};

export const ServerRoute = createServerFileRoute('/api/webhooks').methods({
	GET: async () => {
		console.log('🔍 GET request to webhooks endpoint');
		return new Response('Webhooks endpoint is working!', { status: 200 });
	},
	POST: Webhooks({
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		onPayload: async (payload) => {
			console.log('🔄 Webhook payload received:', payload.type);

			try {
				if (payload.type === 'subscription.created') {
					console.log('🔄 Subscription created:', payload.data);

					// Validar payload
					const subscriptionData = SubscriptionSchema.parse(payload.data);

					// Ativar perfil
					await activateProfile(subscriptionData.customerId);
				}

				if (payload.type === 'subscription.revoked') {
					console.log('🔄 Subscription revoked:', payload.data);

					// Validar payload
					const subscriptionData = SubscriptionSchema.parse(payload.data);

					// Desativar perfil
					await deactivateProfile(subscriptionData.customerId);
				}

				console.log('✅ Webhook processado com sucesso');
			} catch (error) {
				console.error('❌ Erro ao processar webhook:', error);
			}
		},
	}),
});
