// import { api } from '@/lib/api/client';

// export const upgradeSubscription = async () => {
// 	const result = await api.auth.subscription.upgrade({
// 		plan: 'premium',
// 		successUrl: `${window.location.origin}/dashboard/my-account?success=true`,
// 		cancelUrl: `${window.location.origin}/dashboard/my-account`,
// 	});

// 	return result.data;
// };

// export const cancelSubscription = async (subscriptionId: string) => {
// 	const result = await api.auth.subscription.cancel({
// 		subscriptionId,
// 		returnUrl: `${window.location.origin}/dashboard/my-account`,
// 	});

// 	return result.data;
// };
