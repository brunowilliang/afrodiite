import type { ComponentProps } from 'react';
import { useStyled } from 'use-styled';

export type IconProps = ComponentProps<typeof Icon>;

export const Icon = useStyled('i', {
	base: {
		className: 'hgi',
	},
	variants: {
		variant: {
			stroke: {
				className: 'hgi-stroke',
			},
			solid: {
				className: 'hgi-solid',
			},
			bulk: {
				className: 'hgi-bulk',
			},
		},
		size: {
			'12': { className: 'text-[12px]' },
			'14': { className: 'text-[14px]' },
			'16': { className: 'text-[16px]' },
			'18': { className: 'text-[18px]' },
			'20': { className: 'text-[20px]' },
			'24': { className: 'text-[24px]' },
			'32': { className: 'text-[32px]' },
		},
		color: {
			primary: { className: 'text-primary' },
			textPrimary: { className: 'text-text-primary' },
			textSecondary: { className: 'text-text-secondary' },
		},
		name: {
			User: { className: 'hgi-user' },
			ArrowUp: { className: 'hgi-arrow-up-01' },
			ArrowDown: { className: 'hgi-arrow-down-01' },
			ArrowLeft: { className: 'hgi-arrow-left-01' },
			ArrowRight: { className: 'hgi-arrow-right-01' },
			Check: { className: 'hgi-checkmark-badge-02' },
			CheckSquare: { className: 'hgi-checkmark-square-02' },
			Star: { className: 'hgi-star' },
			Filter: { className: 'hgi-preference-horizontal' },
			Menu: { className: 'hgi-menu-03' },
			Cancel: { className: 'hgi-cancel-01' },
			CancelSquare: { className: 'hgi-cancel-square' },
			Search: { className: 'hgi-search-01' },
			Home: { className: 'hgi-home-01' },
			Clock: { className: 'hgi-clock-01' },
			Euro: { className: 'hgi-euro' },
			Upload: { className: 'hgi-upload-04' },
			ImageUpload: { className: 'hgi-image-upload' },
			ImagesAlbum: { className: 'hgi-album-02' },
			Loading: { className: 'hgi-loading-03 animate-spin' },
			Eye: { className: 'hgi-view' },
			EyeOff: { className: 'hgi-view-off' },
			Sun: { className: 'hgi-sun-01' },
			Moon: { className: 'hgi-moon-02' },
			Stars: { className: 'hgi-stars' },
			Idea: { className: 'hgi-ai-idea' },
			Info: { className: 'hgi-information-circle' },
			Refresh: { className: 'hgi-arrow-reload-horizontal' },
			Anonymous: { className: 'hgi-anonymous' },
			Link: { className: 'hgi-link-square-02' },
			AddComment: { className: 'hgi-comment-add-01' },
			VerticalDots: { className: 'hgi-more-vertical' },
			HorizontalDots: { className: 'hgi-more-horizontal' },
			Dashboard: { className: 'hgi-dashboard-square-03' },
			Profile: { className: 'hgi-profile' },
			Location: { className: 'hgi-location-05' },
			ClockSquare: { className: 'hgi-time-01' },
			MoneyBag: { className: 'hgi-money-bag-01' },
			Diamond: { className: 'hgi-diamond-02' },
			Services: { className: 'hgi-add-to-list' },
			Gallery: { className: 'hgi-album-02' },
			Logout: { className: 'hgi-logout-square-01' },
			SideBarRight: { className: 'hgi-sidebar-right-01' },
			SideBarLeft: { className: 'hgi-sidebar-left-01' },
			Settings: { className: 'hgi-settings-05' },
			Reviews: { className: 'hgi-star-square' },
		},
	},
	defaultVariants: {
		variant: 'stroke',
		size: '24',
	},
});
