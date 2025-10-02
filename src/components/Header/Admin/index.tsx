'use client';

import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/core/Card';
import { MenuTabs } from '@/components/Header/Admin/Menu';
import { Logo } from '@/components/Logo';
import { Avatar } from './Avatar';

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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
				className="flex h-full w-full flex-row items-center justify-between bg-default-50 px-4"
				shadow="none"
			>
				<div className="centered flex gap-2">
					<NavbarMenuToggle
						className="h-10 w-10 text-default-600 md:hidden"
						aria-label={'Toggle menu'}
					/>
					<Link href="/painel" onClick={() => setIsMenuOpen(false)}>
						<Logo className="h-full cursor-pointer" />
					</Link>
				</div>
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
