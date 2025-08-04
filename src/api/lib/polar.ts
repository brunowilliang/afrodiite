import {
	checkout,
	polar as plugin,
	portal,
	webhooks,
} from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { plans } from '../../../plans';

export const polar = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN_SANDBOX,
	server: 'sandbox',
});

const plan = plans[0];
const premiumPlan = plan.premium[0];
// const boostPrime = sandboxPlans.boosts.prime;
// const boostSupreme = sandboxPlans.boosts.supreme;

export const polarPlugin = plugin({
	client: polar,
	createCustomerOnSignUp: true,
	use: [
		portal(),
		checkout({
			authenticatedUsersOnly: true,
			successUrl: 'http://localhost:3000/dashboard',
			products: [
				{
					productId: premiumPlan.id.sandbox,
					slug: premiumPlan.slug,
				},
			],
		}),
		webhooks({
			secret: process.env.POLAR_WEBHOOK_SECRET_SANDBOX || '',
			// onCustomerCreated: async ({ data }) => {
			// 	console.log('🎯 Webhook customer.created recebido!');
			// 	console.log('Customer data:', data);
			// 	console.log('External ID:', data.externalId);

			// 	if (!data.externalId) {
			// 		console.error('❌ ExternalId não encontrado no webhook!');
			// 		return;
			// 	}

			// 	await db
			// 		.update(users)
			// 		.set({
			// 			polar_customer_id: data.id,
			// 		})
			// 		.where(eq(users.id, data.externalId));

			// 	console.log(
			// 		`✅ Customer ID ${data.id} salvo para user ${data.externalId}`,
			// 	);
			// },
			// onSubscriptionActive: async ({ data }) => {
			// 	console.log('🎯 Webhook subscription.active recebido!');

			// 	const customer = data.customer;

			// 	if (!customer?.externalId) {
			// 		console.log('❌ Sem externalId no customer');
			// 		return;
			// 	}

			// 	console.log(`✅ Ativando perfil para user: ${customer.externalId}`);

			// 	await db
			// 		.update(escortProfiles)
			// 		.set({
			// 			isActive: true,
			// 		})
			// 		.where(eq(escortProfiles.id, customer.externalId));

			// 	console.log('✅ Perfil ativado com sucesso!');
			// },
			// onSubscriptionCanceled: async ({ data }) => {
			// 	console.log('🚫 Webhook subscription.canceled recebido!');

			// 	console.log('user id:', data.customer.externalId);
			// 	console.log('endsAt:', data.endsAt);
			// 	console.log('currentPeriodEnd:', data.currentPeriodEnd);

			// 	// Por enquanto, vamos apenas logar e NÃO desativar o perfil
			// 	console.log(
			// 		`⚠️ Subscription cancelada para customer ${data.customer?.externalId}, mas continua ativa até o fim do período`,
			// 	);
			// },
			// onSubscriptionRevoked: async ({ data }) => {
			// 	console.log('🛑 Webhook subscription.revoked recebido!');
			// 	console.log('Subscription data:', data.customer.externalId);

			// 	const customer = data.customer;

			// 	if (!customer?.externalId) {
			// 		console.log('❌ Sem externalId no customer');
			// 		return;
			// 	}

			// 	console.log(`🛑 Desativando perfil para user: ${customer.externalId}`);

			// 	await db
			// 		.update(escortProfiles)
			// 		.set({
			// 			isActive: false,
			// 		})
			// 		.where(eq(escortProfiles.id, customer.externalId));

			// 	console.log('🛑 Perfil desativado com sucesso!');
			// },
		}),
	],
});
