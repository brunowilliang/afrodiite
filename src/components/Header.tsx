import { Link } from '@tanstack/react-router';
import { useRef } from 'react';
import { NavigationMenu } from '@/utils/data';
import { Badge } from './core/Badge';
import { Button } from './core/Button';
import { Drawer, type DrawerRef } from './core/Drawer';
import { Icon } from './core/Icon';
import { Input } from './core/Input';
import { Navigation } from './core/Navigation';
import { Stack } from './core/Stack';

export const Header = () => {
	const drawerRef = useRef<DrawerRef>(null);

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
						className=" h-[70px] items-center justify-between gap-4 rounded-lg bg-accent-10 p-4"
					>
						<Link to="/" viewTransition>
							<img
								src="/assets/logo.svg"
								alt="Afrodiite"
								width={120}
								height={21}
							/>
						</Link>
						<Stack direction="row" className="hidden w-fit gap-4 lg:flex">
							<Button className="w-fit bg-transparent text-primary">
								<Button.Text weight="bold">Anunciar</Button.Text>
							</Button>
							<Button className="w-fit bg-transparent text-primary">
								<Button.Text weight="bold">Área Reservada</Button.Text>
							</Button>
						</Stack>

						<Stack className="flex lg:hidden">
							<Icon name="Menu" size={'32'} onClick={handleMenuClick} />
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Drawer ref={drawerRef} position="right" size={'full'}>
				<Drawer.Content className="pt-14">
					<Stack direction="row" className="w-full gap-4">
						<Button className="w-full">
							<Button.Text>Anunciar</Button.Text>
						</Button>
						<Button className="w-full">
							<Button.Text>Área Reservada</Button.Text>
						</Button>
					</Stack>
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
