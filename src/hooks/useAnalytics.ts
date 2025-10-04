'use client';

import { useCallback, useEffect } from 'react';
import { orpc } from '@/lib/orpc/client';

type EventType = 'profile_view' | 'whatsapp_click' | 'phone_click';

type Profile = {
	id: string;
	public_id: string | number | null;
};

export const useAnalytics = (profile: Profile | null) => {
	const getSessionKey = () => `analytics_events_${profile?.id}`;

	if (!profile?.id) {
		return { trackEvent: () => {} };
	}

	const hasEventBeenTracked = (eventType: EventType) => {
		if (typeof window === 'undefined') return true;
		const key = getSessionKey();
		const data = sessionStorage.getItem(key);
		if (!data) return false;
		const events = JSON.parse(data);
		return events[eventType] === true;
	};

	const markEventAsTracked = (eventType: EventType) => {
		if (typeof window === 'undefined') return;
		const key = getSessionKey();
		const data = sessionStorage.getItem(key);
		const events = data ? JSON.parse(data) : {};
		events[eventType] = true;
		sessionStorage.setItem(key, JSON.stringify(events));
	};

	const unmarkEventAsTracked = (eventType: EventType) => {
		if (typeof window === 'undefined') return;
		const key = getSessionKey();
		const data = sessionStorage.getItem(key);
		if (!data) return;
		const events = JSON.parse(data);
		delete events[eventType];
		sessionStorage.setItem(key, JSON.stringify(events));
	};

	const getEventData = (eventType: EventType) => ({
		escort_id: profile.id,
		public_id: profile.public_id?.toString() || '',
		event_type: eventType,
		device: (/mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop') as
			| 'mobile'
			| 'desktop',
	});

	// Auto-track profile view on mount
	useEffect(() => {
		if (hasEventBeenTracked('profile_view')) return;

		// Mark BEFORE making request to prevent duplicates
		markEventAsTracked('profile_view');

		const trackProfileView = async () => {
			try {
				await orpc.analytics.track(getEventData('profile_view'));
			} catch (error) {
				// If fails, unmark so it can retry later
				unmarkEventAsTracked('profile_view');
				console.error('Failed to track profile view:', error);
			}
		};

		trackProfileView();
	}, [profile.id]);

	const trackEvent = useCallback(
		async (eventType: 'whatsapp_click' | 'phone_click') => {
			if (hasEventBeenTracked(eventType)) return;

			// Mark BEFORE making request to prevent duplicates
			markEventAsTracked(eventType);

			try {
				await orpc.analytics.track(getEventData(eventType));
			} catch (error) {
				// If fails, unmark so user can retry
				unmarkEventAsTracked(eventType);
				console.error(`Failed to track ${eventType}:`, error);
			}
		},
		[profile.id],
	);

	return { trackEvent };
};
