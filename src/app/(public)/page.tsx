import { FlipText } from "@/components/core/FlipText";
import { Select } from "@/components/core/Select";
import { Text } from "@/components/core/Text";
import { Pattern } from "@/components/Pattern";

export default function Home() {
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
					<Select className="max-w-md">
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
				</div>
			</Pattern>
		</>
	);
}
