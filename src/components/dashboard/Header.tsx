import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	useDisclosure,
} from '@heroui/react';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { useThemeController } from '@/hooks/useThemeController';
import { api } from '@/lib/api';
import { links } from '@/utils/navigation';
import { Icon } from '../core/Icon';
import { Logo } from '../core/Logo';

export function Header() {
	const router = useRouter();
	const { profile } = useRouteContext({ from: '/{-$locale}' });
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { themeName, setThemeDirect } = useThemeController({
		withTransition: true,
		variant: 'circle-blur',
		start: 'top-left',
	});

	const handleLogout = async () => {
		await api.auth.signOut();
		router.invalidate();
	};

	const profileSubmenu = links.find((l) => l.name === 'Perfil')?.subMenu ?? [];

	return (
		<>
			<Navbar
				shouldHideOnScroll
				isBlurred
				classNames={{
					wrapper: 'max-w-5xl px-4',
				}}
			>
				<NavbarBrand>
					<Logo
						className="cursor-pointer"
						onClick={() => router.navigate({ to: '/{-$locale}/dashboard' })}
					/>
				</NavbarBrand>

				<NavbarContent justify="end">
					<NavbarItem>
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar
									showFallback
									name={profile?.name}
									src={profile?.gallery?.[0]?.url}
									radius="md"
									isBordered
									color="primary"
								/>
							</DropdownTrigger>

							<DropdownMenu
								aria-label="Profile Actions"
								variant="flat"
								selectedKeys={['2']}
							>
								<DropdownItem
									showDivider
									aria-label="Dashboard"
									key="dashboard"
									onPress={() =>
										router.navigate({ to: '/{-$locale}/dashboard' })
									}
								>
									Dashboard
								</DropdownItem>
								<DropdownSection
									title="Perfil"
									showDivider
									className="font-light text-foreground/50"
								>
									{profileSubmenu.map((s) => (
										<DropdownItem
											key={s.id}
											aria-label={s.name}
											onPress={() =>
												router.navigate({
													to: s.href,
													search: s.search,
												})
											}
										>
											{s.name}
										</DropdownItem>
									))}
								</DropdownSection>
								<DropdownSection
									title="Theme"
									showDivider
									className="font-light text-foreground/50"
								>
									<DropdownItem
										aria-label="Light Theme"
										key="theme-light"
										onPress={() => setThemeDirect('light')}
										color={themeName === 'light' ? 'primary' : 'default'}
										className={
											themeName === 'light' ? 'text-primary' : 'text-foreground'
										}
										classNames={{
											title: 'flex items-center gap-2',
										}}
									>
										<Icon name="Sun" size="20" />
										<span>Light</span>
									</DropdownItem>
									<DropdownItem
										aria-label="Dark Theme"
										key="theme-dark"
										onPress={() => setThemeDirect('dark')}
										color={themeName === 'dark' ? 'primary' : 'default'}
										className={themeName === 'dark' ? 'text-primary' : ''}
										classNames={{
											title: 'flex items-center gap-2',
										}}
									>
										<Icon name="Moon" size="20" />
										<span>Dark</span>
									</DropdownItem>
								</DropdownSection>
								<DropdownSection
									title="Ações"
									className="font-light text-foreground/50"
								>
									<DropdownItem
										aria-label="Logout"
										key="logout"
										className="text-danger"
										color="danger"
										onPress={handleLogout}
									>
										Sair
									</DropdownItem>
								</DropdownSection>
							</DropdownMenu>
						</Dropdown>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			{/* <Drawer
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="xs"
				placement="left"
			>
				<Drawer.Content>
					{(onClose) => (
						<>
							<Drawer.Header className="flex flex-col gap-1">
								Drawer Title
							</Drawer.Header>
							<Drawer.Body>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Nullam pulvinar risus non risus hendrerit venenatis.
									Pellentesque sit amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Nullam pulvinar risus non risus hendrerit venenatis.
									Pellentesque sit amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Magna exercitation reprehenderit magna aute tempor cupidatat
									consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
									incididunt cillum quis. Velit duis sit officia eiusmod Lorem
									aliqua enim laboris do dolor eiusmod. Et mollit incididunt
									nisi consectetur esse laborum eiusmod pariatur proident Lorem
									eiusmod et. Culpa deserunt nostrud ad veniam.
								</p>
							</Drawer.Body>
							<Drawer.Footer>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</Drawer.Footer>
						</>
					)}
				</Drawer.Content>
			</Drawer> */}
		</>
	);
}
