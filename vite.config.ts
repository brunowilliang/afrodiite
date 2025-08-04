import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	server: {
		port: 3000,
		allowedHosts: ['afrodiite.com', 'a091a35e7107.ngrok-free.app'],
	},
	plugins: [
		tsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
		tanstackStart({
			customViteReactPlugin: true,
			target: 'vercel',
		}),
		viteReact(),
	],
});
