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
			height={90}
			className="bg-transparent"
			classNames={{
				wrapper: 'items-end px-0 bg-transparent',
			}}
		>
			<Card
				className="flex h-[calc(90px-20px)] w-full flex-row items-center justify-between bg-default/10 px-3"
				shadow="none"
			>
				<div className="centered flex gap-2">
					<NavbarMenuToggle
						className="h-10 w-10 text-default-600"
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
				className="mx-auto w-full max-w-5xl bg-tranparent p-4 pt-5"
			>
				<MenuTabs
					onTabClick={() => setIsMenuOpen(false)}
					isAuthenticated={isAuthenticated}
				/>
			</NavbarMenu>
		</Navbar>
	);
};
