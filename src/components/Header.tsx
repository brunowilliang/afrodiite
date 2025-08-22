import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from '@heroui/react';
import { useRouter } from '@tanstack/react-router';
import React from 'react';
import { Logo } from './core/Logo';

export function Header() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const menuItems = [
		'Profile',
		'Dashboard',
		'Activity',
		'Analytics',
		'System',
		'Deployments',
		'My Settings',
		'Team Settings',
		'Help & Feedback',
		'Log Out',
	];

	return (
		<Navbar shouldHideOnScroll isBlurred onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					className="sm:hidden"
				/>
				<NavbarBrand>
					<Logo
						className="cursor-pointer"
						onClick={() => router.navigate({ to: '/{-$locale}' })}
					/>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<Link
						onPress={() => {
							router.navigate({ to: '/{-$locale}/sign-in' });
						}}
					>
						Login
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						onPress={() => {
							router.navigate({ to: '/{-$locale}/sign-in' });
						}}
						variant="flat"
					>
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className="w-full"
							color={
								index === 2
									? 'primary'
									: index === menuItems.length - 1
										? 'danger'
										: 'foreground'
							}
							href="#"
							size="lg"
						>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
