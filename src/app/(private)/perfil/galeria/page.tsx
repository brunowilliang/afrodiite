import { Stack } from '@/components/core/Stack';
import { getProfile } from '@/lib/server/profile-cache';
import { Badge } from '../../components/Badge';
import { Gallery } from '../../components/Gallery';

export default async function Galeria() {
	const profile = await getProfile();

	return (
		<Stack className="gap-5">
			<Badge icon="Gallery" label="Imagens" />
			<Gallery profile={profile} />
		</Stack>
	);
}
