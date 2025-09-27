import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { reset, seed } from 'drizzle-seed';
import type { GalleryItem } from '@/api/utils/schemas/escort-core';
import { createDefaults } from '@/api/utils/schemas/escort-core';
import { env } from '@/env';
import { PortugalDistricts } from '@/utils/lists/Portugal';
import { tryCatch } from '@/utils/tryCatch';
import { db } from './index';
import * as schema from './schemas';

// Create a separate db instance for seeding without schema
const seedDb = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
});

const IMAGES = [
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-1.jpg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-2.jpg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-3.jpg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-4.jpg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-5.png',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-6.png',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/teste/image-7.png',
	},
];

// Pre-generate many valid location combinations for seeding
const LOCATION_COMBINATIONS = Array.from({ length: 500 }, () => {
	const randomIndex = Math.floor(Math.random() * PortugalDistricts.length);
	const combo = PortugalDistricts[randomIndex];
	return `${combo.district}|${combo.city}`;
});

const NATIONALITIES = [
	'Portuguesa',
	'Brasileira',
	'Espanhola',
	'Italiana',
	'Francesa',
	'Russa',
	'Ucraniana',
	'Romena',
	'Búlgara',
	'Venezuelana',
	'Colombiana',
	'Argentina',
];

const SERVICES_VALUES = Array.from({ length: 34 }, (_, i) => i + 1);

function generateRandomServices(): number[] {
	const sizes = [8, 10, 12, 15, 18, 20, 25, 30, 34];
	const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
	const shuffled = [...SERVICES_VALUES].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, randomSize);
}

// Generate a realistic gallery with random count and order
function generateGallery(imageCount: number): GalleryItem[] {
	const shuffledImages = [...IMAGES].sort(() => Math.random() - 0.5);
	const selectedImages = shuffledImages.slice(0, imageCount);

	return selectedImages.map((image, index) => ({
		id: `gallery-${Date.now()}-${index}`,
		path: `teste/image-${index + 1}`,
		url: image.url,
		size: Math.floor(Math.random() * 500000) + 100000, // 100KB to 600KB
		order: index,
		createdAt: new Date().toISOString(),
	}));
}

// Generate different gallery variations
const GALLERY_VARIATIONS = [
	generateGallery(2),
	generateGallery(3),
	generateGallery(4),
	generateGallery(6),
	generateGallery(7),
];

export async function seedDatabase() {
	console.log('🌱 Starting database seeding...');

	// Reset database first
	console.time('reset');
	await reset(seedDb, schema);
	console.log('🗑️ Database reset completed');
	console.timeEnd('reset');

	const COUNT = 1000;

	const FEMALE_FULLNAMES = Array.from({ length: COUNT }, () =>
		faker.person.fullName({ sex: 'female' }),
	);

	console.time('seed-insert');
	await seed(seedDb, schema, { count: COUNT }).refine((f) => ({
		users: {
			columns: {
				id: f.uuid(),
				name: f.valuesFromArray({ values: FEMALE_FULLNAMES, isUnique: true }),
				email: f.email(),
				emailVerified: f.default({ defaultValue: true }),
				image: f.default({ defaultValue: null }),
				role: f.default({ defaultValue: 'escort' }),
			},
			with: {
				escortProfiles: 1, // Each user gets exactly 1 escort profile
			},
		},
		escortProfiles: {
			columns: {
				public_id: f.int({ minValue: 1000, maxValue: 9999 }),
				name: f.valuesFromArray({ values: FEMALE_FULLNAMES }),
				artist_name: f.valuesFromArray({ values: FEMALE_FULLNAMES }),
				slug: f.string({ isUnique: true }),
				description: f.loremIpsum({ sentencesCount: 10 }),
				birthday: f.date({ minDate: '1990-01-01', maxDate: '2004-12-31' }),
				phone: f.phoneNumber({ template: '+351 9## ### ###' }),
				whatsapp: f.phoneNumber({ template: '+351 9## ### ###' }),
				email: f.email(),
				nationality: f.valuesFromArray({ values: NATIONALITIES }),
				district: f.valuesFromArray({ values: LOCATION_COMBINATIONS }),
				city: f.default({ defaultValue: 'temp' }),
				country: f.default({ defaultValue: 'Portugal' }),
				is_active: f.boolean(),
				is_verified: f.boolean(),
				links: f.default({ defaultValue: {} }),
				office_hours: f.default({ defaultValue: createDefaults.officeHours() }),
				prices: f.default({ defaultValue: createDefaults.prices() }),
				characteristics: f.default({
					defaultValue: {
						gender: 'feminino',
						age: 25,
						height: 165,
						weight: 55,
						hair_color: 'castanho',
						eye_color: 'castanho',
						sexual_preference: 'heterossexual',
						ethnicity: 'caucasiana',
						silicone: false,
						tattoos: false,
						piercings: false,
						smoker: false,
						languages: 'Português, Inglês',
					},
				}),
				services: f.weightedRandom([
					{
						weight: 0.4,
						value: f.default({ defaultValue: generateRandomServices() }),
					},
					{
						weight: 0.3,
						value: f.default({ defaultValue: generateRandomServices() }),
					},
					{
						weight: 0.2,
						value: f.default({ defaultValue: generateRandomServices() }),
					},
					{
						weight: 0.1,
						value: f.default({ defaultValue: generateRandomServices() }),
					},
				]),
				gallery: f.weightedRandom([
					{
						weight: 0.3,
						value: f.default({ defaultValue: GALLERY_VARIATIONS[0] }),
					},
					{
						weight: 0.3,
						value: f.default({ defaultValue: GALLERY_VARIATIONS[1] }),
					},
					{
						weight: 0.2,
						value: f.default({ defaultValue: GALLERY_VARIATIONS[2] }),
					},
					{
						weight: 0.1,
						value: f.default({ defaultValue: GALLERY_VARIATIONS[3] }),
					},
					{
						weight: 0.1,
						value: f.default({ defaultValue: GALLERY_VARIATIONS[4] }),
					},
				]),
			},
		},
	}));
	console.timeEnd('seed-insert');

	// Fix district/city correspondence after seeding in a single batch UPDATE
	console.log('🔧 Parsing and fixing district/city data...');
	console.time('fix-district-city');

	const [fixErr] = await tryCatch(async () => {
		await db
			.update(schema.escortProfiles)
			.set({
				city: sql`substr(${schema.escortProfiles.district}, instr(${schema.escortProfiles.district}, '|') + 1)`,
				district: sql`substr(${schema.escortProfiles.district}, 1, instr(${schema.escortProfiles.district}, '|') - 1)`,
			})
			.where(sql`instr(${schema.escortProfiles.district}, '|') > 0`);
	});

	if (fixErr) {
		console.error('❌ Failed to fix district/city', fixErr);
	}
	console.timeEnd('fix-district-city');

	console.log('✅ Database seeding completed successfully!');
	console.log('📊 Generated 1000 users with escort profiles');
	console.log('🖼️ Each profile has 2-7 random gallery images');
	console.log('🗺️ District/city correspondence fixed');
}

// Run seed if this file is executed directly
if (require.main === module) {
	seedDatabase().catch(console.error);
}
