'use client';

import { Navbar, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { UserProfile } from '@/components/Header/UserProfile';
import { Logo } from '@/components/Logo';
import { MenuTabs } from '../Header/Menu';

type Props = {
	isAuthenticated?: boolean;
};

export const Header = ({ isAuthenticated }: Props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();

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
				{isAuthenticated ? (
					<UserProfile />
				) : (
					<Button
						variant="flat"
						onClick={() => {
							setIsMenuOpen(false);
							router.push('/entrar');
						}}
					>
						Entrar
					</Button>
				)}
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
				<MenuTabs
					onTabClick={() => setIsMenuOpen(false)}
					isAuthenticated={isAuthenticated}
				/>
			</NavbarMenu>
		</Navbar>
	);
};
