'use client';

import { useCanGoBack, useRouter } from '@tanstack/react-router';

export const useGoBack = () => {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	const goBack = () => {
		if (canGoBack) {
			router.history.back();
		} else {
			router.history.push('/');
		}
	};

	return { goBack };
};
