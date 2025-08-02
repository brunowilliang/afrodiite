import { Link, useNavigate, useRouteContext } from '@tanstack/react-router';
import { Fragment, useRef } from 'react';
import { handleSignOut } from '@/routes/{-$locale}/(public)/login';
import { DashboardMenu } from '@/utils/data';
import { links, useIsActiveRoute } from '@/utils/navigation';
import { useGoBack } from '../core/BackButton';
import { Badge } from '../core/Badge';
import { Button } from '../core/Button';
import { Drawer, type DrawerRef } from '../core/Drawer';
import { Navigation } from '../core/Navigation';
import { Stack } from '../core/Stack';
import { Text } from '../core/Text';

export const Header = () => {
	const { session } = useRouteContext({ from: '__root__' });
	const navigate = useNavigate();

	const drawerRef = useRef<DrawerRef>(null);
	const { goBack } = useGoBack();

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
							<Button variant="unstyled" onClick={goBack} className="h-auto">
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
				<Drawer.Content className="pt-10">
					<Stack>
						<Text>Olá</Text>
						<Text weight="bold">{session?.user?.name}</Text>
					</Stack>

					<Badge>
						<Badge.Text>Menu</Badge.Text>
					</Badge>

					<Navigation className="w-full">
						{links.map((menu, index) => (
							<Fragment key={menu.id}>
								<Navigation.SubMenu.Item
									label={menu.name}
									isActive={useIsActiveRoute(menu.href)}
									onClick={() => {
										drawerRef.current?.close();

										if (menu.isSignOut) {
											handleSignOut(navigate);
										} else if (menu.href) {
											navigate({ to: menu.href });
										}
									}}
								/>
								{index < DashboardMenu.length - 1 && (
									<Navigation.SubMenu.Divider />
								)}
							</Fragment>
						))}
					</Navigation>
				</Drawer.Content>
			</Drawer>
		</>
	);
};
