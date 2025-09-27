import { init } from '@paralleldrive/cuid2';

export const createAuthId = init({
	random: Math.random,
	length: 15,
	fingerprint: 'afrodiite-auth-id',
});
