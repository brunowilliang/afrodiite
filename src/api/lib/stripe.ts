// import { stripe } from '@better-auth/stripe';
// import Stripe from 'stripe';
// import { env } from '@/lib/env';

// export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
// 	apiVersion: '2025-07-30.basil',
// });

// export const stripePlugin = stripe({
// 	stripeClient,
// 	stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
// 	createCustomerOnSignUp: true,
// 	subscription: {
// 		enabled: true,
// 		plans: [
// 			{
// 				name: 'premium',
// 				priceId: 'price_1RsnojBnGb6BkxW7TV1Ijzfa',
// 			},
// 		],
// 	},
// });
