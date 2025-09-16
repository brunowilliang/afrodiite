import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';
import PrivacyPolicy from '@/components/mdx/pages/privacy-policy.mdx';

export const Route = createFileRoute('/{-$locale}/(public)/privacy-policy')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container className="gap-6 py-15">
			<PrivacyPolicy />
		</Container>
	);
}
