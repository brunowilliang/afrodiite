// import { Skeleton as HeroUiSkeleton, SkeletonProps } from '@heroui/skeleton';
// import { tv } from '@heroui/theme';
// import { cn } from '@/utils/cn';

import { Skeleton as HeroUiSkeleton } from '@heroui/react';
import { ComponentProps } from 'react';
import { useStyled } from 'use-styled';

// const skeletonBase = tv({
// 	base: 'bg-gray-200 before:bg-gradient-to-r before:from-transparent before:via-gray-300 before:to-transparent rounded-md',
// });

// export const Skeleton = ({ className, ...props }: SkeletonProps) => {
// 	return (
// 		<HeroUiSkeleton className={cn(skeletonBase(), className)} {...props} />
// 	);
// };

export const Skeleton = useStyled(HeroUiSkeleton, {
	base: {
		className:
			'rounded-md bg-gray-200 before:bg-gradient-to-r before:from-transparent before:via-gray-300 before:to-transparent',
	},
});

export type SkeletonProps = ComponentProps<typeof Skeleton>;
