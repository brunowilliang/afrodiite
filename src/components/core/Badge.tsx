import { useSlot, useStyled } from 'use-styled';
import { Icon } from './Icon';
import { Text } from './Text';

const BadgeRoot = useStyled('div', {
	base: {
		className: 'flex items-start gap-2',
	},
});

const BadgeTextRoot = useStyled(Text, {
	base: {
		as: 'p',
		weight: 'normal',
		className:
			'after:-z-1 relative z-2 px-3 py-1 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-1/2 after:rounded-sm after:bg-accent-10',
	},
});

export const Badge = useSlot(BadgeRoot, {
	Text: BadgeTextRoot,
	Icon,
});
