import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const name = searchParams.get('name');
		const city = searchParams.get('city');
		const hasParams = name || city;

		// Load Outfit fonts from local files
		const fontsDir = join(process.cwd(), 'public', 'fonts', 'Outfit');

		const outfitRegular = await readFile(join(fontsDir, 'outfit-regular.ttf'));

		const outfitBold = await readFile(join(fontsDir, 'outfit-bold.ttf'));

		// Load SVG background
		const svgBackground = await readFile(
			join(process.cwd(), 'public', 'og-background.svg'),
			'utf-8',
		);
		const svgBase64 = Buffer.from(svgBackground).toString('base64');
		const svgDataUri = `data:image/svg+xml;base64,${svgBase64}`;

		// Load logo SVG
		const logoSvg = await readFile(
			join(process.cwd(), 'public', 'logo.svg'),
			'utf-8',
		);
		const logoBase64 = Buffer.from(logoSvg).toString('base64');
		const logoDataUri = `data:image/svg+xml;base64,${logoBase64}`;

		return new ImageResponse(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundImage: `url('${svgDataUri}')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					fontFamily: 'Outfit, system-ui, -apple-system, sans-serif',
					position: 'relative',
					gap: 40,
				}}
			>
				{/* Logo */}
				{/* biome-ignore lint: OG image generation requires native img tag */}
				<img
					src={logoDataUri}
					alt="Afrodiite"
					width={hasParams ? 280 : 500}
					height={hasParams ? 72.91 : 130.2}
				/>

				{/* Main content group - Only show if params are provided */}
				{hasParams && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 25,
						}}
					>
						{/* Subtitle */}
						<div
							style={{
								fontSize: 60,
								fontWeight: 300,
								color: 'rgba(255, 255, 255, 0.8)',
								display: 'flex',
							}}
						>
							Acompanhante de luxo
						</div>

						{/* Name (MAIN highlight) */}
						<div
							style={{
								fontSize: 90,
								fontWeight: 700,
								color: 'white',
								textAlign: 'center',
								display: 'flex',
								maxWidth: '90%',
								lineHeight: 0.8,
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{name}
						</div>

						{/* Location */}
						<div
							style={{
								fontSize: 60,
								fontWeight: 400,
								color: 'rgba(255, 255, 255, 0.95)',
								display: 'flex',
							}}
						>
							{city}, Portugal
						</div>
					</div>
				)}

				{/* URL */}
				<div
					style={{
						fontSize: hasParams ? 50 : 80,
						fontWeight: 400,
						color: 'rgba(255, 255, 255, 0.7)',
						display: 'flex',
					}}
				>
					www.afrodiite.com
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: 'Outfit',
						data: outfitRegular,
						style: 'normal',
						weight: 400,
					},
					{
						name: 'Outfit',
						data: outfitBold,
						style: 'normal',
						weight: 700,
					},
				],
			},
		);
	} catch (error) {
		console.error('Error generating OG image:', error);
		return new Response('Failed to generate image', { status: 500 });
	}
}
