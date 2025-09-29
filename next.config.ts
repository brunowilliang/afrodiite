import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import './src/env';

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactStrictMode: false,
	experimental: {
		globalNotFound: true,
		staleTimes: {
			dynamic: 30, // 5 minutos
			static: 180, // 5 minutos
		},
		useCache: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
// export default nextConfig;
