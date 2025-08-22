import {
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Drawer as HeroDrawer,
	useDisclosure,
} from '@heroui/react';

// Hook personalizado para controle imperativo do Drawer
export function useDrawer(defaultOpen = false) {
	const disclosure = useDisclosure({ defaultOpen });

	return disclosure;
}

// Compound component com os sub-componentes
export const Drawer = Object.assign(HeroDrawer, {
	Content: DrawerContent,
	Header: DrawerHeader,
	Body: DrawerBody,
	Footer: DrawerFooter,
});

export default Drawer;
