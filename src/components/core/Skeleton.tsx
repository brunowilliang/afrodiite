import { Skeleton as HeroUiSkeleton } from '@heroui/react';
import { ComponentProps } from 'react';
import { useStyled } from 'use-styled';
export const Skeleton = useStyled(HeroUiSkeleton, {
	base: {
		className:
			'rounded-md bg-gray-200 before:bg-gradient-to-r before:from-transparent before:via-gray-300 before:to-transparent',
	},
});

export type SkeletonProps = ComponentProps<typeof Skeleton>;
