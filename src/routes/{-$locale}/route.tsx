import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
	defaultLocale,
	type Locale,
	type LocaleRouterContext,
	type SupportedLocale,
	supportedLocales,
	validateLocale,
} from '@/i18n/types';

// Função para detectar o idioma preferido do usuário
const getPreferredLocale = (request: Request): SupportedLocale | null => {
	const langHeader = request.headers.get('Accept-Language');
	if (!langHeader) return null;
	const langs = langHeader
		.split(',')
		.map((lang) => lang.split(';')[0].split('-')[0].toLowerCase());
	return (
		supportedLocales.find((supported) => langs.includes(supported)) || null
	);
};

export const Route = createFileRoute('/{-$locale}')({
	// 3. REMOVEMOS a validação com Zod do `parseParams`.
	// A rota agora vai "aceitar" qualquer prefixo, e a validação será feita no beforeLoad.

	// 4. Hook beforeLoad: o lugar ÚNICO para TODA a lógica de locale.
	beforeLoad: ({ params, context, location }) => {
		const { locale } = params;
		const { request } = context as LocaleRouterContext;
		const isServer = typeof window === 'undefined';

		// --- PONTO CRÍTICO DA VALIDAÇÃO ---
		// Se um locale foi passado na URL, mas ele NÃO é um dos que suportamos...
		if (locale && !validateLocale(locale)) {
			// ...nós o removemos da URL e redirecionamos.
			// Ex: /fr/dashboard -> /dashboard
			// A própria lógica do beforeLoad cuidará de redirecionar para /en/dashboard, se necessário, no próximo ciclo.
			const newPathname = location.pathname.replace(`/${locale}`, '') || '/';
			throw redirect({
				to: newPathname,
				search: location.search,
				statusCode: 302, // 302 é "Found", ou redirecionamento temporário. Ideal aqui.
			});
		}

		// Se a URL já tiver um locale VÁLIDO (ex: /en/...), está tudo certo.
		// Retornamos o locale para o contexto da rota.
		if (locale) {
			return {
				locale: locale as Locale,
				isDefaultLocale: locale === defaultLocale,
			};
		}

		// A lógica de redirecionamento para usuários sem locale na URL (só roda no servidor).
		if (isServer && request) {
			const preferredLocale = getPreferredLocale(request);
			if (preferredLocale) {
				// Redireciona para a mesma URL, mas com o prefixo do idioma.
				// Ex: /dashboard -> /en/dashboard
				throw redirect({
					to: location.pathname,
					params: { locale: preferredLocale },
					search: location.search,
				});
			}
		}

		// Se não houve redirecionamento, usamos o idioma padrão.
		return {
			locale: defaultLocale,
			isDefaultLocale: true,
		};
	},

	// 5. O componente simplesmente renderiza as rotas filhas.
	component: Outlet,
});
