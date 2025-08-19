import { useMemo } from 'react';

export type StepColor = 'success' | 'primary' | 'default';

export type StepState = {
	index: number; // zero-based index
	isCompleted: boolean;
	isActive: boolean;
	isLocked: boolean;
	color: StepColor;
	disabled: boolean;
};

/**
 * useOnboardingStep
 * Derives onboarding step states from a boolean array of completed steps.
 * - currentStep: first incomplete step (1-based)
 * - stepsState: state and color per step
 */
export function useOnboardingStep(
	totalSteps: number,
	completedSteps: boolean[],
): {
	currentStep: number;
	stepsState: StepState[];
} {
	const normalizedCompleted = useMemo(() => {
		const arr: boolean[] = Array.from(
			{ length: totalSteps },
			(_, i) => !!completedSteps[i],
		);
		return arr;
	}, [totalSteps, completedSteps]);

	const currentStep = useMemo(() => {
		const firstIncompleteIndex = normalizedCompleted.findIndex((c) => !c);
		if (firstIncompleteIndex === -1) return Math.max(1, totalSteps); // all done
		return firstIncompleteIndex + 1; // 1-based
	}, [normalizedCompleted, totalSteps]);

	const stepsState = useMemo<StepState[]>(() => {
		return normalizedCompleted.map((isCompleted, idx) => {
			const stepNumber = idx + 1;
			const isActive = stepNumber === currentStep && !isCompleted;
			const isLocked = stepNumber > currentStep;
			const color: StepColor = isCompleted
				? 'success'
				: isActive
					? 'primary'
					: 'default';
			return {
				index: idx,
				isCompleted,
				isActive,
				isLocked,
				color,
				disabled: !isActive, // Somente o passo ativo fica habilitado
			};
		});
	}, [normalizedCompleted, currentStep]);

	return { currentStep, stepsState };
}
