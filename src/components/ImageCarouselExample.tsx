'use client';
import { ImageCarousel } from './ImageCarousel';

export const ImageCarouselExample = () => {
	// Exemplo com configurações customizadas
	const customImages = [
		{
			src: 'https://picsum.photos/1200/800?random=1',
			thumb: 'https://picsum.photos/600/400?random=1',
			alt: 'Paisagem Natural',
		},
		{
			src: 'https://picsum.photos/1200/800?random=2',
			thumb: 'https://picsum.photos/600/400?random=2',
			alt: 'Arquitetura Moderna',
		},
		{
			src: 'https://picsum.photos/1200/800?random=3',
			thumb: 'https://picsum.photos/600/400?random=3',
			alt: 'Arte Abstrata',
		},
	];

	// Toolbar personalizada
	const customToolbar = (overlayProps: any) => {
		return (
			<div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
				<h3 className="text-white text-xl font-bold">
					Galeria de Fotos
				</h3>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => overlayProps.onScale(overlayProps.scale + 0.5)}
						className="bg-white/20 backdrop-blur px-4 py-2 rounded text-white hover:bg-white/30"
					>
						Zoom +
					</button>
					<button
						type="button"
						onClick={() => overlayProps.onScale(overlayProps.scale - 0.5)}
						className="bg-white/20 backdrop-blur px-4 py-2 rounded text-white hover:bg-white/30"
					>
						Zoom -
					</button>
					<button
						type="button"
						onClick={overlayProps.onClose}
						className="bg-red-500/80 backdrop-blur px-4 py-2 rounded text-white hover:bg-red-600"
					>
						Fechar
					</button>
				</div>
			</div>
		);
	};

	// Overlay personalizado
	const customOverlay = (overlayProps: any) => {
		const currentImage = customImages[overlayProps.index];
		return (
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
				<h2 className="text-white text-2xl font-bold mb-2">
					{currentImage?.alt}
				</h2>
				<p className="text-white/80 mb-4">
					Foto {overlayProps.index + 1} de {customImages.length}
				</p>
				<div className="flex gap-4">
					<button
						type="button"
						className="bg-white/20 backdrop-blur px-4 py-2 rounded text-white hover:bg-white/30"
					>
						<i className="hi-heart mr-2" />
						Curtir
					</button>
					<button
						type="button"
						className="bg-white/20 backdrop-blur px-4 py-2 rounded text-white hover:bg-white/30"
					>
						<i className="hi-share mr-2" />
						Compartilhar
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-8">
			{/* Exemplo básico */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Exemplo Básico</h2>
				<ImageCarousel />
			</div>

			{/* Exemplo com customizações */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Exemplo Customizado</h2>
				<ImageCarousel
					images={customImages}
					photoViewConfig={{
						// Velocidade das animações
						speed: () => 300,
						// Função de easing customizada
						easing: () => 'cubic-bezier(0.4, 0, 0.2, 1)',
						// Opacidade do fundo
						maskOpacity: 0.9,
						// Classe CSS para o fundo
						maskClassName: 'backdrop-blur-md',
						// Loop nas imagens
						loop: true,
						// Toolbar customizada
						toolbarRender: customToolbar,
						// Overlay customizado
						overlayRender: customOverlay,
					}}
				/>
			</div>

			{/* Exemplo minimalista */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Exemplo Minimalista</h2>
				<ImageCarousel
					images={customImages}
					photoViewConfig={{
						// Remove a toolbar
						toolbarRender: () => null,
						// Remove o overlay
						overlayRender: () => null,
						// Animação mais rápida
						speed: () => 200,
						// Fundo mais transparente
						maskOpacity: 0.5,
					}}
				/>
			</div>
		</div>
	);
};