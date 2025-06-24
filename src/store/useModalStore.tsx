import { create } from "zustand";
import { createSelectors } from "@/utils/createSelectors";

export type State = {
	open: boolean;
};

export type Actions = {
	setOpen: (open: boolean) => void;
};

export const ModalStore = create<State & Actions>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
}));

export const useModalStore = createSelectors(ModalStore);
