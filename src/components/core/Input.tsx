import { useSlot, useStyled } from "use-styled";

const InputRoot = useStyled("div", {
	base: {
		className: "relative",
	},
});

const InputLabel = useStyled("label", {
	base: {
		className: `
      absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none
      text-base text-slate-500 transition-all duration-200 ease-in-out
      peer-[:focus,:not(:placeholder-shown)]:top-3 peer-[:focus,:not(:placeholder-shown)]:text-sm peer-[:focus,:not(:placeholder-shown)]:text-slate-900
    `,
	},
});

const InputField = useStyled("input", {
	base: {
		className:
			"peer h-12 w-full rounded border border-gray-300 bg-white px-2 pt-5 pb-1 text-base text-black outline-none",
		placeholder: "",
	},
});

export const Input = useSlot(InputRoot, {
	label: InputLabel,
	field: InputField,
});

// how to use:
// <Input>
//   <Input.label>Email</Input.label>
//   <Input.field type="email" />
// </Input>
