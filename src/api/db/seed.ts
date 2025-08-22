import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { nanoid } from 'nanoid';
import postgres from 'postgres';
import { DAYS, SLOTS } from '@/api/utils/defaults/escort';
import type {
	Characteristics,
	GalleryItem,
	OfficeHour,
	Price,
} from '@/api/utils/types/escort';
import { env } from '@/utils/env';
import { PortugalDistricts } from '@/utils/lists/Portugal';
import { escortProfiles, users } from './schemas';

const client = postgres(env.DATABASE_URL, {
	prepare: false,
});

const db = drizzle(client);

// Imagens reais do Supabase
const REAL_IMAGES = [
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/pvahOT1sSZa4MFKIE81RSHxONBKkudgb/14abdb95-5ff6-4401-8f14-1860635b446f.jpeg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/pvahOT1sSZa4MFKIE81RSHxONBKkudgb/19116f86-9c50-45fa-9aef-01513041b65e.jpeg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/pvahOT1sSZa4MFKIE81RSHxONBKkudgb/69c6c68c-d1a8-45c8-9ad2-0ef99da44a28.jpeg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/pvahOT1sSZa4MFKIE81RSHxONBKkudgb/939e1adc-86da-426d-8c57-bd63808933ef.jpeg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/pvahOT1sSZa4MFKIE81RSHxONBKkudgb/db4b6ec6-4dfa-49c4-8690-6ac16fb74e3b.jpeg',
	},
	{
		url: 'https://leyxhjfeayjurjbnlhea.supabase.co/storage/v1/object/public/escort-gallery/pvahOT1sSZa4MFKIE81RSHxONBKkudgb/f809b216-4423-433c-9ffa-7861da663ba1.jpeg',
	},
];

function generateCharacteristics(): Characteristics {
	const age = faker.number.int({ min: 18, max: 45 });

	return {
		gender: 'Feminino',
		age,
		height: faker.number.int({ min: 150, max: 185 }), // cm
		weight: faker.number.int({ min: 45, max: 75 }), // kg
		hair_color: faker.helpers.arrayElement([
			'Loiro',
			'Castanho',
			'Preto',
			'Ruivo',
			'Platinado',
			'Moreno',
		]),
		eye_color: faker.helpers.arrayElement([
			'Azuis',
			'Castanhos',
			'Verdes',
			'Pretos',
			'Mel',
		]),
		sexual_preference: faker.helpers.arrayElement([
			'Heterossexual',
			'Bissexual',
			'Pansexual',
		]),
		ethnicity: faker.helpers.arrayElement([
			'Caucasiana',
			'Latina',
			'Mestiça',
			'Asiática',
			'Afrodescendente',
		]),
		silicone: faker.datatype.boolean({ probability: 0.3 }),
		tattoos: faker.datatype.boolean({ probability: 0.4 }),
		piercings: faker.datatype.boolean({ probability: 0.2 }),
		smoker: faker.datatype.boolean({ probability: 0.1 }),
		languages: faker.helpers
			.arrayElements(
				['Português', 'Inglês', 'Espanhol', 'Francês', 'Italiano'],
				{ min: 1, max: 3 },
			)
			.join(', '),
	};
}

function generateGallery(): GalleryItem[] {
	// Entre 2-6 imagens aleatórias das 6 disponíveis
	const gallerySize = faker.number.int({ min: 2, max: 6 });
	const selectedImages = faker.helpers.arrayElements(REAL_IMAGES, gallerySize);

	return selectedImages.map((image, index) => ({
		id: nanoid(),
		path: `/images/profiles/${faker.string.uuid()}.jpg`,
		url: image.url,
		size: faker.number.int({ min: 150000, max: 800000 }), // bytes
		width: 800,
		height: 1200,
		order: index + 1,
		createdAt: faker.date.recent({ days: 30 }).toISOString(),
	}));
}

function generatePrices(): Price[] {
	return SLOTS.map((slot) => {
		// SEMPRE ativo para 1h, outros com 70% probabilidade
		const isAvailable =
			slot === '1h' ? true : faker.datatype.boolean({ probability: 0.7 });
		let amount = 0;

		if (isAvailable) {
			// Preços realistas baseados no slot
			switch (slot) {
				case '30m':
					amount = faker.number.int({ min: 80, max: 150 });
					break;
				case '1h':
					amount = faker.number.int({ min: 150, max: 300 }); // SEMPRE preenchido!
					break;
				case '2h':
					amount = faker.number.int({ min: 250, max: 500 });
					break;
				case '4h':
					amount = faker.number.int({ min: 400, max: 800 });
					break;
				case 'overnight':
					amount = faker.number.int({ min: 800, max: 1500 });
					break;
				case 'daily':
					amount = faker.number.int({ min: 1200, max: 2500 });
					break;
				case 'travel':
					amount = faker.number.int({ min: 2000, max: 5000 });
					break;
				case 'outcall':
					amount = faker.number.int({ min: 200, max: 400 });
					break;
			}
		}

		return {
			slot,
			is_available: isAvailable,
			amount,
			negotiated:
				slot === '1h' ? false : faker.datatype.boolean({ probability: 0.2 }), // 1h nunca negociável
			currency: 'EUR' as const,
		};
	});
}

