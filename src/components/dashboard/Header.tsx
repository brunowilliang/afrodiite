import {
	Link,
	type NavigateOptions,
	useNavigate,
	useRouter,
} from '@tanstack/react-router';
import { useRef } from 'react';
import { api } from '@/lib/api';
import { links, useIsActiveRoute } from '@/utils/navigation';
import { useGoBack } from '../core/BackButton';
import { Badge } from '../core/Badge';
import { Button } from '../core/Button';
import { Drawer, type DrawerRef } from '../core/Drawer';
import { Navigation } from '../core/Navigation';
import { Stack } from '../core/Stack';
import { Text } from '../core/Text';

export const Header = () => {
	const router = useRouter();

	const navigate = useNavigate();

	const drawerRef = useRef<DrawerRef>(null);
	const { handleGoBack } = useGoBack();

	const handleMenuClick = () => {
		drawerRef.current?.open();
	};

	type HandlePageProps = {
		href: NavigateOptions['to'];
		search?: NavigateOptions['search'];
		isSignOut?: boolean;
	};

	const handleLogout = async () => {
		await api.auth.signOut();
		router.invalidate();
	};

	const handlePage = ({ href, search, isSignOut }: HandlePageProps) => {
		drawerRef.current?.close();
		if (isSignOut) {
			handleLogout();
		} else {
			navigate({
				to: href,
				search,
			});
		}
	};

	const menuActiveStates = links.map((item) => ({
		id: item.id,
		isMainActive: item.href ? useIsActiveRoute(item.href) : false,
		subMenuActiveStates:
			item.subMenu?.map((subItem) => ({
				id: subItem.id,
				isActive: useIsActiveRoute(subItem.href, subItem.search),
			})) || [],
	}));

	const isSubmenuActive = (itemId: number) => {
		const itemState = menuActiveStates.find((state) => state.id === itemId);
		return itemState?.subMenuActiveStates.some((sub) => sub.isActive) || false;
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
								className="flex h-auto"
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
						{/* <Text weight="bold">{session?.user?.name}</Text> */}
					</Stack>

					<Badge>
						<Badge.Text>Menu</Badge.Text>
					</Badge>

					<Navigation>
						{links.map((item) => {
							if (!item.subMenu || item.subMenu.length === 0) {
								const itemState = menuActiveStates.find(
									(state) => state.id === item.id,
								);
								return (
									<Navigation.SubMenu.Item
										key={item.id}
										label={item.name}
										isActive={itemState?.isMainActive || false}
										onClick={() =>
											handlePage({ href: item.href, isSignOut: item.isSignOut })
										}
									/>
								);
							}

							return (
								<Navigation.Item
									key={item.id}
									label={item.name}
									defaultOpen={isSubmenuActive(item.id)}
								>
									<Navigation.SubMenu>
										{item.subMenu.map((menu) => {
											const itemState = menuActiveStates.find(
												(state) => state.id === item.id,
											);
											const subState = itemState?.subMenuActiveStates.find(
												(sub) => sub.id === menu.id,
											);
											return (
												<Navigation.SubMenu.Item
													key={menu.id}
													label={menu.name}
													isActive={subState?.isActive || false}
													onClick={() =>
														handlePage({ href: menu.href, search: menu.search })
													}
												/>
											);
										})}
									</Navigation.SubMenu>
								</Navigation.Item>
							);
						})}
					</Navigation>
				</Drawer.Content>
			</Drawer>
		</>
	);
};

// import {
// 	Button,
// 	Link,
// 	Navbar,
// 	NavbarBrand,
// 	NavbarContent,
// 	NavbarItem,
// } from '@heroui/react';

// export const AcmeLogo = () => {
// 	return (
// 		<svg fill="none" height="36" viewBox="0 0 32 32" width="36">
// 			<path
// 				clipRule="evenodd"
// 				d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
// 				fill="currentColor"
// 				fillRule="evenodd"
// 			/>
// 		</svg>
// 	);
// };

// export const Header = () => {
// 	return (
// 		<Navbar shouldHideOnScroll>
// 			<NavbarBrand>
// 				<AcmeLogo />
// 				<p className="font-bold text-inherit">ACME</p>
// 			</NavbarBrand>
// 			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
// 				<NavbarItem>
// 					<Link color="foreground" href="#">
// 						Features
// 					</Link>
// 				</NavbarItem>
// 				<NavbarItem isActive>
// 					<Link aria-current="page" href="#">
// 						Customers
// 					</Link>
// 				</NavbarItem>
// 				<NavbarItem>
// 					<Link color="foreground" href="#">
// 						Integrations
// 					</Link>
// 				</NavbarItem>
// 			</NavbarContent>
// 			<NavbarContent justify="end">
// 				<NavbarItem className="hidden lg:flex">
// 					<Link href="#">Login</Link>
// 				</NavbarItem>
// 				<NavbarItem>
// 					<Button as={Link} color="primary" href="#" variant="flat">
// 						Sign Up
// 					</Button>
// 				</NavbarItem>
// 			</NavbarContent>
// 		</Navbar>
// 	);
// };
