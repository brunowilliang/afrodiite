#!/usr/bin/env bun

/**
 * Test script to validate environment variables and connections
 * Run with: bun run src/scripts/test-env.ts
 */

import { env, testConnections } from '@/lib/env';

async function main() {
	console.log('🧪 Testing environment configuration...\n');

	// Test environment validation
	console.log('📋 Environment Variables:');
	console.log('='.repeat(50));

	try {
		console.log('✅ Client Environment:');
		console.log(`  - VITE_BETTER_AUTH_URL: ${env.VITE_BETTER_AUTH_URL}`);
		console.log(`  - VITE_CORS_ORIGIN: ${env.VITE_CORS_ORIGIN}`);
		console.log(`  - VITE_SUPABASE_URL: ${env.VITE_SUPABASE_URL}`);
		console.log(
			`  - VITE_SUPABASE_PUBLISHABLE_KEY: ${env.VITE_SUPABASE_PUBLISHABLE_KEY.substring(0, 20)}...`,
		);
	} catch (error) {
		console.error('❌ Client Environment Failed:', error);
	}

	console.log('');

	try {
		console.log('✅ Server Environment:');
		console.log(
			`  - BETTER_AUTH_SECRET: ${env.BETTER_AUTH_SECRET.substring(0, 10)}... (${env.BETTER_AUTH_SECRET.length} chars)`,
		);
		console.log(
			`  - POLAR_ACCESS_TOKEN: ${env.POLAR_ACCESS_TOKEN.substring(0, 20)}...`,
		);
		console.log(
			`  - POLAR_WEBHOOK_SECRET: ${env.POLAR_WEBHOOK_SECRET.substring(0, 20)}...`,
		);
		console.log(
			`  - POLAR_ACCESS_TOKEN_SANDBOX: ${env.POLAR_ACCESS_TOKEN_SANDBOX.substring(0, 20)}...`,
		);
		console.log(
			`  - POLAR_WEBHOOK_SECRET_SANDBOX: ${env.POLAR_WEBHOOK_SECRET_SANDBOX.substring(0, 20)}...`,
		);
		console.log(`  - DATABASE_URL: ${env.DATABASE_URL.split('@')[0]}@***`);
		console.log(
			`  - DATABASE_POOL_URL: ${env.DATABASE_POOL_URL.split('@')[0]}@***`,
		);
	} catch (error) {
		console.error('❌ Server Environment Failed:', error);
	}

	console.log('\n🔌 Connection Tests:');
	console.log('='.repeat(50));

	// Test connections
	const results = await testConnections();

	console.log('\n📊 Test Results Summary:');
	console.log('='.repeat(50));
	console.log(`Client Environment: ${results.client ? '✅ PASS' : '❌ FAIL'}`);
	console.log(`Database URLs: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
	console.log(`Polar Configuration: ${results.polar ? '✅ PASS' : '❌ FAIL'}`);
	console.log(
		`Supabase Configuration: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`,
	);

	const allPassed = Object.values(results).every(Boolean);
	console.log(
		`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`,
	);

	if (!allPassed) {
		console.log('\n💡 Troubleshooting:');
		console.log(
			'  1. Check your .env file exists and has all required variables',
		);
		console.log('  2. Ensure all URLs are properly formatted');
		console.log(
			'  3. Verify secrets have correct prefixes (polar_oat_, polar_whs_)',
		);
		console.log('  4. Confirm database connection strings are valid');
		process.exit(1);
	}

	console.log('\n🎉 Environment configuration is ready!');
}

main().catch((error) => {
	console.error('💥 Test script failed:', error);
	process.exit(1);
});
