import { Accordion, AccordionItem, Card, Chip } from '@heroui/react';
import type { Price } from '@/api/utils/schemas/escort-core';
import { Button } from '@/components/core/Button';
import { Icon } from '@/components/core/Icon';
import { Stack } from '@/components/core/Stack';

// import type { AnalyticsEventType } from '@/hooks/useAnalytics';

interface AccordionPriceProps {
	variant: 'web' | 'mobile';
	profile: {
		prices?: Price[] | null;
	};
	handleWhatsAppClick?: () => void;
	handlePhoneClick?: () => void;
}

export const AccordionPrice = ({
	variant,
	profile,
	handleWhatsAppClick,
	handlePhoneClick,
}: AccordionPriceProps) => {
	const priceTranslations: Record<Price['slot'], string> = {
		'30m': '30 minutos:',
		'1h': '1 hora:',
		'2h': '2 horas:',
		'4h': '4 horas:',
		daily: 'Diária:',
		overnight: 'Pernoite:',
		travel: 'Diária de viagem:',
		outcall: 'Deslocação:',
	};
	const price = profile.prices?.find((price) => price.slot === '1h');
	const priceLabel = price?.amount ? `€${price.amount} / 1h` : 'Consultar';

	const cardContent = (
		<Card
			className={
				variant === 'mobile' ? 'rounded-t-xl rounded-b-none p-5' : 'p-5'
			}
		>
			<Chip color="primary" variant="flat" radius="sm">
				Preços
			</Chip>
			<Accordion>
				<AccordionItem
					key="prices"
					aria-label="Tabela de preços"
					indicator={<Icon name="ArrowLeft" variant="stroke" size="20" />}
					classNames={{ indicator: 'text-foreground' }}
					title={
						<Stack
							direction="row"
							className="w-full items-center justify-between"
						>
							<h3>{priceLabel}</h3>
						</Stack>
					}
				>
					{(profile.prices ?? []).map((price) => (
						<Stack
							key={price.slot}
							direction="row"
							className="items-center gap-1 border-divider/40 border-b py-4 first:pt-0 last:border-b-0"
						>
							<span className="font-bold">{priceTranslations[price.slot]}</span>
							<span className="font-light">
								{price.is_available ? `€ ${price.amount}` : 'Não realiza'}
							</span>
						</Stack>
					))}
				</AccordionItem>
			</Accordion>

			<Stack direction="row" className="w-full gap-2">
				<Button
					className="w-full"
					size={variant === 'mobile' ? 'md' : undefined}
					onPress={handleWhatsAppClick}
				>
					WhatsApp
				</Button>
				<Button
					className="w-full"
					size={variant === 'mobile' ? 'md' : undefined}
					onPress={handlePhoneClick}
				>
					Telefone
				</Button>
			</Stack>
		</Card>
	);

	if (variant === 'mobile') {
		return (
			<div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
				{cardContent}
			</div>
		);
	}

	return cardContent;
};
