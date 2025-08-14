type Props = {
	progress: number;
};

export const Slider = ({ progress }: Props) => {
	return (
		<div className="h-4 w-full rounded-full bg-white/50">
			<div
				className="h-full rounded-full bg-primary transition-all duration-300"
				style={{ width: `${progress * 100}%` }}
			/>
		</div>
	);
};
