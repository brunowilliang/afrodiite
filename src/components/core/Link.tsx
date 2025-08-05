import { createLink, type LinkComponent } from '@tanstack/react-router';
import { useStyled } from 'use-styled';

const BaseLinkRoot = useStyled('a', {});

type BaseLinkRootProps = LinkComponent<typeof BaseLinkRoot>;

const BaseLink = createLink(BaseLinkRoot as BaseLinkRootProps);

export const Link: BaseLinkRootProps = (props) => {
	return <BaseLink preload="intent" {...props} />;
};
