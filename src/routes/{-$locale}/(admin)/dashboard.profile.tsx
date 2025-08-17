import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Icon } from '@/components/core/Icon';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Badge } from '@/components/heroui/Badge';
import { CharacteristicsTab } from './-dashboard.profile/Characteristics';
import { GalleryTab } from './-dashboard.profile/Gallery';
import { InformationTab } from './-dashboard.profile/Information';
import { LocationTab } from './-dashboard.profile/Location';
import { OfficeHoursTab } from './-dashboard.profile/OfficeHours';
import { PricesTab } from './-dashboard.profile/Prices';
import { ServicesTab } from './-dashboard.profile/Services';
// import { toast } from 'sonner';
// import { profile } from '@/queries/profile';
// import { CharacteristicsTab } from './-dashboard.profile/Characteristics';
// import { GalleryTab } from './-dashboard.profile/Gallery';
// import { InformationTab } from './-dashboard.profile/Information';
// import { LocationTab } from './-dashboard.profile/Location';
// import { OfficeHoursTab } from './-dashboard.profile/OfficeHours';
// import { PricesTab } from './-dashboard.profile/Prices';
// import { ServicesTab } from './-dashboard.profile/Services';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/profile')({
	component: RouteComponent,
	validateSearch: z.object({
		tab: z
			.enum([
				'information',
				'location',
				'characteristics',
				'schedule',
				'prices',
				'services',
				'gallery',
			])
			.default('information'),
	}),
});

function RouteComponent() {
	const { tab } = Route.useSearch();
	// const router = useRouter();
	// const { session } = Route.useRouteContext();

	// const updateProfile = useMutation(
	// 	api.queries.profile.update.mutationOptions(),
	// );

	// const handleSubmit = (values: Partial<ProfileUpdate>) => {
	// 	updateProfile.mutateAsync(
	// 		{
	// 			id: session?.user.id,
	// 			...values,
	// 		},
	// 		{
	// 			onSuccess: () => {
	// 				toast.success('Profile updated');
	// 				router.invalidate();
	// 			},
	// 			onError: (error) => {
	// 				console.error(error);
	// 				toast.error('Error updating profile', {
	// 					description: error.message,
	// 				});
	// 			},
	// 		},
	// 	);
	// };

	return (
		<Container>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Meu Perfil
				</Text>
				{tab === 'information' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Informações
						</Badge>
						<InformationTab />
					</Stack>
				)}
				{tab === 'location' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Localização
						</Badge>
						<LocationTab />
					</Stack>
				)}
				{tab === 'characteristics' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Características
						</Badge>
						<CharacteristicsTab />
					</Stack>
				)}
				{tab === 'schedule' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Horários
						</Badge>
						<OfficeHoursTab />
					</Stack>
				)}
				{tab === 'prices' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Preços
						</Badge>
						<PricesTab />
					</Stack>
				)}
				{tab === 'services' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Serviços
						</Badge>
						<ServicesTab />
					</Stack>
				)}
				{tab === 'gallery' && (
					<Stack className="gap-5">
						<Badge>
							<Icon name="Stars" variant="bulk" size="20" />
							Galeria
						</Badge>
						<GalleryTab />
					</Stack>
				)}
			</Stack>
		</Container>
	);
}
