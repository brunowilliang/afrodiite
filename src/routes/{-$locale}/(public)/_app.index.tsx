import { Button } from '@heroui/react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Text } from '@/components/core/Text';

export const Route = createFileRoute('/{-$locale}/(public)/_app/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const router = useRouter();
	return (
		<div className="centered mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-4 overflow-hidden px-4">
			<img src="/assets/logo.svg" className="w-32" alt="Afrodiite" />
			<div className="my-10 flex flex-col gap-1">
				<Text as="h4" weight="light" className="text-center">
					Algo intenso está se aproximando!
				</Text>
				<Text as="h3" weight="normal" className="text-center">
					Em breve, o lugar mais excitante do país será revelado...
				</Text>
			</div>

			{session ? (
				<Button
					onPress={() => router.navigate({ to: '/{-$locale}/dashboard' })}
					color="primary"
					variant="flat"
				>
					Ir para o dashboard
				</Button>
			) : (
				<Button
					onPress={() =>
						router.navigate({
							to: '/{-$locale}/sign-in',
						})
					}
					color="primary"
					variant="flat"
				>
					Realize seu cadastro
				</Button>
			)}

			<Button
				onPress={() =>
					router.navigate({
						to: '/{-$locale}/escorts/$country',
						params: { country: 'portugal' },
					})
				}
				color="primary"
				variant="flat"
			>
				Descubra as acompanhantes
			</Button>

			{/* <Input
				isClearable
				classNames={{
					label: 'text-black/50 dark:text-white/90',
					input: [
						'bg-transparent',
						'text-black/90 dark:text-white/90',
						'placeholder:text-default-700/50 dark:placeholder:text-white/60',
					],
					innerWrapper: 'bg-transparent',
					inputWrapper: [
						'shadow-sm',
						'bg-default-200/30',
						'dark:bg-default/30',
						'backdrop-blur-xl',
						'backdrop-saturate-200',
						'hover:bg-default-200/40',
						'dark:hover:bg-default/40',
						'group-data-[focus=true]:bg-default-200/40',
						'dark:group-data-[focus=true]:bg-default/40',
						'cursor-text!',
					],
				}}
				label="Pesquisar"
				placeholder="Pesquise por região ou pela cidade"
				radius="lg"
			/> */}
		</div>
	);
}
