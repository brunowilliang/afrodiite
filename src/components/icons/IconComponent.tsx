import type React from "react";
import type { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
	icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
	altIcon?: React.ComponentType<SVGProps<SVGSVGElement>>;
	showAlt?: boolean;
	size?: number;
}

export const IconComponent = ({
	icon: MainComponent,
	altIcon: AltComponent,
	showAlt = false,
	size = 24,
	...rest
}: IconProps) => {
	if (!MainComponent) {
		console.warn('The "icon" property is required and was not provided.');
		return null;
	}

	const Component = showAlt && AltComponent ? AltComponent : MainComponent;

	if (showAlt && !AltComponent) {
		console.warn(
			'The "showAlt" property is true, but "altIcon" was not provided. Rendering the main icon.',
		);
	}

	return <Component width={size} height={size} {...rest} />;
};
