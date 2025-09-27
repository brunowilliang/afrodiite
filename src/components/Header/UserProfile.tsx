'use client';

import { useRouter } from 'next/navigation';
import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Dropdown } from '@/components/core/Dropdown';
import { Icon } from '@/components/core/Icon';
import { Profile } from '@/components/core/Profile';
import { toast } from '@/components/core/Toast';
import { api } from '@/lib/orpc';

type Props = {
	profile?: IProfile.Select;
};

export function UserProfile({ profile }: Props) {
	const router = useRouter();

	const onSubmitSignOut = async () => {
		const { error } = await api.auth.signOut();
		if (error) {
			toast.error(error.message ?? 'Erro ao fazer logout');
			return;
		}
		toast.success('Logout realizado com sucesso');
		router.refresh();
	};

	return (
		<div className="flex items-center justify-end">
			{profile && (
				<Dropdown placement="bottom-end" backdrop="opaque">
					<Dropdown.Trigger>
						<Profile
							name={profile?.artist_name ?? '(Sem nome)'}
							description="Acompanhante"
							avatar={profile?.gallery?.[0]?.url ?? ''}
						/>
					</Dropdown.Trigger>
					<Dropdown.Menu>
						<Dropdown.Item
							key="ver-perfil"
							color="default"
							className="px-3 py-2.5 text-default-600 data-[disabled=true]:opacity-40"
							endContent={<Icon name="Link" size="20" />}
							onPress={() => {
								router.push('/perfil');
							}}
						>
							Ver perfil
						</Dropdown.Item>
						<Dropdown.Item
							key="fazer-logout"
							color="danger"
							className="px-3 py-2.5 text-danger data-[disabled=true]:opacity-40"
							onPress={onSubmitSignOut}
							endContent={<Icon name="Logout" size="20" />}
						>
							Fazer logout
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			)}
		</div>
	);
}
