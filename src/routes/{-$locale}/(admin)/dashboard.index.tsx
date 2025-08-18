import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useRef } from 'react';
import { Container, Stack } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/heroui/Button';
import { Modal, ModalRef } from '@/components/heroui/Modal';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

const steps = [
	{
		id: 1,
		title: 'Crie sua identidade ✨',
		description:
			'Seu nome, telefone, slug e data de nascimento são a base do seu perfil. Escolha detalhes que marquem presença e criem uma conexão instantânea com quem te encontra.',
		buttonText: 'Criar Identidade',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 2,
		title: 'Marque seu território 📍',
		description:
			'Defina a cidade e a região onde você atua. Mostre onde seu brenho acontece e facilite que o público certo chegue até você com apenas um clique.',
		buttonText: 'Definir Localização',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 3,
		title: 'Exiba seu diferencial 🌟',
		description:
			'Gênero, idade, altura, peso — cada detalhe conta uma história. Adicione características que destacam o que te torna único e fazem seu perfil vibrar.',
		buttonText: 'Adicionar Características',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 4,
		title: 'Sincronize o desejo ⏰',
		description:
			'Horários claros mostram quando você está pronta para brilhar. Configure sua agenda para garantir encontros que fluem no ritmo certo, sem desencontros.',
		buttonText: 'Configurar Horários',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 5,
		title: 'Estabeleça seu preço 💸',
		description:
			'Seja transparente com seus valores. Uma tabela de preços clara reflete confiança e deixa evidente que cada momento com você vale cada centavo.',
		buttonText: 'Definir Preços',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 6,
		title: 'Acenda a expectativa 🔥',
		description:
			'Liste os serviços que você oferece com detalhes que despertam interesse. Mostre o que torna cada experiência única e deixe todos curiosos pelo próximo passo.',
		buttonText: 'Listar Serviços',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
	{
		id: 7,
		title: 'Roube a cena 📸',
		description:
			'Fotos são seu cartão de visita. Escolha imagens que param o scroll, provocam um segundo olhar e transformam curiosidade em decisão imediata.',
		buttonText: 'Fazer Upload de Fotos',
		buttonLink: '/{-$locale}/dashboard/profile',
	},
];
export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});
function RouteComponent() {
	const { profile } = Route.useRouteContext();
	const modalRef = useRef<ModalRef>(null);

	const isNonEmpty = (v: unknown): boolean =>
		typeof v === 'string' ? v.trim().length > 0 : Boolean(v);

	// 1) Information
	const informationDone = useMemo(() => {
		return (
			isNonEmpty(profile?.artist_name) &&
			isNonEmpty(profile?.slug) &&
			isNonEmpty(profile?.description) &&
			isNonEmpty(profile?.birthday) &&
			isNonEmpty(profile?.nationality) &&
			isNonEmpty(profile?.phone) &&
			isNonEmpty(profile?.whatsapp)
		);
	}, [profile]);

	// 2) Location (country não conta)
	const locationDone = useMemo(() => {
		return (
			isNonEmpty(profile?.state) &&
			isNonEmpty(profile?.city) &&
			isNonEmpty(profile?.neighborhood)
		);
	}, [profile]);

	// 3) Characteristics
	const characteristicsDone = useMemo(() => {
		const c = profile?.characteristics as Record<string, unknown> | undefined;
		if (!c) return false;
		const requiredKeys = [
			'gender',
			'age',
			'height',
			'weight',
			'eye_color',
			'hair_color',
			'ethnicity',
			'languages',
			'sexual_preference',
			'silicone',
			'tattoos',
			'piercings',
			'smoker',
		];
		return requiredKeys.every((k) => isNonEmpty((c as any)[k]));
	}, [profile]);

	// 4) Office hours: pelo menos 1 dia ativo válido (start < end)
	const officeDone = useMemo(() => {
		const hours = Array.isArray(profile?.office_hours)
			? (profile?.office_hours as Array<{ is_available?: boolean; start?: string; end?: string }>)
			: [];
		return hours.some((h) => {
			if (!h?.is_available) return false;
			if (!isNonEmpty(h.start) || !isNonEmpty(h.end)) return false;
			const s = String(h.start);
			const e = String(h.end);
			return s < e;
		});
	}, [profile]);

	// 5) Prices: pelo menos 1 slot ativo com amount > 0
	const pricesDone = useMemo(() => {
		const prices = Array.isArray(profile?.prices)
			? (profile?.prices as Array<{ is_available?: boolean; amount?: number }>)
			: [];
		return prices.some((p) => Boolean(p?.is_available) && (p?.amount ?? 0) > 0);
	}, [profile]);

	// 6) Services: pelo menos 1
	const servicesDone = useMemo(() => {
		const sv = (profile as any)?.services as unknown;
		if (!Array.isArray(sv)) return false;
		if (sv.length === 0) return false;
		if (typeof sv[0] === 'number') return (sv as number[]).length > 0;
		return (sv as Array<{ id: number; is_available?: boolean }>).some((s) => !!s?.is_available);
	}, [profile]);

	// 7) Gallery: pelo menos 5 fotos
	const galleryDone = useMemo(() => {
		const gallery = Array.isArray(profile?.gallery) ? (profile?.gallery as Array<{ url?: string }>) : [];
		const valid = gallery.filter((g) => typeof g?.url === 'string' && g.url.length > 0);
		return valid.length >= 5;
	}, [profile]);

	const completedSteps = useMemo(
		() => [
			informationDone,
			locationDone,
			characteristicsDone,
			officeDone,
			pricesDone,
			servicesDone,
			galleryDone,
		],
		[
			informationDone,
			locationDone,
			characteristicsDone,
			officeDone,
			pricesDone,
			servicesDone,
			galleryDone,
		],
	);

	const { stepsState } = useOnboardingStep(steps.length, completedSteps);

	return (
		<Container>
			<Stack className="gap-10">
				<Text size="2xl" weight="bold">
					Olá, {profile?.name} 👋
				</Text>
				<Stack className="gap-1">
					<Text size="xl" weight="bold">
						Prepare o seu perfil para destacar 🚀
					</Text>
					<Text size="md" weight="light">
						Em poucos passos, construa um perfil que para o scroll, atrai
						olhares e transforma interesse em ação instantânea.
					</Text>
				</Stack>
				<Stack className="gap-5">
					{steps.map((step, idx) => {
						const s = stepsState[idx];
						return (
							<Alert
								key={step.id}
								color={s.color}
								title={step.title}
								description={step.description}
								variant="faded"
								className={s.isCompleted || s.isActive ? 'opacity-100' : 'opacity-35'}
								classNames={{
									description: 'text-sm font-light',
									title: 'text-lg font-medium',
								}}
								endContent={
									<Button
										color={s.color}
										size="sm"
										variant="flat"
										className="px-10"
										disabled={!s.isActive}
										onPress={() => {
											if (s.isActive) {
												modalRef.current?.open();
											}
										}}
									>
										{step.buttonText}
									</Button>
								}
							/>
						);
					})}
				</Stack>
			</Stack>
			<Modal
				ref={modalRef}
				title="Criar Identidade"
				placement="bottom"
				size="full"
				scrollBehavior="inside"
			>
				<Modal.Content>
					<Modal.Body>
						<Stack className="gap-5">
							<Text size="xl" weight="bold">
								Criar Identidade
							</Text>
							<Text size="md" weight="light">
								Crie sua identidade para começar a usar o sistema.
							</Text>
						</Stack>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</Container>
	);
}
