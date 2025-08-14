import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { Icon } from '../core/Icon';

type Props = {
	selected: Date | undefined;
	onChange: (date: Date | undefined) => void;
	disabled?: boolean;
	placeholder?: string;
	value?: string;
};

export function DatePicker({
	selected,
	onChange,
	disabled,
	placeholder,
	value,
}: Props) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('w-[240px] pl-3 text-left font-normal')}
				>
					{value || placeholder}
					<Icon name="Close" className="ml-auto h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selected}
					onSelect={onChange}
					disabled={disabled}
					captionLayout="dropdown"
				/>
			</PopoverContent>
		</Popover>
	);
}
