import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';
import type { Href } from './providers/HeroUIProvider';

type PublicRoute = {
	path: Href;
	whenAuthenticated: 'redirect' | 'next';
};

const publicRoutes = [
	{ path: '/', whenAuthenticated: 'next' },
	{ path: '/cadastrar', whenAuthenticated: 'redirect' },
	{ path: '/entrar', whenAuthenticated: 'redirect' },
	{ path: '/esqueci-senha', whenAuthenticated: 'redirect' },
	{ path: '/termos-e-condicoes', whenAuthenticated: 'next' },
	{ path: '/politica-de-privacidade', whenAuthenticated: 'next' },
	{ path: '/politica-de-cookies', whenAuthenticated: 'next' },
	{ path: '/portugal', whenAuthenticated: 'next' },
	{ path: '/acompanhante/[public_id]/[slug]', whenAuthenticated: 'next' },
] as PublicRoute[];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/' as Href;

export function middleware(request: NextRequest) {
	const session = getSessionCookie(request);

	const path = request.nextUrl.pathname;

	// ✅ Rotas que sempre permitem acesso (prefix matching)
	if (path.startsWith('/acompanhante/')) {
		return NextResponse.next();
	}

	const isPublicRoute = publicRoutes.find((route) => route.path === path);

	// const authToken = false; // por enquanto!

	if (!session && isPublicRoute) {
		return NextResponse.next();
	}

	if (!session && !isPublicRoute) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

		return NextResponse.redirect(redirectUrl);
	}

	if (
		session &&
		isPublicRoute &&
		isPublicRoute.whenAuthenticated === 'redirect'
	) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = '/painel';

		return NextResponse.redirect(redirectUrl);
	}

	if (session && !isPublicRoute) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
