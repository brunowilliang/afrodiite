import {
  Body as BodyEmail,
  Container as ContainerEmail,
  Section as SectionEmail,
  Text as TextEmail,
} from "@react-email/components";

import { useSlot, useStyled } from "use-styled";

const BodyRoot = useStyled(BodyEmail, {
  base: {
    className: "my-10 font-sans",
  },
});

const ContainerRoot = useStyled(ContainerEmail, {
  base: {
    className: "max-w-[500px] rounded-2xl bg-[#131214] p-10 text-[#efe6fc]",
  },
});

const SectionRoot = useStyled(SectionEmail, {
  base: {
    className: "my-5",
  },
});

const BorderRoot = useStyled(SectionEmail, {
  base: {
    className: "my-10 h-[2px] bg-[#1A1A1E]",
  },
});

const TextRoot = useStyled(TextEmail, {
  base: {
    className: "m-0 text-sm",
  },
});

export const Body = useSlot(BodyRoot, {
  Container: ContainerRoot,
  Section: SectionRoot,
  Border: BorderRoot,
  Text: TextRoot,
});
