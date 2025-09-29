import type { MDXComponents } from 'mdx/types';
import { Badge } from './components/core/Badge';
import { Card } from './components/core/Card';
import { Stack } from './components/core/Stack';

type SessionProps = {
	badge?: string;
	title?: string;
	subtitle?: string;
};

type CardProps = {
	title?: string;
	children?: React.ReactNode;
};

const components: MDXComponents = {
	Session: ({ badge, title, subtitle }: SessionProps) => {
		return (
			<Stack className="centered gap-1 py-5 text-center">
				<Badge color="primary" variant="flat" size="md" radius="md">
					{badge}
				</Badge>
				<h1 className="mt-2 font-semibold text-3xl text-default-700">
					{title}
				</h1>
				<p className="text-default-600">{subtitle}</p>
			</Stack>
		);
	},
	Card: ({ title, children }: CardProps) => {
		return (
			<Stack className="gap-3">
				{title && (
					<Badge color="primary" variant="flat" size="md" radius="sm">
						{title}
					</Badge>
				)}
				<Card className="p-4" shadow="none">
					<span className="font-light text-default-600 text-small leading-6">
						{children}
					</span>
				</Card>
			</Stack>
		);
	},
};

export function useMDXComponents(): MDXComponents {
	return components;
}
