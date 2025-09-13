import {
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Drawer as HeroDrawer,
	useDisclosure,
} from '@heroui/react';
import { useStyled } from 'use-styled';

// Hook personalizado para controle imperativo do Drawer
export function useDrawer(defaultOpen = false) {
	const disclosure = useDisclosure({ defaultOpen });

	return disclosure;
}

const DrawerRoot = useStyled(HeroDrawer, {
	base: {
		placement: 'left',
		size: 'xs',
		className: 'bg-background',
		children: null,
		classNames: {
			backdrop: 'bg-black/20',
		},
		backdrop: 'blur',
	},
});

// Compound component com os sub-componentes
export const Drawer = Object.assign(DrawerRoot, {
	Content: DrawerContent,
	Header: DrawerHeader,
	Body: DrawerBody,
	Footer: DrawerFooter,
});

export default Drawer;
