// import * as React from 'react';
import { ConfirmYourAccount } from '@/lib/email/templates/confirm-your-account';
import { sendEmail } from '../src/lib/email';

async function main() {
	const to = process.env.TEST_TO;
	if (!to) {
		console.error(
			'Missing TEST_TO env. Usage: TEST_TO=user@example.com bun run scripts/send-test-email.ts',
		);
		process.exit(1);
	}

	const res = await sendEmail({
		to,
		subject: 'Afrodiite • Teste de envio',
		text: 'Versão texto do e-mail de teste',
		react: ConfirmYourAccount({ name: 'Bruno Garcia' }),
	});

	console.log('Email queued:', res);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
