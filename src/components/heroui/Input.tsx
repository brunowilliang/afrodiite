import {
	Input as HeroInput,
	NumberInput as HeroNumberInput,
	Switch as HeroSwitch,
	Textarea as HeroTextarea,
	InputProps,
	TimeInput,
} from '@heroui/react';
import { useMemo, useState } from 'react';
import { useSlot, useStyled } from 'use-styled';
import { Icon, type IconProps } from '@/components/core/Icon';
import { cn } from '@/utils/cn';
import { AutoComplete } from './AutoComplete';
import { DateInput as HeroDateInput } from './DateInput';
import { PhoneInput as HeroPhoneInput } from './PhoneInput';
import { Select } from './Select';
import { UploadDropzone } from './UploadFile';

type Props = InputProps & {
	leftIcon?: IconProps;
	rightIcon?: IconProps;
};

export function HeroInputRoot({ leftIcon, rightIcon, ...props }: Props) {
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
			type={computedType}
			startContent={startContent}
			endContent={endContent}
		/>
	);
}

export const InputRoot = useStyled(HeroInputRoot, {
	base: {
		size: 'md',
		variant: 'flat',
		radius: 'sm',
		classNames: {
			label: cn('text-foreground/50', 'group-data-[disabled=true]:opacity-50'),
			input: cn('group-data-[disabled=true]:opacity-50'),
			description: cn(
				'text-foreground/50',
				'group-data-[disabled=true]:opacity-50',
			),
			inputWrapper: cn(
				'group-data-[invalid=true]:!border-2',
				'group-data-[invalid=true]:!border-danger',
				'group-data-[invalid=true]:!bg-danger/5',
			),
		},
	},
	variants: {
		customVariant: {
			transparent: {
				classNames: {
					label: 'text-black/50 dark:text-white/90',
					input: [
						'bg-transparent',
						'text-black/90 dark:text-white/90',
						'placeholder:text-default-700/50 dark:placeholder:text-white/60',
					],
					innerWrapper: 'bg-transparent',
					inputWrapper: [
						'shadow-sm',
						'bg-default-200/30',
						'dark:bg-default/30',
						'backdrop-blur-xl',
						'backdrop-saturate-200',
						'hover:bg-default-200/40',
						'dark:hover:bg-default/40',
						'group-data-[focus=true]:bg-default-200/40',
						'dark:group-data-[focus=true]:bg-default/40',
						'group-data-[invalid=true]:!border-2',
						'group-data-[invalid=true]:!border-danger/20',
						'group-data-[invalid=true]:!bg-danger/20',
						'cursor-text!',
					],
				},
			},
		},
	},
});

export const Number = useStyled(HeroNumberInput, {
	base: {
		size: 'md',
		variant: 'flat',
		radius: 'sm',
		classNames: {
			label: cn('text-foreground/50', 'group-data-[disabled=true]:opacity-50'),
			input: cn('group-data-[disabled=true]:opacity-50'),
			description: cn(
				'text-foreground/50',
				'group-data-[disabled=true]:opacity-50',
			),
			inputWrapper: cn(
				'group-data-[invalid=true]:!border-2',
				'group-data-[invalid=true]:!border-danger',
				'group-data-[invalid=true]:!bg-danger/5',
			),
		},
	},
});

export const TextArea = useStyled(HeroTextarea, {
	base: {
		variant: 'flat',
		radius: 'sm',
		minRows: 10,
		maxRows: 15,
		classNames: {
			label: cn('text-foreground/50', 'group-data-[disabled=true]:opacity-50'),
			input: cn('group-data-[disabled=true]:opacity-50'),
			description: cn(
				'text-foreground/50',
				'group-data-[disabled=true]:opacity-50',
			),
			inputWrapper: cn(
				'group-data-[invalid=true]:!border-2',
				'group-data-[invalid=true]:!border-danger',
				'group-data-[invalid=true]:!bg-danger/5',
			),
		},
	},
});

export const DateInput = useStyled(HeroDateInput, {
	base: {
		variant: 'flat',
		radius: 'sm',
		classNames: {
			label: cn('text-foreground/50', 'group-data-[disabled=true]:opacity-50'),
			input: cn('group-data-[disabled=true]:opacity-50'),
			description: cn(
				'text-foreground/50',
				'group-data-[disabled=true]:opacity-50',
			),
			inputWrapper: cn(
				'group-data-[invalid=true]:!border-2',
				'group-data-[invalid=true]:!border-danger',
				'group-data-[invalid=true]:!bg-danger/5',
			),
		},
	},
});

export const PhoneInput = useStyled(HeroPhoneInput, {
	base: {
		className: 'w-full',
		defaultCountry: 'PT',
	},
});

export const Time = useStyled(TimeInput, {
	base: {
		size: 'md',
		variant: 'flat',
		radius: 'sm',
		granularity: 'minute',
		hourCycle: 24,
		classNames: {
			label: cn('text-foreground/50', 'group-data-[disabled=true]:opacity-50'),
			input: cn('group-data-[disabled=true]:opacity-50'),
			description: cn(
				'text-foreground/50',
				'group-data-[disabled=true]:opacity-50',
			),
			inputWrapper: cn(
				'group-data-[invalid=true]:!border-2',
				'group-data-[invalid=true]:!border-danger',
				'group-data-[invalid=true]:!bg-danger/5',
			),
		},
	},
});

export const Switch = useStyled(HeroSwitch, {
	base: {
		size: 'sm',
		classNames: {
			wrapper: cn('group-data-[disabled=true]:opacity-40'),
			label: cn(
				'text-md',
				'opacity-40 transition-all duration-350',
				'group-data-[selected=true]:opacity-100',
				'group-data-[disabled=true]:opacity-40',
			),
		},
	},
});

export const Input = useSlot(InputRoot, {
	TextArea,
	DateInput,
	PhoneInput,
	Number,
	Select,
	AutoComplete,
	Time,
	Switch,
	File: UploadDropzone,
});
