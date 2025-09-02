import { DateInputProps, DateInput as HeroDateInput } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';

type Props = DateInputProps & {};

export const DateInput = ({ value, onChange, ...props }: Props) => {
	return (
		<I18nProvider locale="pt-PT">
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
		</I18nProvider>
	);
};
