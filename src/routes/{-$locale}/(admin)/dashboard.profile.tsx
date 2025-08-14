import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { CharacteristicsTab } from './-dashboard.profile/Characteristics';
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
	// const { session, profile } = Route.useRouteContext();

	// const updateProfile = useMutation(
	// 	api.queries.profile.update.mutationOptions({
	// 		onSuccess: () => {
	// 			toast.success('Profile updated');
	// 			router.invalidate();
	// 		},
	// 		onError: (error) => {
	// 			console.error(error);
	// 			toast.error('Error updating profile', {
	// 				description: error.message,
	// 			});
	// 		},
	// 	}),
	// );

	return (
		<Container hasHeader>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Meu Perfil
				</Text>
				{tab === 'information' && <InformationTab />}
				{tab === 'location' && <LocationTab />}
				{tab === 'characteristics' && <CharacteristicsTab />}
				{tab === 'schedule' && <OfficeHoursTab />}
				{tab === 'prices' && <PricesTab />}
				{tab === 'services' && <ServicesTab />}

				{/* {tab === 'information' && (
					<InformationTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'location' && (
					<LocationTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'characteristics' && (
					<CharacteristicsTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'schedule' && (
					<OfficeHoursTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'prices' && (
					<PricesTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'services' && (
					<ServicesTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'gallery' && (
					<GalleryTab
						id={session?.user.id!}
						data={profileData}
						onSubmit={updateProfile}
					/>
				)} */}
			</Stack>
		</Container>
	);
}
