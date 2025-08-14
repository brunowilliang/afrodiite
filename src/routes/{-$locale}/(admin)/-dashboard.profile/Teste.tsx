'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const TesteForm = () => {
	const [step, setStep] = useState(0);
	const totalSteps = 6;

	const form = useForm();

	const { handleSubmit, control, reset } = form;

	const onSubmit = async (formData: unknown) => {
		if (step < totalSteps - 1) {
			setStep(step + 1);
		} else {
			console.log(formData);
			setStep(0);
			reset();

			toast.success('Form successfully submitted');
		}
	};

	const handleBack = () => {
		if (step > 0) {
			setStep(step - 1);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-center">
				{Array.from({ length: totalSteps }).map((_, index) => (
					<div key={index} className="flex items-center">
						<div
							className={cn(
								'h-4 w-4 rounded-full transition-all duration-300 ease-in-out',
								index <= step ? 'bg-primary' : 'bg-primary/30',
								index < step && 'bg-primary',
							)}
						/>
						{index < totalSteps - 1 && (
							<div
								className={cn(
									'h-0.5 w-8',
									index < step ? 'bg-primary' : 'bg-primary/30',
								)}
							/>
						)}
					</div>
				))}
			</div>
			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Multi form</CardTitle>
					<CardDescription>Current step {step + 1}</CardDescription>
				</CardHeader>
				<CardContent>
					{step === 0 && (
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
								<FormField
									key="OheKWQve"
									control={control}
									name="OheKWQve"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome Artístico</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Digite seu nome artístico"
													autoComplete="off"
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="M0pjvAId"
									control={control}
									name="M0pjvAId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Sua URL personalizada"
													autoComplete="off"
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="7h0gMaTu"
									control={control}
									name="7h0gMaTu"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descrição</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Digite uma descrição sobre você"
													className="resize-none"
													rows={5}
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="7WUqtPIX"
									control={control}
									name="7WUqtPIX"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Data de Nascimento</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Data de Nascimento"
													autoComplete="off"
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="loWn20Ny"
									control={control}
									name="loWn20Ny"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nacionalidade</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Digite a sua nacionalidade"
													autoComplete="off"
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="aVI29eLX"
									control={control}
									name="aVI29eLX"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Telefone</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Ex: +351 912 345 678"
													autoComplete="off"
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="bCoWHQu2"
									control={control}
									name="bCoWHQu2"
									render={({ field }) => (
										<FormItem>
											<FormLabel>WhatsApp</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Ex: +351 912 345 678"
													autoComplete="off"
												/>
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<div className="flex justify-between">
									<Button
										type="button"
										className="font-medium"
										size="sm"
										onClick={handleBack}
										disabled={step === 0}
									>
										Back
									</Button>
									<Button type="submit" size="sm" className="font-medium">
										{step === 5 ? 'Submit' : 'Next'}
									</Button>
								</div>
							</form>
						</Form>
					)}

					{step === 1 && (
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
								<FormField
									key="vWtw8Gcx"
									control={control}
									name="vWtw8Gcx"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cidade</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="EasVDPKT"
									control={control}
									name="EasVDPKT"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Estado</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="ZNhPJVPC"
									control={control}
									name="ZNhPJVPC"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bairro</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="46h9ysut"
									control={control}
									name="46h9ysut"
									render={({ field }) => (
										<FormItem>
											<FormLabel>País</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<div className="flex justify-between">
									<Button
										type="button"
										className="font-medium"
										size="sm"
										onClick={handleBack}
										disabled={step === 0}
									>
										Back
									</Button>
									<Button type="submit" size="sm" className="font-medium">
										{step === 5 ? 'Submit' : 'Next'}
									</Button>
								</div>
							</form>
						</Form>
					)}

					{step === 2 && (
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
								<FormField
									key="T96TXtjS"
									control={control}
									name="T96TXtjS"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Select o seu gênero</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="UPWY2Gxs"
									control={control}
									name="UPWY2Gxs"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Digite sua idade</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="TcK3yPPM"
									control={control}
									name="TcK3yPPM"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Digite a cor dos olhos</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="VyYVo5Rj"
									control={control}
									name="VyYVo5Rj"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Digite a cor do cabelo</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="BbXf0qtY"
									control={control}
									name="BbXf0qtY"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Digite a sua altura</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="vTSum3Ey"
									control={control}
									name="vTSum3Ey"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Digite o seu peso</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="OMbqaWQa"
									control={control}
									name="OMbqaWQa"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Etnia</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="IHN6J0w2"
									control={control}
									name="IHN6J0w2"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Idiomas que você fala</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="IhOj5U4r"
									control={control}
									name="IhOj5U4r"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Preferência sexual</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="d53D6Dxw"
									control={control}
									name="d53D6Dxw"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tem silicone?</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="RIig1Yyq"
									control={control}
									name="RIig1Yyq"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tem tatuagens?</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="EJZ9WW9i"
									control={control}
									name="EJZ9WW9i"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tem piercing?</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<FormField
									key="gM7EhxOd"
									control={control}
									name="gM7EhxOd"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Fumante?</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<div className="flex justify-between">
									<Button
										type="button"
										className="font-medium"
										size="sm"
										onClick={handleBack}
										disabled={step === 0}
									>
										Back
									</Button>
									<Button type="submit" size="sm" className="font-medium">
										{step === 5 ? 'Submit' : 'Next'}
									</Button>
								</div>
							</form>
						</Form>
					)}

					{step === 3 && (
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
								<FormField
									key="pEta2oIW"
									control={control}
									name="pEta2oIW"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Horários de trabalho</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<div className="flex justify-between">
									<Button
										type="button"
										className="font-medium"
										size="sm"
										onClick={handleBack}
										disabled={step === 0}
									>
										Back
									</Button>
									<Button type="submit" size="sm" className="font-medium">
										{step === 5 ? 'Submit' : 'Next'}
									</Button>
								</div>
							</form>
						</Form>
					)}

					{step === 4 && (
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
								<FormField
									key="mKADQlQR"
									control={control}
									name="mKADQlQR"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Preços</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<div className="flex justify-between">
									<Button
										type="button"
										className="font-medium"
										size="sm"
										onClick={handleBack}
										disabled={step === 0}
									>
										Back
									</Button>
									<Button type="submit" size="sm" className="font-medium">
										{step === 5 ? 'Submit' : 'Next'}
									</Button>
								</div>
							</form>
						</Form>
					)}

					{step === 5 && (
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
								<FormField
									key="nCVyVBmL"
									control={control}
									name="nCVyVBmL"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Serviços oferecidos</FormLabel>
											<FormControl>
												<Input {...field} placeholder="" autoComplete="off" />
											</FormControl>
											<FormDescription />
										</FormItem>
									)}
								/>

								<div className="flex justify-between">
									<Button
										type="button"
										className="font-medium"
										size="sm"
										onClick={handleBack}
										disabled={step === 0}
									>
										Back
									</Button>
									<Button type="submit" size="sm" className="font-medium">
										{step === 5 ? 'Submit' : 'Next'}
									</Button>
								</div>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
