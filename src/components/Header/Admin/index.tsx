'use client';

import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/core/Card';
import { Input } from '@/components/core/Input';
import { Logo } from '@/components/core/Logo';
import { MenuTabs } from '@/components/Header/Admin/Menu';
import { useProfile } from '@/hooks/useProfile';
import { Avatar } from './Avatar';

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const { profile, updateProfile } = useProfile();

	// Optimistic state for visibility toggle
	const [isVisible, setIsVisible] = useState(profile?.is_visible ?? false);

	// Sync with server state when profile changes
	useEffect(() => {
		setIsVisible(profile?.is_visible ?? false);
	}, [profile?.is_visible]);

	const handleVisibilityToggle = async (value: boolean) => {
		// Optimistic update
		setIsVisible(value);

		try {
			await updateProfile(
				{ is_visible: value },
				{
					toastTitle: value ? 'Perfil Ativado' : 'Perfil Desativado',
				},
			);
		} catch {
			// Rollback on error
			setIsVisible(!value);
		}
	};

	return (
		<Navbar
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
			height={85}
			isBlurred={true}
			className="bg-transparent/50"
			classNames={{
				wrapper: 'items-end px-0 pt-4 bg-transparent',
			}}
		>
			<Card
				className="flex h-full w-full flex-row items-center justify-between gap-4 bg-default-50 px-4"
				shadow="none"
			>
				<div className="centered flex flex-1 justify-start gap-2">
					<NavbarMenuToggle
						className="h-10 w-10 text-default-600 md:hidden"
						aria-label={'Toggle menu'}
					/>
					<Link href="/painel" onClick={() => setIsMenuOpen(false)}>
						<Logo />
					</Link>
				</div>
				<Input.Switch
					size="sm"
					onValueChange={handleVisibilityToggle}
					isSelected={isVisible}
				>
					Perfil Visível
				</Input.Switch>
				<Avatar />
			</Card>

			<NavbarMenu
				motionProps={{
					initial: {
						opacity: 0,
						transform: 'translateY(-100%)',
					},
					animate: {
						opacity: 1,
						transform: 'translateY(0)',
					},
					exit: {
						opacity: 0,
						transform: 'translateY(-100%)',
					},
					transition: {
						type: 'tween',
						duration: 0.4,
						ease: 'easeInOut',
					},
				}}
				className="mx-auto w-full max-w-5xl bg-tranparent px-4 pt-4 lg:px-0"
			>
				<MenuTabs onTabClick={() => setIsMenuOpen(false)} />
			</NavbarMenu>
		</Navbar>
	);
};
