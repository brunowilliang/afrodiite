'use client';

import { Avatar, Link } from '@heroui/react';
import { HTMLAttributes } from 'react';
import { Icon } from '@/components/core/Icon';
import { Href } from '@/providers/HeroUIProvider';

type Props = {
	name: string;
	avatar: string;
	description?: string;
	linkText?: string;
	href?: Href;
} & HTMLAttributes<HTMLButtonElement>;

export const Profile = ({
	name,
	avatar,
	description,
	linkText,
	href,
	...props
}: Props) => {
	return (
		<button {...props} className="flex items-center gap-2">
			<div className="hidden flex-col items-end gap-0 sm:flex">
				<span className="text-default-600 text-tiny">{description}</span>
				<p className="font-medium text-small">{name}</p>
				{linkText && (
					<Link
						href={href}
						className="flex items-center gap-1 font-normal text-primary text-small transition-all duration-200 hover:text-primary/80"
					>
						{linkText}
						<Icon name="Link" size="14" variant="stroke" />
					</Link>
				)}
			</div>
			<Avatar
				showFallback
				alt={name}
				src={avatar}
				radius="md"
				size="md"
				color="primary"
				className="cursor-pointer transition-all"
				classNames={{
					base: 'bg-primary/20',
				}}
			/>
		</button>
	);
};
