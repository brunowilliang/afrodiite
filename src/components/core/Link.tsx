import {
	createLink,
	type LinkComponent,
	Link as LinkTanstack,
} from '@tanstack/react-router';
import { useStyled } from 'use-styled';

const LinkRoot = useStyled(LinkTanstack, {
	variants: {
		teste: {
			true: {
				to: '/escorts',
			},
		},
	},
});

type LinkRootProps = LinkComponent<typeof LinkRoot>;

export const Link = createLink(LinkRoot as LinkRootProps);
