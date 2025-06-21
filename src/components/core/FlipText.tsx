"use client";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	words: string[];
	duration?: number;
	className?: string;
	prefix?: string;
	suffix?: string;
};

export const FlipText = ({
	words,
	duration = 2000,
	className,
	prefix = "",
	suffix = "Portugal",
}: Props) => {
	const [currentWord, setCurrentWord] = useState(words[0]);
	const [isAnimating, setIsAnimating] = useState<boolean>(false);

	const startAnimation = useCallback(() => {
		const currentIndex = words.indexOf(currentWord);
		const nextIndex = (currentIndex + 1) % words.length;
		const word = words[nextIndex];
		setCurrentWord(word);
		setIsAnimating(true);
	}, [currentWord, words]);

	useEffect(() => {
		if (!isAnimating) {
			const timer = setTimeout(() => {
				startAnimation();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [isAnimating, duration, startAnimation]);

	return (
		<span className={cn("relative inline-block text-left", className)}>
			{prefix && <span className="text-lg text-text-secondary">{prefix}</span>}
			<span className="relative inline-block">
				<AnimatePresence
					mode="wait"
					onExitComplete={() => {
						setIsAnimating(false);
					}}
				>
					<motion.span
						initial={{
							opacity: 0,
							y: 10,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						exit={{
							opacity: 0,
							y: -10,
						}}
						transition={{
							duration: 0.4,
							ease: "easeInOut",
						}}
						className="inline-block text-lg text-text-secondary"
						key={currentWord}
					>
						{currentWord}
					</motion.span>
				</AnimatePresence>
				{suffix && (
					<motion.span
						layout
						transition={{
							duration: 0.5,
							ease: [0.25, 0.1, 0.25, 1],
						}}
						className="whitespace-nowrap text-lg text-text-secondary"
						style={{ display: "inline-block" }}
					>
						&nbsp;{suffix}
					</motion.span>
				)}
			</span>
		</span>
	);
};
