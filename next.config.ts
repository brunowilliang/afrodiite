import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import './src/env';

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactStrictMode: false,
	experimental: {
		globalNotFound: true,
		staleTimes: {
			dynamic: 30, // 30 segundos
			static: 180, // 3 minutos
		},
		useCache: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	// ✅ Configurar externals para dependências problemáticas
	serverExternalPackages: ['@libsql/hrana-client'],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
// export default nextConfig;
