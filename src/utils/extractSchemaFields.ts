export const extractSchemaFields = <T extends Record<string, any>>(
	schema: { shape: Record<string, any> },
	data: Record<string, any> | null | undefined,
): Partial<T> => {
	if (!data) return {} as Partial<T>;
	const schemaKeys = Object.keys(schema.shape);
	return Object.fromEntries(
		schemaKeys.map((key) => {
			const value = data[key];
			// Para campos de string, sempre retorna string vazia se for null/undefined
			if (value === null || value === undefined) {
				return [key, ''];
			}
			return [key, value];
		}),
	) as Partial<T>;
};
