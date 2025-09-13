import { createFileRoute, Outlet } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Text } from '@/components/core/Text';
// import MeshBackground from '@/components/MeshBackground';

export const Route = createFileRoute('/{-$locale}/(public)/_app')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative min-h-dvh w-full overflow-hidden">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="absolute inset-0 z-0"
				aria-hidden
			>
				{/* <MeshBackground /> */}
			</motion.div>
			<div className="absolute inset-0 z-10">
				<Outlet />
			</div>
			<Text
				as="span"
				className="absolute bottom-4 w-full px-4 text-center text-primary/70"
			>
				Afrodiite.com - Todos os direitos reservados
			</Text>
		</div>
	);
}
