import { AnimatePresence, motion } from 'motion/react';
import { Slider } from './Slider';

type Props = {
	progress?: number;
};

export const ImageUploading = ({ progress }: Props) => {
	return (
		<AnimatePresence>
			{progress && progress > 0 ? (
				<motion.div
					className="absolute top-0 right-0 bottom-0 left-0 size-full bg-black/60"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="centered flex size-full flex-col gap-2 px-4">
						<Slider progress={progress} />
						<p className="animate-pulse text-sm transition-all duration-100 ease-in-out">
							carregando...
						</p>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
