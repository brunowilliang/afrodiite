'use client';

import {
	CardBody,
	CardFooter,
	CardHeader,
	Card as HeroCard,
	CardProps as HeroCardProps,
} from '@heroui/react';
import { useSlot } from 'use-styled';

export type CardProps = HeroCardProps;

export const Card = useSlot(HeroCard, {
	Body: CardBody,
	Footer: CardFooter,
	Header: CardHeader,
});
