'use client';

import {
	Alert as HeroAlert,
	AlertProps as HeroAlertProps,
} from '@heroui/react';
import { Button } from '@/components/core/Button';
import { cn } from '@/utils/cn';

type Props = HeroAlertProps & {
	mode?: 'primary' | 'success' | 'warning';
	buttonTitle?: string;
	onPress?: () => void;
	disabled?: boolean;
};

export const Alert = ({
	title,
	description,
	mode = 'primary',
	onPress,
	disabled,
	buttonTitle,
	...props
}: Props) => (
	<HeroAlert
		color={mode}
		variant="faded"
		title={title}
		description={description}
		classNames={{
			base: cn(
				'flex flex-col gap-0 px-4 py-7 text-center md:flex-row md:text-left lg:px-5 lg:py-3',
				disabled && 'opacity-40',
			),
			mainWrapper: 'gap-2 py-2 px-1',
			title: 'text-md font-medium',
			description: 'font-light text-sm',
		}}
		endContent={
			<Button
				color={mode}
				size="sm"
				variant="flat"
				className="px-7"
				onPress={onPress}
				isDisabled={disabled}
			>
				{buttonTitle}
			</Button>
		}
		{...props}
	/>
);
