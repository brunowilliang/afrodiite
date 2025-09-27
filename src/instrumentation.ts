export async function register() {
	// ✅ Só carrega no Node.js runtime (não no Edge)
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await import('./lib/orpc/server');
	}
}
