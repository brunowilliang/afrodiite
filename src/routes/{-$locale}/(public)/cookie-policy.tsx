import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';
import CookiePolicy from '@/components/mdx/pages/cookie-policy.mdx';

export const Route = createFileRoute('/{-$locale}/(public)/cookie-policy')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container className="gap-6 py-15">
			<CookiePolicy />
		</Container>
	);
}
