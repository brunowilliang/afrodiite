import { useCallback, useEffect, useState } from 'react';
import type { z } from 'zod';
import { TrackSchema } from '@/api/http/routes/analytics';
import { api } from '@/lib/api';

// ✅ Types direto do schema
type TrackInput = z.infer<typeof TrackSchema.input>;
export type AnalyticsEventType = TrackInput['event_type'];
type AnalyticsMetadata = TrackInput['metadata'];

// ✅ Session management
const useUserSession = () => {
	const [sessionId, setSessionId] = useState<string>();

	useEffect(() => {
		let session = sessionStorage.getItem('analytics_session');

		if (!session) {
			session = crypto.randomUUID();
			sessionStorage.setItem('analytics_session', session);
		}

		setSessionId(session);
	}, []);

	return sessionId;
};

// ✅ Hook simples - só trackEvent + auto pageview
export const useAnalytics = (escortId?: string) => {
	const sessionId = useUserSession();

	const trackEvent = useCallback(
		async (eventType: AnalyticsEventType, metadata?: AnalyticsMetadata) => {
			if (!escortId || !sessionId) return;

			// ✅ Proteção anti-spam para clicks (1x por sessão)
			if (eventType === 'whatsapp_click' || eventType === 'phone_click') {
				const clickKey = `clicked_${eventType}_${escortId}`;
				const hasClicked = sessionStorage.getItem(clickKey);

				if (hasClicked) {
					// console.log(
					// 	`Analytics: ${eventType} ignorado (já clicou nesta sessão)`,
					// );
					return;
				}

				sessionStorage.setItem(clickKey, 'true');
			}

			try {
				await api.client.analytics.track({
					escort_id: escortId,
					event_type: eventType,
					user_session: sessionId,
					metadata: {
						...metadata,
						user_agent: navigator.userAgent,
						referrer: document.referrer || undefined,
						device: window.innerWidth < 768 ? 'mobile' : 'desktop',
					},
				});
			} catch (error) {
				console.error('Analytics error:', error);
			}
		},
		[escortId, sessionId],
	);

	// ✅ Auto page view - 1x por sessão
	useEffect(() => {
		if (escortId && sessionId) {
			const viewKey = `viewed_${escortId}`;
			const hasViewed = sessionStorage.getItem(viewKey);

			if (!hasViewed) {
				trackEvent('profile_view');
				sessionStorage.setItem(viewKey, 'true');
			}
		}
	}, [escortId, sessionId, trackEvent]);

	return {
		trackEvent,
		sessionId,
		isReady: Boolean(sessionId),
	};
};
