import { useTheme } from 'next-themes';
import React from 'react';
import type {
	AnimationStart,
	AnimationVariant,
} from '@/components/theme-animations';
import { createAnimation } from '@/components/theme-animations';

type ThemeName = 'light' | 'dark';
type DesiredTheme = ThemeName | 'system';

type ToggleOptions = {
	withTransition?: boolean;
	variant?: AnimationVariant;
	start?: AnimationStart;
	url?: string;
};

export function useThemeController(options?: ToggleOptions): {
	themeName: ThemeName; // usa resolvedTheme
	desiredTheme: DesiredTheme; // valor atual escolhido (light|dark|system)
	toggleTheme: () => void;
	setThemeDirect: (name: DesiredTheme) => void;
} {
	const { theme, resolvedTheme, setTheme } = useTheme();

	const styleId = 'theme-transition-styles';

	const {
		withTransition = true,
		variant = 'circle-blur',
		start = 'top-left',
		url,
	} = options ?? {};

	const themeName: ThemeName = resolvedTheme === 'dark' ? 'dark' : 'light';
	const desiredTheme: DesiredTheme =
		theme === 'dark' || theme === 'light' || theme === 'system'
			? theme
			: 'system';

	const updateStyles = React.useCallback((css: string) => {
		if (typeof window === 'undefined') return;

		let styleElement = document.getElementById(
			styleId,
		) as HTMLStyleElement | null;
		if (!styleElement) {
			styleElement = document.createElement('style');
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}

		styleElement.textContent = css;
	}, []);

	const toggleTheme = React.useCallback(() => {
		const nextTheme: ThemeName = themeName === 'light' ? 'dark' : 'light';

		if (withTransition) {
			const animation = createAnimation(variant, start, url);
			updateStyles(animation.css);
		}

		if (typeof window === 'undefined') {
			setTheme(nextTheme);
			return;
		}

		const switchTheme = () => setTheme(nextTheme);
		const doc = document as Document & {
			startViewTransition?: (callback: () => void) => void;
		};

		if (doc.startViewTransition) {
			doc.startViewTransition(switchTheme);
			return;
		}

		switchTheme();
	}, [themeName, setTheme, withTransition, variant, start, url, updateStyles]);

	const setThemeDirect = React.useCallback(
		(name: DesiredTheme) => {
			// Avoid no-op if already selected
			if (name === 'system' && desiredTheme === 'system') return;
			if ((name === 'light' || name === 'dark') && name === themeName) return;

			const target: DesiredTheme =
				name === 'light' || name === 'dark' || name === 'system'
					? name
					: 'system';

			if (withTransition) {
				const animation = createAnimation(variant, start, url);
				updateStyles(animation.css);
			}

			if (typeof window === 'undefined') {
				setTheme(target);
				return;
			}

			const switchTheme = () => setTheme(target);
			const doc = document as Document & {
				startViewTransition?: (callback: () => void) => void;
			};

			if (doc.startViewTransition) {
				doc.startViewTransition(switchTheme);
				return;
			}

			switchTheme();
		},
		[
			setTheme,
			withTransition,
			variant,
			start,
			url,
			updateStyles,
			desiredTheme,
			themeName,
		],
	);

	return {
		themeName,
		desiredTheme,
		toggleTheme,
		setThemeDirect,
	};
}
