import { createElement } from "react";
import { useStyled } from "use-styled";

type TextBaseProps = React.HTMLAttributes<HTMLElement> & {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
};

export function TextBase({ as = "span", children, ...props }: TextBaseProps) {
	return createElement(as, { ...props }, children);
}

export const Text = useStyled(TextBase, {
	base: {
		className: "text-text-primary",
	},
	variants: {
		as: {
			h1: { as: "h1", className: "text-4xl" },
			h2: { as: "h2", className: "text-3xl" },
			h3: { as: "h3", className: "text-2xl" },
			h4: { as: "h4", className: "text-xl" },
			h5: { as: "h5", className: "text-lg tracking-wider" },
			h6: { as: "h6", className: "text-base tracking-wider" },
			p: { as: "p", className: "text-base tracking-wider" },
			span: { as: "span", className: "text-base tracking-wider" },
		},

		light: { true: { className: "font-light" } },
		medium: { true: { className: "font-medium" } },

		center: { true: { className: "text-center" } },
		right: { true: { className: "text-right" } },
		left: { true: { className: "text-left" } },

		variant: {
			title: {
				className:
					"bg-gradient-to-br from-text-primary to-foreground bg-clip-text text-center font-bold text-4xl text-transparent md:text-5xl lg:text-6xl",
			},
		},
	},
	defaultVariants: {
		as: "p",
		light: true,
	},
});
