import { Link, useNavigate, useRouteContext } from '@tanstack/react-router';
import { useRef } from 'react';
import { NavigationMenu } from '@/utils/data';
import { useGoBack } from './core/BackButton';
import { Badge } from './core/Badge';
import { Button } from './core/Button';
import { Drawer, type DrawerRef } from './core/Drawer';
import { Input } from './core/Input';
import { Navigation } from './core/Navigation';
import { Stack } from './core/Stack';
import { Text } from './core/Text';

export const Header = () => {
	const navigate = useNavigate();
	const { session } = useRouteContext({ from: '__root__' });

	const drawerRef = useRef<DrawerRef>(null);
	const { handleGoBack } = useGoBack();

	const handleMenuClick = () => {
		drawerRef.current?.open();
	};

	return (
		<>
			<Stack
				className="fixed top-0 z-50 w-full justify-end bg-gradient-to-b from-background via-background/90 to-background/0"
				style={{
					paddingRight: 'var(--scrollbar-width, 0px)',
				}}
			>
				<Stack container className="py-0 pt-4">
					<Stack
						direction="row"
						className="grid h-[70px] grid-cols-12 gap-4 rounded-lg bg-accent-10 p-4"
					>
						<Stack direction="row" className="col-span-3 justify-start">
							<Button
								variant="unstyled"
								onClick={handleGoBack}
								className="h-auto"
							>
								<Button.Icon name="ArrowLeft" size={'24'} />
							</Button>
						</Stack>

						<Stack direction="row" className="centered col-span-6">
							<Link to="/{-$locale}" viewTransition>
								<img src="/assets/logo.svg" alt="Afrodiite" />
							</Link>
						</Stack>

						<Stack direction="row" className="col-span-3 justify-end">
							<Button
								className="flex h-auto lg:hidden"
								variant="unstyled"
								onClick={handleMenuClick}
							>
								<Button.Icon name="Menu" size={'32'} />
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Drawer ref={drawerRef} position="right" size={'85%'}>
				<Drawer.Content className="pt-14">
					{session ? (
						<Stack className="mb-5 w-full">
							<Text>Olá</Text>
							<Text weight="bold">{session?.user?.name}</Text>
							<Button
								variant="primary"
								className="mt-4"
								onClick={() => navigate({ to: '/{-$locale}/dashboard' })}
							>
								<Button.Text>Ir para o Dashboard</Button.Text>
							</Button>
						</Stack>
					) : (
						<Stack className="w-full gap-4">
							<Button className="w-full">
								<Button.Text>Anunciar</Button.Text>
							</Button>
							<Button
								className="w-full"
								onClick={() => {
									drawerRef.current?.close();
									navigate({ to: '/{-$locale}/login' });
								}}
							>
								<Button.Text>Área Reservada</Button.Text>
							</Button>
						</Stack>
					)}

					<Input placeholder="Pesquisar" colorScheme="secondary" />
					<Badge>
						<Badge.Text className="">Regiões</Badge.Text>
					</Badge>
					<Navigation>
						{NavigationMenu.map((item) => (
							<Navigation.Item key={item.id} label={item.name}>
								<Navigation.SubMenu>
									{item.cities.map((city) => (
										<Navigation.SubMenu.Item
											key={city.id}
											label={city.name}
											href={city.href}
											badge={city.badge}
										/>
									))}
								</Navigation.SubMenu>
							</Navigation.Item>
						))}
					</Navigation>
				</Drawer.Content>
			</Drawer>
		</>
	);
};
