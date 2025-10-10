import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: [
					'/',
					'/portugal',
					'/acompanhante/*',
					'/politica-de-privacidade',
					'/politica-de-cookies',
					'/termos-e-condicoes',
				],
				disallow: [
					'/painel',
					'/perfil',
					'/configuracoes',
					'/onboarding',
					'/entrar',
					'/cadastrar',
					'/esqueci-senha',
					'/api/*',
				],
			},
			{
				userAgent: 'GPTBot',
				disallow: ['/'],
			},
			{
				userAgent: 'ChatGPT-User',
				disallow: ['/'],
			},
			{
				userAgent: 'CCBot',
				disallow: ['/'],
			},
			{
				userAgent: 'anthropic-ai',
				disallow: ['/'],
			},
			{
				userAgent: 'Claude-Web',
				disallow: ['/'],
			},
		],
		sitemap: `${process.env.NEXT_PUBLIC_CORS_ORIGIN}/sitemap.xml`,
	};
}
