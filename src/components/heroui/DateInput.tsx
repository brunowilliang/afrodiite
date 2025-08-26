import { DateInputProps, DateInput as HeroDateInput } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';

type Props = DateInputProps & {};

export const DateInput = ({ value, onChange, ...props }: Props) => {
	return (
		<HeroDateInput 
			{...props}
			maxValue={today(getLocalTimeZone())}
			granularity="day"
			value={value}
			onChange={(date) => {
				if (!date) {
					onChange?.(date);
					return;
				}
				onChange?.(date);
			}}
		/>
	);
};
