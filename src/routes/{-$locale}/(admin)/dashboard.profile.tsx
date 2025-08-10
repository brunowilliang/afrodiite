import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { type ProfileData, profile } from '@/queries/profile';
import type { EscortProfile } from '@/schemas/forms/profile';
import { CharacteristicsTab } from './-dashboard.profile/Characteristics';
import { GalleryTab } from './-dashboard.profile/Gallery';
import { InformationTab } from './-dashboard.profile/Information';
import { LocationTab } from './-dashboard.profile/Location';
import { OfficeHoursTab } from './-dashboard.profile/OfficeHours';
import { PricesTab } from './-dashboard.profile/Prices';
import { ServicesTab } from './-dashboard.profile/Services';

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
	const { session, queryClient } = Route.useRouteContext();

	const { data: profileData } = profile.byId.useQuery({
		variables: {
			id: session?.user.id ?? '',
		},
	});

	const updateProfile = profile.update.useMutation({
		onSuccess: () => {
			toast.success('Profile updated');
			queryClient.invalidateQueries({
				queryKey: profile.byId.getKey(),
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error('Error updating profile', {
				description: error.message,
			});
		},
	});

	return (
		<Container hasHeader>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Meu Perfil
				</Text>

				{tab === 'information' && (
					<InformationTab
						id={session?.user.id ?? ''}
						data={profileData as EscortProfile['information']}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'location' && (
					<LocationTab
						id={session?.user.id ?? ''}
						data={profileData as EscortProfile['location']}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'characteristics' && (
					<CharacteristicsTab
						id={session?.user.id ?? ''}
						data={profileData as EscortProfile['characteristics']}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'schedule' && (
					<OfficeHoursTab
						id={session?.user.id ?? ''}
						data={profileData as EscortProfile['office_hours']}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'prices' && (
					<PricesTab
						id={session?.user.id ?? ''}
						data={profileData as EscortProfile['prices']}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'services' && (
					<ServicesTab
						id={session?.user.id ?? ''}
						data={profileData?.services}
						onSubmit={updateProfile}
					/>
				)}

				{tab === 'gallery' && (
					<GalleryTab
						id={session?.user.id ?? ''}
						data={profileData as ProfileData}
						onSubmit={updateProfile}
					/>
				)}
			</Stack>
		</Container>
	);
}
