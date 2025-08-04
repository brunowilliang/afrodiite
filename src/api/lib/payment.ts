// import {
// 	checkout,
// 	dodopayments,
// 	portal,
// 	webhooks,
// } from '@dodopayments/better-auth';
// import DodoPayments from 'dodopayments';

// export const dodoPayments = new DodoPayments({
// 	bearerToken: process.env.DODO_PAYMENTS_API_KEY || '',
// 	environment: 'test_mode',
// });

// export const dodoPlugin = dodopayments({
// 	client: dodoPayments,
// 	createCustomerOnSignUp: true,
// 	use: [
// 		portal(),
// 		checkout({
// 			products: [
// 				{
// 					productId: 'pdt_OM2QWSAF17LApuBgN7sSQ',
// 					slug: 'premium',
// 				},
// 			],
// 			successUrl: '/dashboard/success',
// 			authenticatedUsersOnly: true,
// 		}),
// 		webhooks({
// 			webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET || '',
// 			onPayload: async (payload) => {
// 				console.log('Received webhook:', payload.type);
// 			},
// 		}),
// 	],
// });
