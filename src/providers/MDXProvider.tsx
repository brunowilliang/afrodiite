import { MDXProvider as MDXProviderBase } from '@mdx-js/react';

import { Section } from '@/components/mdx/components/Section';

const components = {
	Section,
};

type Props = {
	children: React.ReactNode;
};

export const MDXProvider = ({ children }: Props) => {
	return <MDXProviderBase components={components}>{children}</MDXProviderBase>;
};
