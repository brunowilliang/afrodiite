import { IProfile } from '@/api/utils/schemas/escort-forms';
import { Stack } from '@/components/core/Stack';
import { api } from '@/lib/orpc';
import { Badge } from '../components/Badge';
import GalleryForm from '../components/GalleryForm';

export default async function Galeria() {
	const profile = (await api.orpc.profile.get()) as IProfile.Select | undefined;

	return (
		<Stack className="gap-5">
			<Badge icon="Gallery" label="Imagens" />
			<GalleryForm profile={profile} />
		</Stack>
	);
}
