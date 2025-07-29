import { Link } from '@tanstack/react-router';
import { useRef } from 'react';
import { Badge } from './core/Badge';
import { Drawer, type DrawerRef } from './core/Drawer';
import { Header as Component } from './core/Header';
import { Icon } from './core/Icon';
import { Stack } from './core/Stack';
import { Text } from './core/Text';

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
						<Icon name="Menu" size={'32'} onClick={handleMenuClick} />
					</Stack>
				</Stack>
			</Stack>

			<Drawer ref={drawerRef} position="right">
				<Text onClick={() => drawerRef.current?.close()}>Fechar</Text>
				<Badge>
					<Badge.Text className="">Regiões</Badge.Text>
				</Badge>

				<Component.Navigation className="w-full">
					<Component.Navigation.Item label="Porto" />
					<Component.Navigation.Item isActive label="Porto" />

					<Component.Navigation.SubMenu>
						<Component.Navigation.SubMenu.Item label="Porto" badge="84" />
						<Component.Navigation.SubMenu.Item label="Porto" badge="84" />
					</Component.Navigation.SubMenu>

					<Component.Navigation.Item label="Porto" />
				</Component.Navigation>
			</Drawer>
		</>
	);
};
