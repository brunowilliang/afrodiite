import { Button, Input, Select, SelectItem } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/core/Stack';
import { Text } from '@/components/core/Text';
import { PhoneInput } from '@/components/heroui/NumberInput';
import ThemeToggleButton from '@/components/ui/theme-toggle-button';

export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/')({
	component: RouteComponent,
});
function RouteComponent() {
	// const formSchema = z.object({
	// 	username: z.string().min(2, {
	// 		message: 'Username must be at least 2 characters.',
	// 	}),
	// 	date: z.date({
	// 		message: 'Date is required',
	// 	}),
	// });

	// const form = useForm<z.infer<typeof formSchema>>({
	// 	resolver: zodResolver(formSchema),
	// 	defaultValues: {},
	// });

	// function onSubmit(values: z.infer<typeof formSchema>) {
	// 	console.log(values);
	// }

	return (
		<Container hasHeader>
			<Text size="2xl" weight="bold">
				Dashboard
			</Text>
			<ThemeToggleButton />
			<Input label="Search" size="lg" placeholder="Search..." type="search" />
			<PhoneInput label="Phone" placeholder="Phone" />
			<Select aria-label="Search">
				<SelectItem>teste</SelectItem>
				<SelectItem>teste</SelectItem>
			</Select>
			<Button size="lg" color="primary">
				Click me
			</Button>
		</Container>
	);
}
