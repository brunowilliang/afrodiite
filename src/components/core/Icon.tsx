import type { ComponentProps } from "react";
import { useStyled } from "use-styled";
import { IconComponent } from "../icons/IconComponent";
import { Home, HomeBulk } from "../icons/icons/Home";

export type IconProps = ComponentProps<typeof Icon>;

export const Icon = useStyled(IconComponent, {
	variants: {
		name: {
			Home: {
				icon: Home,
				altIcon: HomeBulk,
			},
		},
	},
});
