import { Input as HeroInput, InputProps } from '@heroui/react';
import { useMemo, useState } from 'react';
import { Icon, type IconProps } from '@/components/core/Icon';
import { cn } from '@/utils/cn';

type Props = InputProps & {
	leftIcon?: IconProps;
	rightIcon?: IconProps;
};

export function Input({ leftIcon, rightIcon, ...props }: Props) {
	const isPasswordField = props.type === 'password';
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const toggleVisibility = () => setShowPassword((v) => !v);

	const computedType = useMemo<NonNullable<Props['type']>>(
		() =>
			isPasswordField
				? showPassword
					? 'text'
					: 'password'
				: (props.type ?? 'text'),
		[isPasswordField, showPassword, props.type],
	);

	const startContent = useMemo(() => {
		const left = leftIcon ? <Icon {...leftIcon} /> : null;
		if (left && props.startContent)
			return (
				<>
					{left}
					{props.startContent}
				</>
			);
		return left ?? props.startContent;
	}, [leftIcon, props.startContent]);

	const endContent = useMemo(() => {
		const right = rightIcon ? <Icon {...rightIcon} /> : null;
		if (isPasswordField && !props.endContent) {
			return (
				<>
					{right}
					<button
						type="button"
						aria-label="toggle password visibility"
						aria-pressed={showPassword}
						onClick={toggleVisibility}
						className="px-1 text-foreground/60 outline-transparent hover:text-foreground focus:outline-solid"
					>
						<Icon name={showPassword ? 'EyeOff' : 'Eye'} />
					</button>
				</>
			);
		}
		if (right && props.endContent)
			return (
				<>
					{right}
					{props.endContent}
				</>
			);
		return right ?? props.endContent;
	}, [rightIcon, isPasswordField, props.endContent, showPassword]);

	return (
		<HeroInput
			{...props}
			size="md"
			variant="flat"
			type={computedType}
			startContent={startContent}
			endContent={endContent}
			classNames={{
				label: 'text-foreground/50',
				inputWrapper: cn(
					'group-data-[invalid=true]:!border-2 group-data-[invalid=true]:!border-danger',
					'group-data-[invalid=true]:!bg-danger/5',
				),
			}}
		/>
	);
}
