"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { FlipText } from "@/components/core/FlipText";
import { Modal, ModalContent, type ModalRef } from "@/components/core/Modal";
import { Select } from "@/components/core/Select";
import { Text } from "@/components/core/Text";
import { Pattern } from "@/components/Pattern";
import { Button } from "@/components/ui/button";

export default function Home() {
	const router = useRouter();
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<Pattern>
				<div className="centered flex max-w-screen-2xl flex-col gap-10 px-4">
					<Text variant="title">
						Encontre as
						<br />
						acompanhantes de luxo
						<br />
						mais exclusivas de Portugal
					</Text>
					<Text as="p" className="text-lg tracking-wider">
						Explore por cidade
					</Text>
					<Select className="max-w-md" onClick={() => modalRef.current?.open()}>
						<Select.label>Localização</Select.label>
						<FlipText
							words={[
								"Porto,",
								"Lisboa,",
								"Faro,",
								"Braga,",
								"Coimbra,",
								"Aveiro,",
								"Nazaré,",
							]}
						/>
					</Select>
					<Button onClick={() => router.push("/dashboard")}>
						go to dashboard
					</Button>
				</div>
			</Pattern>

			<Modal ref={modalRef}>
				<ModalContent>
					<Text variant="title" className="mb-4">
						Selecione uma cidade
					</Text>
					<Text as="p">Conteúdo do modal aqui...</Text>
				</ModalContent>
			</Modal>
		</>
	);
}