function generateOfficeHours(): OfficeHour[] {
	return DAYS.map((day) => {
		const isAvailable = faker.datatype.boolean({
			probability: day === 'sunday' ? 0.3 : 0.8,
		});

		let start = '09:00';
		let end = '23:59';

		if (isAvailable) {
			const startHour = faker.number.int({ min: 8, max: 12 });
			const endHour = faker.number.int({ min: 20, max: 23 });
			start = `${startHour.toString().padStart(2, '0')}:00`;
			end = `${endHour.toString().padStart(2, '0')}:59`;
		}

		return {
			day,
			is_available: isAvailable,
			start,
			end,
		};
	});
}

function generateEscortProfile() {
	const firstName = faker.person.firstName('female');
	const lastName = faker.person.lastName('female');
	const fullName = `${firstName} ${lastName}`;

	// Nomes artísticos mais realistas
	const artisticNames = [
		'Luna',
		'Mia',
		'Zara',
		'Sasha',
		'Kiara',
		'Diva',
		'Angel',
		'Cherry',
		'Jade',
		'Maya',
		'Stella',
		'Ruby',
		'Bella',
		'Eva',
		'Gia',
		'Lara',
		'Nora',
		'Sofia',
		'Aria',
		'Cora',
		'Lila',
	];

	const artistName = faker.helpers.arrayElement(artisticNames);
	const location = faker.helpers.arrayElement(PortugalDistricts);
	const characteristics = generateCharacteristics();

	// Descrição mais realista baseada nas características
	const descriptions = [
		`Olá, sou a ${artistName}! Uma mulher elegante de ${characteristics.age} anos, com cabelos ${characteristics.hair_color.toLowerCase()} e olhos ${characteristics.eye_color.toLowerCase()}. Adoro conversar e proporcionar momentos únicos.`,
		`${artistName} aqui! Sou uma pessoa carinhosa e atenciosa de ${location.cidade}. Com ${characteristics.height}cm de altura, sempre pronta para uma boa conversa e experiências especiais.`,
		`Me chamo ${artistName}, tenho ${characteristics.age} anos e moro em ${location.cidade}. Sou uma mulher sofisticada que valoriza conexões genuínas e momentos memoráveis.`,
	];

	return {
		user: {
			id: nanoid(),
			name: fullName,
			email: faker.internet.email({
				firstName: artistName.toLowerCase(),
				lastName: faker.number.int({ min: 100, max: 999 }).toString(),
			}),
			emailVerified: true,
			role: 'escort' as const,
		},
		profile: {
			name: fullName,
			artist_name: artistName,
			slug: `${artistName.toLowerCase()}-${location.cidade.toLowerCase().replace(/\s+/g, '-')}-${faker.number.int({ min: 100, max: 999 })}`,
			description: faker.helpers.arrayElement(descriptions),
			birthday: faker.date
				.between({
					from: new Date(
						new Date().getFullYear() - characteristics.age - 1,
						0,
						1,
					),
					to: new Date(new Date().getFullYear() - characteristics.age, 11, 31),
				})
				.toISOString()
				.split('T')[0],
			phone: `9${faker.number.int({ min: 10000000, max: 99999999 })}`,
			whatsapp: `9${faker.number.int({ min: 10000000, max: 99999999 })}`,
			email: faker.internet.email(),
			nationality: faker.helpers.arrayElement([
				'Portuguesa',
				'Brasileira',
				'Espanhola',
				'Italiana',
				'Francesa',
				'Russa',
				'Ucraniana',
				'Romena',
			]),
			district: location.distrito,
			zone: location.cidade,
			country: 'Portugal',
			is_active: faker.datatype.boolean({ probability: 0.75 }),
			is_verified: faker.datatype.boolean({ probability: 0.6 }),

			// Dados completos das estruturas complexas
			characteristics,
			gallery: generateGallery(),
			prices: generatePrices(),
			office_hours: generateOfficeHours(),
			services: faker.helpers.arrayElements(
				Array.from({ length: 20 }, (_, i) => i + 1),
				{ min: 3, max: 10 },
			),
			links: {
				instagram: faker.datatype.boolean({ probability: 0.7 })
					? faker.internet.url({ appendSlash: false })
					: undefined,
				twitter: faker.datatype.boolean({ probability: 0.3 })
					? faker.internet.url({ appendSlash: false })
					: undefined,
				website: faker.datatype.boolean({ probability: 0.2 })
					? faker.internet.url({ appendSlash: false })
					: undefined,
			},
		},
	};
}

async function main() {
	console.log('🌱 Iniciando seed com Faker.js...');

	try {
		// Deletar dados existentes (cuidado em produção!)
		console.log('🗑️ Limpando dados existentes...');
		await db.delete(escortProfiles);
		await db.delete(users).where(eq(users.role, 'escort'));

		console.log('👥 Gerando 200 escort profiles completos...');

		const profiles = [];
		for (let i = 0; i < 200; i++) {
			profiles.push(generateEscortProfile());
			if (i % 50 === 0) {
				console.log(`📊 Gerados ${i}/200 profiles...`);
			}
		}

		console.log('💾 Inserindo usuários...');
		const insertedUsers = await db
			.insert(users)
			.values(profiles.map((p) => p.user))
			.returning();

		console.log('👤 Inserindo escort profiles completos...');
		await db.insert(escortProfiles).values(
			profiles.map((profile, index) => ({
				id: insertedUsers[index].id,
				...profile.profile,
			})),
		);

		console.log('✅ Seed concluído com sucesso!');
		console.log(`📊 Criados ${profiles.length} escort profiles completos`);
		console.log(
			'📋 Incluindo: Characteristics, Gallery, Prices, Office Hours, Services, Links',
		);
	} catch (error) {
		console.error('❌ Erro durante o seed:', error);
		throw error;
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error('💥 Falha no seed:', error);
	process.exit(1);
});
