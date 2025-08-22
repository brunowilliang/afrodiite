import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { Badge } from '@/components/core/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { Icon } from '@/components/core/Icon';
import { ImageCarousel } from '@/components/core/ImageCarousel';
import { Rating } from '@/components/core/Rating';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { api } from '@/lib/api';

export const Route = createFileRoute(
	'/{-$locale}/(public)/escorts/$country/$slug',
)({
	beforeLoad: ({ params }) => {
		const { country } = params;
		if (country !== 'portugal') throw notFound();
	},
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			api.queries.profile.detail.queryOptions({ input: { slug: params.slug } }),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	const { data: profile } = useSuspenseQuery(
		api.queries.profile.detail.queryOptions({ input: { slug } }),
	);
	if (!profile) throw notFound();

	const gallery = profile.gallery ?? [];
	const firstPrice = profile.prices?.[0];
	const priceLabel = firstPrice?.amount
		? `€${firstPrice.amount}/1 hora`
		: 'Consultar';

	return (
		<Container hasHeader>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div className="col-span-8 space-y-4">
					<Card className="gap-1 p-1">
						<ImageCarousel
							images={gallery}
							drag
							openPreview
							width="85%"
							gap="2"
							dotSize="medium"
						/>
						<Stack className="w-full items-start gap-3 p-3">
							<Stack className="items-start">
								<Text
									as="h5"
									weight="light"
									align="center"
									color="textSecondary"
								>
									Acompanhante
								</Text>
								<Stack direction="row" className="centered gap-2">
									<Text as="h3" weight="bold" align="center">
										{profile.artist_name ?? profile.name}
									</Text>
									{profile.is_verified && (
										<Icon
											name="Check"
											variant="bulk"
											size="32"
											color="primary"
										/>
									)}
								</Stack>
							</Stack>
							<Stack
								direction="row"
								className="w-full items-center justify-between"
							>
								<Rating number={3.7} />
								<Text as="p" weight="light" align="center">
									{profile.last_active_at ? 'Ativa recentemente' : 'Nova'}
								</Text>
							</Stack>
						</Stack>
					</Card>

					<Card>
						<Badge>
							<Badge.Text>Sobre Mim</Badge.Text>
						</Badge>
						<Text as="p" weight="light">
							{profile.description ?? 'Sem descrição.'}
						</Text>
					</Card>
				</div>
				<div className="col-span-4">
					<Stack className="gap-4 lg:sticky lg:top-[100px]">
						<Card className="hidden lg:flex">
							<Stack
								direction="row"
								className="items-center justify-between gap-2"
							>
								<Text as="h3" weight="bold">
									{priceLabel}
								</Text>
							</Stack>
							<Stack direction="row" className="w-full gap-2">
								<Button className="w-full">
									<Button.Text>Telefone</Button.Text>
								</Button>
								<Button className="w-full">
									<Button.Text>WhatsApp</Button.Text>
								</Button>
							</Stack>
						</Card>
					</Stack>
				</div>
			</div>
		</Container>
	);
}
