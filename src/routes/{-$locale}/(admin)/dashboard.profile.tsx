import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '@/api/routes';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import type { EscortProfile } from '@/schemas/forms/profile';
import { CharacteristicsTab } from './-Tabs/Characteristics';
import { InformationTab } from './-Tabs/Information';
import { LocationTab } from './-Tabs/Location';

// type TabType = 'information' | 'location' | 'characteristics';

// interface Tab {
// 	id: TabType;
// 	label: string;
// 	icon?: string;
// }

// const TABS: Tab[] = [
// 	{ id: 'information', label: 'Informações' },
// 	{ id: 'location', label: 'Localização' },
// 	{ id: 'characteristics', label: 'Características' },
// ];

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/profile')({
	component: RouteComponent,
	validateSearch: z.object({
		tab: z
			.enum(['information', 'location', 'characteristics'])
			.default('information'),
	}),
});

function RouteComponent() {
	const { profile } = Route.useRouteContext();
	const { tab } = Route.useSearch();

	const updateProfile = api.profile.update();

	// const [activeTab, setActiveTab] = useState<TabType>('information');

	const onSubmit = (data: EscortProfile[keyof EscortProfile]) => {
		console.log('data', data);

		const payload =
			tab === 'characteristics' ? { characteristics: data } : data;

		updateProfile.mutate(
			{
				id: profile.id,
				data: payload as EscortProfile,
			},
			{
				onSuccess: () => {
					toast('Perfil atualizado com sucesso');
				},
				onError: () => {
					toast('Erro ao atualizar perfil');
				},
			},
		);
	};

	return (
		<Container hasHeader>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Meu Perfil
				</Text>

				{/* <Tabs>
					{TABS.map((tab) => (
						<Tabs.Item
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							isActive={activeTab === tab.id}
						>
							<Tabs.Item.Text>{tab.label}</Tabs.Item.Text>
						</Tabs.Item>
					))}
				</Tabs> */}

				{tab === 'information' && (
					<InformationTab
						onSubmit={onSubmit}
						isSubmitting={updateProfile.isPending}
					/>
				)}

				{tab === 'location' && (
					<LocationTab
						onSubmit={onSubmit}
						isSubmitting={updateProfile.isPending}
					/>
				)}

				{tab === 'characteristics' && (
					<CharacteristicsTab
						onSubmit={onSubmit}
						isSubmitting={updateProfile.isPending}
					/>
				)}
			</Stack>
		</Container>
	);
}
