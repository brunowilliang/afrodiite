import { useSlot, useStyled } from "use-styled";

const SelectRoot = useStyled("a", {
	base: {
		className:
			"flex w-full cursor-pointer flex-col justify-center rounded-2xl border-2 border-stroke bg-gradient-to-br bg-opacity-80 from-background/80 via-tertiary/60 to-background/40 px-4 py-2 backdrop-blur-[5px]",
	},
});

const SelectLabel = useStyled("p", {
	base: {
		className: "pt-1 text-sm text-text-secondary",
	},
});

const SelectField = useStyled("p", {
	base: {
		className: "text-lg text-text-secondary",
	},
});

export const Select = useSlot(SelectRoot, {
	label: SelectLabel,
	field: SelectField,
});
